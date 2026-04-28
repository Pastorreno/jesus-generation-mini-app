// 242Go AHDP — Weekly Coaching Engine
// Generates personalized Mon/Wed/Fri messages for each member
// Monday: Mission focus | Wednesday: Check-in | Friday: Debrief + reflection

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

const ADMIN_IDS: number[] = process.env.ADMIN_TELEGRAM_IDS
  ? process.env.ADMIN_TELEGRAM_IDS.split(',').map(Number)
  : [];

type DayType = 'monday_mission' | 'wednesday_checkin' | 'friday_debrief' | 'care_checkin';

// ─────────────────────────────────────────────
// GET member context for Claude
// ─────────────────────────────────────────────
async function getMemberContext(telegram_user_id: number) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: profile } = await getSupabaseClient()
    .from('profiles_242go')
    .select('*')
    .eq('telegram_user_id', telegram_user_id)
    .single();

  if (!profile) return null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const p = profile as any;

  // Get last 5 coaching responses to personalize
  const { data: recentLogs } = await getSupabaseClient()
    .from('coaching_log')
    .select('day_type, message_text, response_text, sent_at, consistency_signal, character_signal, competency_signal')
    .eq('telegram_user_id', telegram_user_id)
    .not('response_text', 'is', null)
    .order('sent_at', { ascending: false })
    .limit(5);

  // Get current week number (weeks since assessment)
  const assessedAt = new Date(p.assessed_at);
  const weekNumber = Math.floor((Date.now() - assessedAt.getTime()) / (7 * 24 * 60 * 60 * 1000)) + 1;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return { profile: p, recentLogs: (recentLogs ?? []) as any[], weekNumber };
}

