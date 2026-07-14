import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import Anthropic from '@anthropic-ai/sdk';
import { scoreS1, scoreAnimals, scoreLoveLanguages, scoreGifts, scoreLeadership, scoreEQ, assignLevel } from '@/lib/scoring';
import type { S1Answers, S2Answers, S3Answers, S4Answers, S5Answers, S6Answers } from '@/lib/scoring';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const anthropic = new Anthropic();
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const GROUP_CHAT_ID = process.env.TELEGRAM_GROUP_CHAT_ID;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://telegram-mini-app-beta-coral.vercel.app';

async function syncToSheets(data: {
  name: string; email: string | null; phone: string | null;
  level: number; levelName: string; lps: number;
  character: number; competency: number; comprehension: number; alignment: number; stewardship: number;
  animalPrimary: string; llPrimary: string;
  giftPrimary: string; giftSecondary: string; giftTertiary: string;
  leadershipStyle: string; eqOverall: number; botMode: string;
}) {
  try {
    const sheetId = process.env.GOOGLE_SHEET_ID;
    const saCreds = process.env.GOOGLE_SERVICE_ACCOUNT;
    if (!sheetId || !saCreds) return;

    const sa = JSON.parse(saCreds);
    const { google } = await import('googleapis');
    const auth = new google.auth.GoogleAuth({
      credentials: sa,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    const sheets = google.sheets({ version: 'v4', auth });

    // Add header if sheet is empty
    const existing = await sheets.spreadsheets.values.get({ spreadsheetId: sheetId, range: 'Sheet1!A1' });
    if (!existing.data.values?.length) {
      await sheets.spreadsheets.values.append({
        spreadsheetId: sheetId, range: 'Sheet1!A1',
        valueInputOption: 'USER_ENTERED',
        requestBody: { values: [['Date','Name','Email','Phone','Level','Level Name','LPS Score','Character','Competency','Comprehension','Alignment','Stewardship','Temperament','Love Language','Gift 1','Gift 2','Gift 3','Leadership Style','EQ Score','Bot Mode']] },
      });
    }

    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId, range: 'Sheet1!A1',
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [[
        new Date().toLocaleString(),
        data.name, data.email ?? '', data.phone ?? '',
        data.level, data.levelName, data.lps,
        data.character, data.competency, data.comprehension, data.alignment, data.stewardship,
        data.animalPrimary, data.llPrimary,
        data.giftPrimary, data.giftSecondary, data.giftTertiary,
        data.leadershipStyle, data.eqOverall, data.botMode,
      ]] },
    });
  } catch (err) {
    console.error('Sheets sync error:', err);
  }
}

async function notifyGroup(name: string, memberId: string, level: number, levelName: string, lps: number) {
  if (!BOT_TOKEN || !GROUP_CHAT_ID) return;
  const emoji = ['','🌱','🔨','🌿','🎯','🔥'][level] ?? '⭐';
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: GROUP_CHAT_ID,
      text: `${emoji} *New Assessment Complete*\n\n*${name}* just completed the ETS Academy Spiritual DNA Assessment.\n\n📊 Score: *${lps}/100*\nLevel: *${level} — ${levelName}*\n\n[View Profile](${APP_URL}/assessment/results/${memberId})`,
      parse_mode: 'Markdown',
    }),
  });
}

async function generateProfile(data: {
  name: string; level: number; levelName: string; lps: number;
  character: number; competency: number; comprehension: number; alignment: number; stewardship: number;
  animalPrimary: string; animalSecondary: string;
  llPrimary: string;
  giftPrimary: string; giftSecondary: string; giftTertiary: string;
  leadershipStyle: string;
  eqOverall: number; eqConstructs: Record<string, number>;
}): Promise<string> {
  const res = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 600,
    messages: [{
      role: 'user',
      content: `You are a pastoral leadership coach. Write a personalized Spiritual DNA Profile for ${data.name}.

Assessment Results:
- Pipeline Level: ${data.level} — ${data.levelName} (Score: ${data.lps}/100)
- Character (FAT): ${data.character}/100
- Competency: ${data.competency}/100
- Comprehension: ${data.comprehension}/100
- Cultural Alignment: ${data.alignment}/100
- Stewardship (3 T's): ${data.stewardship}/100
- Temperament: ${data.animalPrimary} / ${data.animalSecondary}
- Love Language: ${data.llPrimary}
- Top Spiritual Gifts: ${data.giftPrimary}, ${data.giftSecondary}, ${data.giftTertiary}
- Leadership Style: ${data.leadershipStyle}
- Emotional Intelligence: ${data.eqOverall}/100

Write 3 short paragraphs (second person, pastoral, direct — COGIC/Pentecostal voice):
1. Who they are — their wiring, gifts, and how God made them
2. Where they are right now — honest assessment of their scores
3. What God is building in them — their growth edge and calling direction

No filler. No generic encouragement. Make it feel written specifically for this person.`,
    }],
  });
  return (res.content[0] as { text: string }).text;
}

