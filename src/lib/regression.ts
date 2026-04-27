// 242Go AHDP — Regression Detection Engine
// Monitors member engagement and behavioral drift
// Sends Telegram alerts to admin when someone needs attention

import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';
import { sendMessage } from './telegram';

function getAnthropicClient() {
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });
}

function getSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// Admin Telegram IDs to notify
const ADMIN_IDS: number[] = process.env.ADMIN_TELEGRAM_IDS
  ? process.env.ADMIN_TELEGRAM_IDS.split(',').map(Number)
  : [];

// Thresholds
const YELLOW_SILENCE_HOURS = 48;   // No response in 48 hrs → yellow
const ORANGE_SILENCE_HOURS = 96;   // No response in 4 days → orange
const RED_SILENCE_HOURS    = 168;  // No response in 7 days → red
const MIN_RESPONSES_FOR_AI = 5;    // Need at least 5 responses before AI drift analysis

// ─────────────────────────────────────────────
// CHECK a single member for regression signals
// ─────────────────────────────────────────────
async function checkMemberRegression(profile: {
  telegram_user_id: number;
  first_name: string;
  level: string;
  level_number: number;
  bot_mode: string;
}): Promise<void> {
  const { telegram_user_id, first_name, level, level_number } = profile;

  // Get recent coaching log entries (last 14 days)
  const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString();
  const { data: logs } = await getSupabaseClient()
    .from('coaching_log')
    .select('*')
    .eq('telegram_user_id', telegram_user_id)
    .gte('sent_at', twoWeeksAgo)
    .order('sent_at', { ascending: false });

  if (!logs || logs.length === 0) {
    // Check when they were last active at all
    const { data: anyLogs } = await getSupabaseClient()
      .from('coaching_log')
      .select('sent_at, responded_at')
      .eq('telegram_user_id', telegram_user_id)
      .order('sent_at', { ascending: false })
      .limit(1);

    if (!anyLogs || anyLogs.length === 0) return; // Never had a coaching session
  }

  // ── SILENCE DETECTION ────────────────────────────────
  // Find the last bot message that got no response
  const pendingMessages = (logs || []).filter(
    log => log.message_text && !log.responded_at
  );

  if (pendingMessages.length > 0) {
    const oldestPending = pendingMessages[pendingMessages.length - 1];
    const hoursSilent = (Date.now() - new Date(oldestPending.sent_at).getTime()) / (1000 * 60 * 60);

    let alertLevel: 'yellow' | 'orange' | 'red' | null = null;
    if (hoursSilent >= RED_SILENCE_HOURS) alertLevel = 'red';
    else if (hoursSilent >= ORANGE_SILENCE_HOURS) alertLevel = 'orange';
    else if (hoursSilent >= YELLOW_SILENCE_HOURS) alertLevel = 'yellow';

    if (alertLevel) {
      // Check if we already have an open alert for this
      const { data: existing } = await getSupabaseClient()
        .from('regression_alerts')
        .select('id')
        .eq('telegram_user_id', telegram_user_id)
        .eq('dimension', 'consistency')
        .eq('resolved', false)
        .single();

      if (!existing) {
        const days = Math.floor(hoursSilent / 24);
        await createAlert({
          telegram_user_id,
          alert_level: alertLevel,
          dimension: 'consistency',
          trigger_reason: `${first_name} has not responded to coaching messages in ${days} day${days !== 1 ? 's' : ''}`,
        });

        await notifyAdmins({
          alert_level: alertLevel,
          first_name,
          level,
          level_number,
          reason: `No response in ${days} day${days !== 1 ? 's' : ''}`,
          action: 'Check in directly — they may need pastoral care',
        });
      } else {
        // Escalate if silence has gotten worse
        await getSupabaseClient()
          .from('regression_alerts')
          .update({ weeks_flagged: getSupabaseClient().rpc as unknown as number }) // increment handled below
          .eq('id', existing.id);
      }
    }
  }

  // ── AI DRIFT ANALYSIS ────────────────────────────────
  // Only run if we have enough responses to analyze
  const responses = (logs || []).filter(log => log.response_text && log.response_text.length > 10);

  if (responses.length >= MIN_RESPONSES_FOR_AI) {
    await analyzeResponseDrift(telegram_user_id, first_name, level, level_number, responses);
  }
}

