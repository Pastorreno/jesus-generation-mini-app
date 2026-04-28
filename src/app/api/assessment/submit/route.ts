import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import Anthropic from '@anthropic-ai/sdk';
import { scoreKRS, scoreAnimals, scoreLoveLanguages, assignLevel } from '@/lib/scoring';
import type { S1Answers, S2Answers, S3Answers } from '@/lib/scoring';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
const anthropic = new Anthropic();

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const GROUP_CHAT_ID = process.env.TELEGRAM_GROUP_CHAT_ID;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://telegram-mini-app-beta-coral.vercel.app';

async function notifyGroup(name: string, memberId: string, level: number, levelName: string, lps: number) {
  if (!BOT_TOKEN || !GROUP_CHAT_ID) return;
  const resultsUrl = `${APP_URL}/assessment/results/${memberId}`;
  const levelEmoji = ['', '🌱', '🔨', '🌿', '🎯', '🔥'][level] ?? '⭐';
  const text = `${levelEmoji} *New Assessment Complete*\n\n*${name}* just completed the Kingdom Readiness Assessment.\n\n📊 KRS Score: *${lps}/100*\nPipeline Level: *${level} — ${levelName}*\n\n[View Full Profile](${resultsUrl})`;
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: GROUP_CHAT_ID, text, parse_mode: 'Markdown', disable_web_page_preview: true }),
  });
}

const OMEGA_MODULES: Record<number, { section: string; modules: { name: string; focus: string[] }[] }> = {
  1: {
    section: 'Foundations of Faith',
    modules: [
      { name: 'Salvation & Identity',         focus: ['comprehension', 'faithful']  },
      { name: 'The Word of God',               focus: ['comprehension']               },
      { name: 'Prayer & Daily Disciplines',    focus: ['faithful', 'time_god']        },
      { name: 'The Holy Spirit',               focus: ['comprehension', 'available']  },
      { name: 'Community & Covenant',          focus: ['available', 'teachable']      },
    ],
  },
  2: {
    section: 'Disciplines of the Disciple',
    modules: [
      { name: 'Fasting & Consecration',        focus: ['faithful', 'time_god']        },
      { name: 'Scripture Depth & Meditation',  focus: ['comprehension']               },
      { name: 'Stewardship of Resources',      focus: ['treasure']                    },
      { name: 'Evangelism Foundations',        focus: ['competency', 'outreach']      },
      { name: 'Accountability & Mentorship',   focus: ['teachable', 'available']      },
    ],
  },
  3: {
    section: 'The Culture of the House',
    modules: [
      { name: 'Ecclesiology & Church Vision',  focus: ['comprehension', 'available']  },
      { name: 'Serving & Spiritual Gifts',     focus: ['available', 'talent']         },
      { name: 'Covenant Community',            focus: ['faithful', 'available']       },
      { name: 'Leading in the Local Church',   focus: ['competency', 'teachable']     },
      { name: 'Outreach & Cultural Engagement',focus: ['competency', 'outreach']      },
    ],
  },
  4: {
    section: 'The Making of a Leader',
    modules: [
      { name: 'Spiritual Authority & Identity',focus: ['character', 'comprehension']  },
      { name: 'Discipleship Methodology',      focus: ['competency', 'teachable']     },
      { name: 'Coaching & Releasing Leaders',  focus: ['competency', 'coaching']      },
      { name: 'Vision & Communication',        focus: ['competency', 'available']     },
      { name: 'Pastoral Care & Shepherding',   focus: ['character', 'faithful']       },
    ],
  },
  5: {
    section: 'Systems & Multiplication',
    modules: [
      { name: 'Building Leadership Pipelines', focus: ['competency', 'coaching']      },
      { name: 'Organizational Systems',        focus: ['competency', 'treasure']      },
      { name: 'Raising Trainers',              focus: ['teachable', 'competency']     },
      { name: 'Vision Casting at Scale',       focus: ['character', 'comprehension']  },
      { name: 'Legacy & Kingdom Impact',       focus: ['all']                         },
    ],
  },
};