export async function POST(req: NextRequest) {
  const { intake, s1Answers, s2Answers, s3Answers, s4Answers, s5Answers, s6Answers, telegram_user_id } = await req.json() as {
    intake: { name: string; email: string; phone: string; telegram: string; city?: string; state?: string; role?: string; church_name?: string };
    s1Answers: S1Answers; s2Answers: S2Answers; s3Answers: S3Answers;
    s4Answers?: S4Answers; s5Answers?: S5Answers; s6Answers?: S6Answers;
    telegram_user_id?: number;
  };

  try {
    const { S1_ITEMS, S4_QUESTIONS, S5_QUESTIONS, S6_ITEMS } = await import('@/lib/questions');

    const s1Result   = scoreS1(s1Answers, S1_ITEMS);
    const animals    = scoreAnimals(s2Answers);
    const ll         = scoreLoveLanguages(s3Answers);
    const gifts      = s4Answers ? scoreGifts(s4Answers, S4_QUESTIONS) : null;
    const leadership = s5Answers ? scoreLeadership(s5Answers, S5_QUESTIONS) : null;
    const eq         = s6Answers ? scoreEQ(s6Answers, S6_ITEMS) : null;
    const level      = assignLevel(s1Result.lps);

    const profile = await generateProfile({
      name: intake.name.trim(),
      level: level.level, levelName: level.name, lps: s1Result.lps,
      character: s1Result.character, competency: s1Result.competency,
      comprehension: s1Result.comprehension, alignment: s1Result.alignment,
      stewardship: s1Result.stewardship,
      animalPrimary: animals.primary, animalSecondary: animals.secondary,
      llPrimary: ll.primary,
      giftPrimary: gifts?.primary ?? '', giftSecondary: gifts?.secondary ?? '', giftTertiary: gifts?.tertiary ?? '',
      leadershipStyle: leadership?.primary ?? '',
      eqOverall: eq?.overall ?? 0, eqConstructs: eq?.constructs ?? {},
    });

    const payload = {
      name: intake.name.trim(),
      email: intake.email.trim() || null,
      phone: intake.phone.trim() || null,
      telegram_user_id: telegram_user_id ?? null,
      city: intake.city?.trim() || null,
      state: intake.state?.trim() || null,
      role: intake.role || null,
      church_name: intake.church_name?.trim() || null,

      lps_score: s1Result.lps,
      pipeline_level: level.level,
      pipeline_level_name: level.name,
      omega_section_assigned: level.omega,
      assessment_completed_at: new Date().toISOString(),
      ai_followup_cadence: 'Active',

      // S1 construct scores
      score_bible_depth:    s1Result.constructs.bible_depth    ?? 0,
      score_fasting_prayer: s1Result.constructs.time_god       ?? 0,
      score_consistency:    s1Result.constructs.faithful       ?? 0,
      score_discipleship:   s1Result.constructs.discipleship   ?? 0,
      score_outreach:       s1Result.constructs.outreach       ?? 0,
      score_stewardship:    s1Result.constructs.treasure       ?? 0,
      score_partnership:    s1Result.constructs.available      ?? 0,
      score_coaching:       s1Result.constructs.talent         ?? 0,

      // Animals
      animal_primary: animals.primary, animal_secondary: animals.secondary,
      animal_lion_score: animals.scores.lion, animal_otter_score: animals.scores.otter,
      animal_gr_score: animals.scores.gr, animal_beaver_score: animals.scores.beaver,

      // Love language
      ll_primary: ll.primary, ll_secondary: ll.secondary,

      // Gifts
      ...(gifts ? { spiritual_gift_primary: gifts.primary, spiritual_gift_secondary: gifts.secondary, spiritual_gift_tertiary: gifts.tertiary } : {}),

      // Leadership style
      ...(leadership ? { leadership_style_primary: leadership.primary, leadership_style_secondary: leadership.secondary } : {}),

      // EQ
      ...(eq ? { eq_overall: eq.overall, eq_self_awareness: eq.constructs.self_awareness ?? 0, eq_self_regulation: eq.constructs.self_regulation ?? 0, eq_empathy: eq.constructs.empathy ?? 0, eq_social_awareness: eq.constructs.social_awareness ?? 0, eq_rel_management: eq.constructs.rel_management ?? 0 } : {}),

      leadership_profile: profile,
      omega_focus_modules: JSON.stringify([]),
    };

    let leaderId: string;
    let memberSlug: string;

    if (payload.email) {
      const { data: existing } = await supabase.from('leaders').select('id, member_id').eq('email', payload.email).single();
      if (existing) {
        await supabase.from('leaders').update(payload).eq('id', existing.id);
        leaderId = existing.id as string;
        memberSlug = (existing.member_id as string) ?? leaderId;
      } else {
        const { data, error } = await supabase.from('leaders').insert(payload).select('id, member_id').single();
        if (error) throw error;
        leaderId = (data as { id: string; member_id: string }).id;
        memberSlug = (data as { id: string; member_id: string }).member_id ?? leaderId;
      }
    } else {
      const { data, error } = await supabase.from('leaders').insert(payload).select('id, member_id').single();
      if (error) throw error;
      leaderId = (data as { id: string; member_id: string }).id;
      memberSlug = (data as { id: string; member_id: string }).member_id ?? leaderId;
    }

    // Sync to profiles_242go for mini app dashboard
    if (telegram_user_id) {
      await supabase.from('profiles_242go').upsert({
        telegram_user_id,
        first_name: intake.name.trim().split(' ')[0],
        username: intake.telegram?.replace('@', '') || null,
        overall_score: s1Result.lps,
        level: level.name,
        level_number: level.level,
        character_score: s1Result.character,
        competency_score: s1Result.competency,
        consistency_score: s1Result.constructs.faithful ?? 0,
        dominant_animal: animals.primary,
        secondary_animal: animals.secondary,
        bot_mode: level.level <= 1 ? 'care' : level.level <= 2 ? 'companion' : 'coach',
        profile_card: profile,
        ...(gifts ? { spiritual_gift_primary: gifts.primary, spiritual_gift_secondary: gifts.secondary, spiritual_gift_tertiary: gifts.tertiary } : {}),
        ...(leadership ? { leadership_style_primary: leadership.primary } : {}),
        ...(eq ? { eq_overall: eq.overall } : {}),
      }, { onConflict: 'telegram_user_id' });
    }

    notifyGroup(intake.name.trim(), memberSlug, level.level, level.name, s1Result.lps).catch(console.error);

    // Trigger n8n Mac Mini Watchdog & Visual Scorecard Generator
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL || 'https://bridge.macminhub.com/webhook/spiritual-dna-assessment';
    fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: intake.name.trim(),
        leader_id: memberSlug,
        telegram_user_id: telegram_user_id || null,
        level_name: `Level ${level.level} — ${level.name}`,
        lps_score: s1Result.lps,
        character_score: s1Result.character,
        competency_score: s1Result.competency,
        comprehension_score: s1Result.comprehension,
        eq_score: eq?.overall ?? 0,
        animal_primary: animals.primary,
        gift_primary: gifts?.primary ?? '',
        gift_secondary: gifts?.secondary ?? '',
        calling_direction: `Assigned to Level ${level.level} (${level.name}).`,
      }),
    }).catch(err => console.error('n8n trigger error:', err));

    syncToSheets({
      name: intake.name.trim(), email: intake.email.trim() || null, phone: intake.phone.trim() || null,
      level: level.level, levelName: level.name, lps: s1Result.lps,
      character: s1Result.character, competency: s1Result.competency,
      comprehension: s1Result.comprehension, alignment: s1Result.alignment, stewardship: s1Result.stewardship,
      animalPrimary: animals.primary, llPrimary: ll.primary,
      giftPrimary: gifts?.primary ?? '', giftSecondary: gifts?.secondary ?? '', giftTertiary: gifts?.tertiary ?? '',
      leadershipStyle: leadership?.primary ?? '', eqOverall: eq?.overall ?? 0,
      botMode: level.level <= 1 ? 'care' : level.level <= 2 ? 'companion' : 'coach',
    }).catch(console.error);

    return NextResponse.json({ leaderId: memberSlug });
  } catch (err) {
    console.error('Submit error:', err);
    return NextResponse.json({ error: 'Failed to save assessment' }, { status: 500 });
  }
}