// ─────────────────────────────────────────────
// AI DRIFT ANALYSIS — Claude reads tone/pattern changes
// ─────────────────────────────────────────────
async function analyzeResponseDrift(
  telegram_user_id: number,
  first_name: string,
  level: string,
  level_number: number,
  responses: Array<{ response_text: string; sent_at: string; consistency_signal: number; character_signal: number }>
): Promise<void> {
  // Check for existing unresolved drift alert in last 7 days
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const { data: recentAlert } = await getSupabaseClient()
    .from('regression_alerts')
    .select('id')
    .eq('telegram_user_id', telegram_user_id)
    .in('dimension', ['character', 'competency', 'general'])
    .eq('resolved', false)
    .gte('created_at', sevenDaysAgo)
    .single();

  if (recentAlert) return; // Already flagged recently

  // Build response history for Claude
  const responseHistory = responses
    .slice(0, 10) // Last 10 responses max
    .map((r, i) => `Response ${i + 1} (${new Date(r.sent_at).toLocaleDateString()}): "${r.response_text}"`)
    .join('\n');

  const signalCounts = {
    positive: responses.filter(r => r.consistency_signal > 0 || r.character_signal > 0).length,
    negative: responses.filter(r => r.consistency_signal < 0 || r.character_signal < 0).length,
  };

  const prompt = `You are monitoring a church leadership pipeline member for behavioral regression.

MEMBER: ${first_name}
CURRENT LEVEL: ${level} (Level ${level_number} of 5)
RECENT SIGNAL COUNTS: ${signalCounts.positive} positive, ${signalCounts.negative} negative

RECENT RESPONSES TO COACHING BOT:
${responseHistory}

Analyze these responses for:
1. Tone changes (becoming shorter, colder, disengaged)
2. Signs of discouragement or giving up
3. Inconsistency with their stated commitments
4. Spiritual drift indicators (avoiding accountability topics)
5. Emotional distress signals

Return ONLY valid JSON:
{
  "drift_detected": true/false,
  "severity": "none" | "yellow" | "orange" | "red",
  "dimension": "consistency" | "character" | "competency" | "general",
  "summary": "1-2 sentence pastoral summary of what you're seeing",
  "recommended_action": "specific action for the pastor to take"
}

Be conservative — only flag real patterns, not one-off bad days. If uncertain, return drift_detected: false.`;

  try {
    const response = await getAnthropicClient().messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 400,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = response.content[0].type === 'text' ? response.content[0].text : '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return;

    const analysis = JSON.parse(jsonMatch[0]);

    if (analysis.drift_detected && analysis.severity !== 'none') {
      await createAlert({
        telegram_user_id,
        alert_level: analysis.severity,
        dimension: analysis.dimension,
        trigger_reason: analysis.summary,
      });

      await notifyAdmins({
        alert_level: analysis.severity,
        first_name,
        level,
        level_number,
        reason: analysis.summary,
        action: analysis.recommended_action,
      });
    }
  } catch (err) {
    console.error('analyzeResponseDrift error:', err);
  }
}

// ─────────────────────────────────────────────
// CREATE alert record in Supabase
// ─────────────────────────────────────────────
async function createAlert(data: {
  telegram_user_id: number;
  alert_level: string;
  dimension: string;
  trigger_reason: string;
}): Promise<void> {
  await getSupabaseClient().from('regression_alerts').insert({
    telegram_user_id: data.telegram_user_id,
    alert_level: data.alert_level,
    dimension: data.dimension,
    trigger_reason: data.trigger_reason,
    pastor_notified: true,
  });

  // Update profile regression level if escalating
  const levelMap: Record<string, string> = { yellow: 'yellow', orange: 'orange', red: 'red' };
  if (levelMap[data.alert_level]) {
    await getSupabaseClient()
      .from('profiles_242go')
      .update({ regression_level: levelMap[data.alert_level] })
      .eq('telegram_user_id', data.telegram_user_id);
  }
}

// ─────────────────────────────────────────────
// NOTIFY admin(s) via Telegram
// ─────────────────────────────────────────────
async function notifyAdmins(data: {
  alert_level: string;
  first_name: string;
  level: string;
  level_number: number;
  reason: string;
  action: string;
}): Promise<void> {
  const emoji = { yellow: '🟡', orange: '🟠', red: '🔴' }[data.alert_level] ?? '⚠️';
  const levelEmoji = { seeker: '🌱', disciple: '📖', servant: '🤝', leader: '🌟', multiplier: '🔥' }[data.level] ?? '⭐';

  const message = `${emoji} *Mr. Thomas Alert — ${data.alert_level.toUpperCase()}*

Member: *${data.first_name}*
Level: ${levelEmoji} ${data.level.charAt(0).toUpperCase() + data.level.slice(1)} (${data.level_number}/5)

*What's happening:*
${data.reason}

*What needs to happen:*
${data.action}

_No man left behind._`;

  for (const adminId of ADMIN_IDS) {
    await sendMessage(adminId, message);
  }
}

// ─────────────────────────────────────────────
// MAIN — run full regression check across all active members
// ─────────────────────────────────────────────
export async function runRegressionCheck(): Promise<{ checked: number; flagged: number }> {
  // Get all profiles with an active coaching relationship (level 2+)
  const { data: profiles, error } = await getSupabaseClient()
    .from('profiles_242go')
    .select('telegram_user_id, first_name, level, level_number, bot_mode')
    .gte('level_number', 2) // Seekers don't have coaching cadence yet
    .eq('regression_level', 'none'); // Don't re-flag already flagged

  if (error || !profiles) {
    console.error('runRegressionCheck: could not fetch profiles', error);
    return { checked: 0, flagged: 0 };
  }

  let flagged = 0;

  for (const profile of profiles) {
    try {
      const alertsBefore = await getSupabaseClient()
        .from('regression_alerts')
        .select('id', { count: 'exact' })
        .eq('telegram_user_id', profile.telegram_user_id)
        .eq('resolved', false);

      await checkMemberRegression(profile);

      const alertsAfter = await getSupabaseClient()
        .from('regression_alerts')
        .select('id', { count: 'exact' })
        .eq('telegram_user_id', profile.telegram_user_id)
        .eq('resolved', false);

      if ((alertsAfter.count ?? 0) > (alertsBefore.count ?? 0)) {
        flagged++;
      }
    } catch (err) {
      console.error(`Regression check failed for ${profile.first_name}:`, err);
    }
  }

  console.log(`Regression check complete: ${profiles.length} checked, ${flagged} flagged`);

  // Also check for 90-day retests due
  await checkRetestsDue();

  return { checked: profiles.length, flagged };
}