async function generateLeadershipProfile(data: {
  name: string;
  levelName: string;
  level: number;
  lps: number;
  character: number;
  competency: number;
  comprehension: number;
  faithful: number;
  available: number;
  teachable: number;
  treasure: number;
  animalPrimary: string;
  animalSecondary: string;
  llPrimary: string;
  omegaSection: string;
  weakestArea: string;
  strongestArea: string;
}): Promise<{ profile: string; focusModules: string }> {
  const prompt = `You are a pastoral leadership coach at Jesus Generation Church. Write a personalized Kingdom Mandate Profile for ${data.name}.

Assessment Results:
- Pipeline Level: ${data.level} — ${data.levelName} (Score: ${data.lps}/100)
- Character (FAT): ${data.character}/100
  • Faithful: ${data.faithful}/100
  • Available: ${data.available}/100
  • Teachable: ${data.teachable}/100
- Competency: ${data.competency}/100
- Comprehension: ${data.comprehension}/100
- Treasure (Stewardship): ${data.treasure}/100
- Animal Instinct: ${data.animalPrimary} / ${data.animalSecondary}
- Love Language: ${data.llPrimary}
- Assigned to: Omega ${data.omegaSection}
- Strongest area: ${data.strongestArea}
- Growth area: ${data.weakestArea}

Write TWO sections separated by [MODULES]:

SECTION 1 — PROFILE (3 short paragraphs):
Paragraph 1: Who they are as a leader. Their natural instincts (based on their animal), how they are wired to serve, what makes them uniquely valuable to the body of Christ.
Paragraph 2: Their FAT breakdown — what their Faithful, Available, and Teachable scores reveal about where they are right now. Be specific and honest, not generic.
Paragraph 3: Their growth edge. What God is developing in them. Connect their weakest area to what the next season requires of them. End with a direct word of encouragement.

[MODULES]

SECTION 2 — OMEGA FOCUS (2-3 sentences):
Based on their weakest scoring area (${data.weakestArea}) and their assignment to ${data.omegaSection}, name the 1-2 specific modules they should prioritize FIRST and why. Be specific and actionable.

Rules: Second person ("You are..."). Pastoral but direct. No filler phrases. Make it feel written specifically for this person, not a template.`;

  const res = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 600,
    messages: [{ role: 'user', content: prompt }],
  });

  const full = (res.content[0] as { text: string }).text;
  const parts = full.split('[MODULES]');
  return {
    profile: parts[0]?.trim() ?? full,
    focusModules: parts[1]?.trim() ?? '',
  };
}

function getRecommendedModules(omegaLevel: number, weakestDomain: string): string[] {
  const section = OMEGA_MODULES[omegaLevel];
  if (!section) return [];
  const prioritized = section.modules
    .filter(m => m.focus.includes(weakestDomain) || m.focus.includes('all'))
    .map(m => m.name);
  const rest = section.modules
    .filter(m => !m.focus.includes(weakestDomain))
    .map(m => m.name);
  return [...prioritized, ...rest];
}