// ─────────────────────────────────────────────
// GENERATE personalized message via Claude
// ─────────────────────────────────────────────
async function generateCoachingMessage(
  dayType: DayType,
  context: NonNullable<Awaited<ReturnType<typeof getMemberContext>>>
): Promise<string> {
  const { profile, recentLogs, weekNumber } = context;

  const recentResponseSummary = recentLogs.length > 0
    ? recentLogs.map(l =>
        `${l.day_type} (${new Date(l.sent_at).toLocaleDateString()}): "${l.response_text?.substring(0, 120)}"`
      ).join('\n')
    : 'No previous responses yet.';

  const animalEmoji: Record<string, string> = {
    lion: '🦁', otter: '🦦', retriever: '🐕', beaver: '🦫'
  };

  const dayInstructions: Record<DayType, string> = {
    monday_mission: `It's Monday. Give ${profile.first_name} a focused kingdom assignment or challenge for the week. Something specific, actionable, and tied to their growth areas. Make them want to move.`,
    wednesday_checkin: `It's Wednesday. Check in on how their week is going. Reference their Monday mission if possible. Ask one meaningful question that requires a real answer. Not "how are you" — something that reveals where they actually are spiritually.`,
    friday_debrief: `It's Friday. Help them debrief the week. What did God do? Where did they fall short? What's one thing they're carrying into the weekend? Invite reflection. End with something that sends them into the weekend with kingdom focus.`,
    care_checkin: `This member is a Seeker (Level 1) who needs pastoral care more than coaching. Send a warm, personal check-in. No assignments. Just genuine interest in how they are doing and a reminder that they are not alone.`,
  };

  const prompt = `You are ${profile.first_name}'s personal ETS Academy coach. You know them well.

ABSOLUTE GUARDRAILS — never violate these under any circumstances:
1. SCOPE: Only discuss faith, discipleship, the ETS pipeline, personal spiritual growth, and kingdom assignments. If asked about anything outside this (politics, finances, relationships, theology debates, news), respond: "That's outside what I'm here for — let's stay focused on your growth."
2. NO HARM: Never shame, condemn, diagnose, or make anyone feel worthless. If they score low or struggle, the tone is always "we walk with you."
3. NO PROFESSIONAL ADVICE: Never give medical, mental health, legal, or financial advice. If someone raises these topics, say: "That's something to bring to a professional or your pastor directly — I'm your kingdom growth coach."
4. NO PLACEMENT DECISIONS: Never tell someone they are promoted, demoted, or placed in a ministry role. Always say: "A senior leader will review and confirm your placement."
5. CRISIS PROTOCOL: If anyone expresses suicidal thoughts, abuse, or immediate danger — STOP all coaching. Respond only with: "I hear you. Please reach out to your pastor immediately or call 988 (Suicide & Crisis Lifeline). You are not alone." Then flag the admin.
6. NO IMPERSONATION: Never claim to be human, a pastor, or a specific person. You are the ETS Academy coaching system.
7. BREVITY: Max 5 sentences per message. This is Telegram, not a sermon.
8. THEOLOGY: Stay grounded in orthodox Christian faith. Do not affirm false doctrine, syncretism, or prosperity gospel framing.

MEMBER PROFILE:
- Name: ${profile.first_name}
- Level: ${profile.level} (${profile.level_number}/5), Week ${weekNumber} in pipeline
- Bot mode: ${profile.bot_mode}
- Personality: ${profile.dominant_animal} dominant, ${profile.secondary_animal} secondary
- Strengths: ${profile.strengths}
- Growth areas: ${profile.growth_areas}
- Calling direction: ${profile.calling_direction}
- Character flagged: ${profile.character_flagged}
- Consistency flagged: ${profile.consistency_flagged}
- Regression level: ${profile.regression_level}

RECENT CONVERSATION HISTORY:
${recentResponseSummary}

YOUR TASK:
${dayInstructions[dayType]}

VOICE & TONE RULES:
- Sound like a real friend who knows their Bible and knows them personally — not a chatbot, not a preacher
- Conversational, warm, direct — like a text from someone who genuinely cares
- Kingdom urgency + pastoral warmth in every message
- Reference something specific from their profile or recent responses when possible
- Never be generic — they should feel seen and known
- Max 4-6 sentences. Less is more. This is Telegram, not a sermon.
- Do NOT use emojis excessively — 1-2 max
- End with ONE question or ONE clear call to action — not both

SCRIPTURE RULE — think like Blue Letter Bible (critical):
- Weave in ONE scripture reference per message — naturally, conversationally, never preachy
- Go deeper than the English surface. Think about:
  * The original Hebrew or Greek word and what it actually means (e.g. "the word 'hypomone' translated 'patience' actually means staying under pressure — active endurance, not passive waiting")
  * Who wrote it, where they were, what they were going through — context makes scripture come alive
  * How the verse connects to the larger biblical narrative (OT → NT threads, prophecy → fulfillment, etc.)
  * What the original audience would have heard that modern readers miss
- The scripture must be directly relevant to THIS person's situation RIGHT NOW
- Don't quote and move on — make the word land. One sentence of depth changes everything.
- Example of SHALLOW: "Philippians 4:13 — you can do all things through Christ."
- Example of BLUE LETTER BIBLE DEPTH: "That word 'strengthen' in Philippians 4:13 — it's 'endunamoo' in Greek. It means to be continuously infused with power from the inside. Paul wasn't just quoting a motivational verse. He was writing from a Roman prison cell saying the same God who kept him there is keeping you right now."
- Draw from the whole Bible — Law, Prophets, Psalms, Gospels, Epistles, Revelation. Don't camp in the same 10 verses.
- Never be a know-it-all about it. Deliver the depth like a friend sharing something that changed them, not like a seminary lecture.

Return ONLY the message text. No JSON. No labels. Just the message.`;

  const response = await getAnthropicClient().messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 300,
    messages: [{ role: 'user', content: prompt }],
  });

  return response.content[0].type === 'text' ? response.content[0].text.trim() : '';
}

// ─────────────────────────────────────────────
// SEND coaching message to one member
// ─────────────────────────────────────────────
async function sendCoachingMessage(
  telegram_user_id: number,
  dayType: DayType,
  weekNumber: number,
  message: string
): Promise<void> {
  await sendMessage(telegram_user_id, message);

  // Log it
  await getSupabaseClient().from('coaching_log').insert({
    telegram_user_id,
    week_number: weekNumber,
    day_type: dayType,
    bot_mode: 'coach',
    message_text: message,
    sent_at: new Date().toISOString(),
  });
}

// ─────────────────────────────────────────────
// CRISIS DETECTION — scans response for danger signals
// ─────────────────────────────────────────────
const CRISIS_KEYWORDS = [
  'suicide', 'kill myself', 'end my life', 'want to die', 'can\'t go on',
  'hurt myself', 'self harm', 'abuse', 'being abused', 'not safe',
  'nobody cares', 'better off dead', 'no reason to live',
];