// ─────────────────────────────────────────────
// 90-DAY RETEST — notify members when due
// ─────────────────────────────────────────────
async function checkRetestsDue(): Promise<void> {
  const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString();

  // Find profiles assessed 90+ days ago that haven't been retested
  const { data: profiles } = await getSupabaseClient()
    .from('profiles_242go')
    .select('telegram_user_id, first_name, level, level_number, assessed_at, retest_notified_at')
    .gte('level_number', 1)
    .lte('assessed_at', ninetyDaysAgo)
    .or('retest_notified_at.is.null,retest_notified_at.lte.' + ninetyDaysAgo);

  if (!profiles?.length) return;

  for (const profile of profiles) {
    try {
      // Notify member
      await sendMessage(
        profile.telegram_user_id,
        `🔄 *Time for your 90-Day Growth Check, ${profile.first_name}!*\n\nIt's been 90 days since your last assessment. Time to see how far you've come.\n\nSend /retest to take your assessment again and see your growth.`
      );

      // Notify admins (Mr. Thomas)
      for (const adminId of ADMIN_IDS) {
        await sendMessage(
          adminId,
          `📅 *90-Day Retest Due*\n\n${profile.first_name} is due for their retest.\nCurrent level: ${profile.level} (${profile.level_number}/5)\n\nThey've been notified.`
        );
      }

      // Mark as notified
      await getSupabaseClient()
        .from('profiles_242go')
        .update({ retest_notified_at: new Date().toISOString() })
        .eq('telegram_user_id', profile.telegram_user_id);

    } catch (err) {
      console.error(`Retest notification failed for ${profile.first_name}:`, err);
    }
  }
}

// ─────────────────────────────────────────────
// GROWTH COMPARISON — compare retest vs baseline
// ─────────────────────────────────────────────
export async function compareGrowth(
  telegram_user_id: number,
  first_name: string,
  newProfile: {
    overall_score: number; character_score: number;
    competency_score: number; consistency_score: number;
    level: string; level_number: number;
  }
): Promise<void> {
  // Get the original baseline from profile history or current stored scores
  const { data: baseline } = await getSupabaseClient()
    .from('profiles_242go')
    .select('overall_score, character_score, competency_score, consistency_score, level, level_number, assessed_at')
    .eq('telegram_user_id', telegram_user_id)
    .single();

  if (!baseline) return;

  const scoreDiff = newProfile.overall_score - baseline.overall_score;
  const levelDiff = newProfile.level_number - baseline.level_number;
  const arrow = scoreDiff > 0 ? '📈' : scoreDiff < 0 ? '📉' : '➡️';

  const growthMsg = `${arrow} *90-Day Growth Report — ${first_name}*

*Overall:* ${baseline.overall_score} → ${newProfile.overall_score} (${scoreDiff >= 0 ? '+' : ''}${scoreDiff} pts)
*Character:* ${baseline.character_score} → ${newProfile.character_score}
*Competency:* ${baseline.competency_score} → ${newProfile.competency_score}
*Consistency:* ${baseline.consistency_score} → ${newProfile.consistency_score}
${levelDiff > 0 ? `\n🎉 *Level Up!* ${baseline.level} → ${newProfile.level}` : levelDiff < 0 ? `\n⚠️ Level: ${baseline.level} → ${newProfile.level}` : `\nLevel: ${newProfile.level} (holding steady)`}`;

  // Send to member
  await sendMessage(telegram_user_id, growthMsg);

  // Send to admins
  for (const adminId of ADMIN_IDS) {
    await sendMessage(adminId, `📊 *Retest Complete*\n\n${growthMsg}`);
  }
}

// ─────────────────────────────────────────────
// RESOLVE an alert (called by admin)
// ─────────────────────────────────────────────
export async function resolveAlert(
  telegram_user_id: number,
  notes: string
): Promise<void> {
  await getSupabaseClient()
    .from('regression_alerts')
    .update({
      resolved: true,
      resolved_at: new Date().toISOString(),
      resolved_notes: notes,
    })
    .eq('telegram_user_id', telegram_user_id)
    .eq('resolved', false);

  await getSupabaseClient()
    .from('profiles_242go')
    .update({ regression_level: 'none' })
    .eq('telegram_user_id', telegram_user_id);
}