export async function POST(req: NextRequest) {
  const { intake, s1Answers, s2Answers, s3Answers, telegram_user_id } = await req.json() as {
    intake: { name: string; email: string; phone: string; telegram: string };
    s1Answers: S1Answers;
    s2Answers: S2Answers;
    s3Answers: S3Answers;
    telegram_user_id?: number;
  };

  try {
    const krs = scoreKRS(s1Answers);
    const animals = scoreAnimals(s2Answers);
    const ll = scoreLoveLanguages(s3Answers);
    const level = assignLevel(krs.lps);
    const fw = krs.framework;

    // Determine strongest and weakest C
    const cScores = [
      { key: 'character',     label: 'Character',     score: fw.character },
      { key: 'competency',    label: 'Competency',    score: fw.competency },
      { key: 'comprehension', label: 'Comprehension', score: fw.comprehension },
    ].sort((a, b) => a.score - b.score);
    const weakestC  = cScores[0].label;
    const strongestC = cScores[2].label;

    // Domain-level weakest for module recommendation
    const domainScores: Record<string, number> = {
      faithful:   fw.faithful,
      available:  fw.available,
      teachable:  fw.teachable,
      outreach:   krs.domains.outreach    ?? 0,
      coaching:   krs.domains.coaching    ?? 0,
      comprehension: fw.comprehension,
      treasure:   fw.treasure,
    };
    const weakestDomain = Object.entries(domainScores).sort((a, b) => a[1] - b[1])[0][0];
    const recommendedModules = getRecommendedModules(level.omega, weakestDomain);

    // Generate AI profile (fire this before DB write to have it ready)
    const { profile, focusModules } = await generateLeadershipProfile({
      name: intake.name.trim(),
      levelName: level.name,
      level: level.level,
      lps: krs.lps,
      character: fw.character,
      competency: fw.competency,
      comprehension: fw.comprehension,
      faithful: fw.faithful,
      available: fw.available,
      teachable: fw.teachable,
      treasure: fw.treasure,
      animalPrimary: animals.primary,
      animalSecondary: animals.secondary,
      llPrimary: ll.primary,
      omegaSection: OMEGA_MODULES[level.omega]?.section ?? '',
      weakestArea: weakestC,
      strongestArea: strongestC,
    });

    const payload = {
      name: intake.name.trim(),
      email: intake.email.trim() || null,
      phone: intake.phone.trim() || null,
      telegram_user_id: telegram_user_id ?? null,

      lps_score: krs.lps,
      pipeline_level: level.level,
      pipeline_level_name: level.name,
      omega_section_assigned: level.omega,
      omega_module_current: 1,
      growth_track_start_date: new Date().toISOString().split('T')[0],
      ai_followup_cadence: 'Active',
      assessment_completed_at: new Date().toISOString(),

      score_bible_depth:    krs.domains.bible_depth    ?? 0,
      score_fasting_prayer: krs.domains.time_god       ?? 0,
      score_consistency:    krs.domains.faithful       ?? 0,
      score_discipleship:   krs.domains.discipleship   ?? 0,
      score_outreach:       krs.domains.outreach       ?? 0,
      score_stewardship:    krs.domains.treasure       ?? 0,
      score_partnership:    krs.domains.available      ?? 0,
      score_coaching:       krs.domains.coaching       ?? 0,

      animal_lion_score:   animals.scores.lion,
      animal_otter_score:  animals.scores.otter,
      animal_gr_score:     animals.scores.gr,
      animal_beaver_score: animals.scores.beaver,
      animal_primary:      animals.primary,
      animal_secondary:    animals.secondary,

      ll_words_score: ll.scores.words,
      ll_acts_score:  ll.scores.acts,
      ll_gifts_score: ll.scores.gifts,
      ll_time_score:  ll.scores.time,
      ll_touch_score: ll.scores.touch,
      ll_primary:     ll.primary,
      ll_secondary:   ll.secondary,

      leadership_profile:   profile,
      omega_focus_modules:  JSON.stringify(recommendedModules),
      spiritual_growth_notes: focusModules,
    };

    let leaderId: string;
    let memberSlug: string;

    if (payload.email) {
      const { data: existing } = await supabase
        .from('leaders')
        .select('id, member_id')
        .eq('email', payload.email)
        .single();

      if (existing) {
        await supabase.from('leaders').update(payload).eq('id', existing.id);
        leaderId   = existing.id as string;
        memberSlug = (existing.member_id as string) ?? leaderId;
      } else {
        const { data, error } = await supabase.from('leaders').insert(payload).select('id, member_id').single();
        if (error) throw error;
        leaderId   = (data as { id: string; member_id: string }).id;
        memberSlug = (data as { id: string; member_id: string }).member_id ?? leaderId;
      }
    } else {
      const { data, error } = await supabase.from('leaders').insert(payload).select('id, member_id').single();
      if (error) throw error;
      leaderId   = (data as { id: string; member_id: string }).id;
      memberSlug = (data as { id: string; member_id: string }).member_id ?? leaderId;
    }

    // Sync to profiles_242go so the mini app dashboard can read it
    if (telegram_user_id) {
      await supabase.from('profiles_242go').upsert({
        telegram_user_id,
        first_name: intake.name.trim().split(' ')[0],
        username: intake.telegram?.replace('@', '') || null,
        overall_score: krs.lps,
        level: level.name,
        level_number: level.level,
        character_score: fw.character,
        competency_score: fw.competency,
        consistency_score: fw.faithful ?? 0,
        animal_primary: animals.primary,
        animal_secondary: animals.secondary,
        bot_mode: level.level <= 1 ? 'care' : level.level <= 2 ? 'companion' : 'coach',
        ai_narrative: profile,
      }, { onConflict: 'telegram_user_id' });
    }

    // Audit log
    const rows = [
      ...Object.entries(s1Answers).map(([q, answer]) => ({
        leader_id: leaderId, section: 1, question_number: Number(q), answer_selected: answer,
      })),
      ...Object.entries(s3Answers).map(([q, answer]) => ({
        leader_id: leaderId, section: 3, question_number: Number(q), answer_selected: answer,
      })),
    ];
    await supabase.from('assessment_responses').insert(rows);

    // Notify JGC leadership group when someone completes the assessment
    notifyGroup(intake.name.trim(), memberSlug, level.level, level.name, krs.lps).catch((err: unknown) =>
      console.error('Group notify error:', err)
    );

    return NextResponse.json({ leaderId: memberSlug });
  } catch (err) {
    console.error('Assessment submit error:', err);
    return NextResponse.json({ error: 'Failed to save assessment' }, { status: 500 });
  }
}