export async function checkForCrisis(
  telegram_user_id: number,
  first_name: string,
  text: string
): Promise<boolean> {
  const lower = text.toLowerCase();
  const triggered = CRISIS_KEYWORDS.some(kw => lower.includes(kw));
  if (!triggered) return false;

  // Notify all admins immediately
  for (const adminId of ADMIN_IDS) {
    await sendMessage(
      adminId,
      `🚨 *CRISIS ALERT — Immediate Action Required*\n\nMember: *${first_name}* (ID: ${telegram_user_id})\n\nTriggered by message content. Please reach out to this person directly right now.\n\n_Do not wait._`
    );
  }

  // Log as red regression alert
  await getSupabaseClient().from('regression_alerts').insert({
    telegram_user_id,
    alert_level: 'red',
    dimension: 'general',
    trigger_reason: 'Crisis keyword detected in coaching response',
    pastor_notified: true,
  });

  return true;
}

// ─────────────────────────────────────────────
// RECORD member response to a coaching message
// ─────────────────────────────────────────────
export async function recordCoachingResponse(
  telegram_user_id: number,
  response_text: string
): Promise<void> {
  // Find the most recent unanswered coaching message
  const { data: pending } = await getSupabaseClient()
    .from('coaching_log')
    .select('id, message_text, week_number')
    .eq('telegram_user_id', telegram_user_id)
    .is('responded_at', null)
    .not('message_text', 'is', null)
    .order('sent_at', { ascending: false })
    .limit(1)
    .single();

  if (!pending) return;

  // Use Claude to extract behavioral signals from the response
  const signals = await extractSignals(response_text);

  await getSupabaseClient()
    .from('coaching_log')
    .update({
      response_text,
      responded_at: new Date().toISOString(),
      consistency_signal: signals.consistency,
      character_signal: signals.character,
      competency_signal: signals.competency,
    })
    .eq('id', pending.id);
}

// ─────────────────────────────────────────────
// EXTRACT behavioral signals from response text
// ─────────────────────────────────────────────
async function extractSignals(
  response_text: string
): Promise<{ consistency: number; character: number; competency: number }> {
  try {
    const response = await getAnthropicClient().messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 100,
      messages: [{
        role: 'user',
        content: `Analyze this church member's coaching bot response for behavioral signals.

Response: "${response_text}"

Rate each dimension -1 (concerning), 0 (neutral), or 1 (positive):
- consistency: Are they showing up, following through, stable?
- character: Honesty, humility, integrity indicators?
- competency: Growth, learning, applying teaching?

Return ONLY: {"consistency": N, "character": N, "competency": N}`,
      }],
    });

    const text = response.content[0].type === 'text' ? response.content[0].text : '{}';
    const json = JSON.parse(text.match(/\{[\s\S]*\}/)?.[0] ?? '{}');
    return {
      consistency: json.consistency ?? 0,
      character: json.character ?? 0,
      competency: json.competency ?? 0,
    };
  } catch {
    return { consistency: 0, character: 0, competency: 0 };
  }
}

// ─────────────────────────────────────────────
// MAIN — run weekly coaching blast
// Called by cron: Mon=monday_mission, Wed=wednesday_checkin, Fri=friday_debrief
// ─────────────────────────────────────────────
export async function runWeeklyCoaching(dayType: DayType): Promise<{ sent: number; failed: number }> {
  // Get all active members
  const { data: profiles } = await getSupabaseClient()
    .from('profiles_242go')
    .select('telegram_user_id, level_number, bot_mode')
    .gte('level_number', 1);

  if (!profiles) return { sent: 0, failed: 0 };

  let sent = 0;
  let failed = 0;

  for (const p of profiles) {
    try {
      // Level 1 (Seeker) gets care_checkin on Wednesday only, not Mon/Fri
      let actualDayType: DayType = dayType;
      if (p.level_number === 1) {
        if (dayType !== 'wednesday_checkin') continue;
        actualDayType = 'care_checkin';
      }

      const context = await getMemberContext(p.telegram_user_id);
      if (!context) continue;

      const message = await generateCoachingMessage(actualDayType, context);
      if (!message) continue;

      await sendCoachingMessage(p.telegram_user_id, actualDayType, context.weekNumber, message);
      sent++;

      // Rate limit — Telegram allows ~30 messages/sec
      await new Promise(r => setTimeout(r, 100));
    } catch (err) {
      console.error(`Coaching failed for user ${p.telegram_user_id}:`, err);
      failed++;
    }
  }

  return { sent, failed };
}
