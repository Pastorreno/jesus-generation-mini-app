// 242Go AHDP — Telegram Message Helpers
// All bot messaging functions in one place

import { QUESTIONS } from './assessment/questions';
import type { ScoredProfile } from './assessment/scoring';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://telegram-mini-app-beta-coral.vercel.app';

// ─────────────────────────────────────────────
// CORE send function
// ─────────────────────────────────────────────
export async function sendMessage(
  chat_id: number,
  text: string,
  extra?: Record<string, unknown>
): Promise<void> {
  if (!BOT_TOKEN) {
    console.error('TELEGRAM_BOT_TOKEN is not set');
    return;
  }
  // Allow callers to override or disable parse_mode.
  // Pass `{ parse_mode: null }` to send as plain text (safe for Claude-generated content).
  const { parse_mode, ...rest } = extra ?? {};
  const effectiveParseMode =
    parse_mode === null ? undefined : (parse_mode ?? 'Markdown');

  const payload: Record<string, unknown> = { chat_id, text, ...rest };
  if (effectiveParseMode) payload.parse_mode = effectiveParseMode;

  const doSend = async (body: Record<string, unknown>) => {
    const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return res.json();
  };

  let data = await doSend(payload);

  // Fallback: if markdown parse failed, retry as plain text so the user still gets the message.
  if (!data.ok && effectiveParseMode === 'Markdown') {
    console.error('sendMessage failed (markdown):', JSON.stringify(data));
    const plainPayload = { ...payload };
    delete plainPayload.parse_mode;
    data = await doSend(plainPayload);
  }

  if (!data.ok) {
    console.error('sendMessage failed:', JSON.stringify(data));
  }
}

// ─────────────────────────────────────────────
// WELCOME — first time a user sends /start
// ─────────────────────────────────────────────
export async function sendWelcome(chat_id: number, first_name: string): Promise<void> {
  await sendMessage(
    chat_id,
    `🌍 *Welcome to 242Go, ${first_name}.*\n\nThis is the Jesus Generation Leadership Pipeline.\n\nActs 2:42 describes the first church — devoted to teaching, fellowship, breaking bread, and prayer. That's not a program. That's a people. And that's what we're building.\n\nWhat you're about to take is a 30-question leadership assessment. Not a test you pass or fail — more like a mirror. It shows where you are today so we can walk with you toward who God is calling you to become.\n\n_"For we are God's handiwork, created in Christ Jesus to do good works, which God prepared in advance for us to do."_ — Ephesians 2:10\n\nYou were made for this, ${first_name}. Let's find out where you are.\n\n*No man left behind.*\n\nReady?`,
    {
      reply_markup: {
        keyboard: [
          [{ text: '✅ Yes, I\'m ready' }],
          [{ text: '📊 Open Dashboard', web_app: { url: APP_URL } }],
        ],
        resize_keyboard: true,
        one_time_keyboard: true,
      },
    }
  );
}

// ─────────────────────────────────────────────
// ASSESSMENT START CONFIRMATION
// ─────────────────────────────────────────────
export async function sendAssessmentStart(chat_id: number, first_name: string): Promise<void> {
  await sendMessage(
    chat_id,
    `🔥 *Let's go, ${first_name}!*\n\nYou'll receive 30 questions. For each one, reply with *A*, *B*, *C*, or *D*.\n\nAnswer honestly — there are no right or wrong answers. The system is designed to see you clearly.\n\n_Starting now..._`,
    { reply_markup: { remove_keyboard: true } }
  );
}

// ─────────────────────────────────────────────
// SEND a single question
// ─────────────────────────────────────────────
export async function sendQuestion(chat_id: number, question_number: number): Promise<void> {
  const question = QUESTIONS.find(q => q.id === question_number);
  if (!question) return;

  const text = `*Question ${question_number} of 30*\n\n${question.text}`;

  await sendMessage(chat_id, text, {
    reply_markup: {
      keyboard: [
        [{ text: 'A' }, { text: 'B' }],
        [{ text: 'C' }, { text: 'D' }],
      ],
      resize_keyboard: true,
      one_time_keyboard: true,
    },
  });
}

// ─────────────────────────────────────────────
// PROGRESS checkpoint messages (every 10 questions)
// ─────────────────────────────────────────────
export async function sendProgressMessage(chat_id: number, question_number: number): Promise<void> {
  if (question_number === 10) {
    await sendMessage(chat_id, `💪 *10 down, 20 to go.* Keep going — you're doing great.`);
  } else if (question_number === 20) {
    await sendMessage(chat_id, `🔥 *Halfway there!* Final 10 questions coming up.`);
  }
}

// ─────────────────────────────────────────────
// PROCESSING — while Claude generates profile
// ─────────────────────────────────────────────
export async function sendProcessingMessage(chat_id: number, first_name: string): Promise<void> {
  await sendMessage(
    chat_id,
    `✅ *Assessment complete, ${first_name}!*\n\n_Generating your 242Go Leadership Profile..._\n\nThis takes about 15–20 seconds. 🙏`,
    { reply_markup: { remove_keyboard: true } }
  );
}

// ─────────────────────────────────────────────
// PROFILE RESULT — send completed profile card
// ─────────────────────────────────────────────
export async function sendProfileResult(
  chat_id: number,
  profile: ScoredProfile
): Promise<void> {
  // Send the profile card
  if (profile.profile_card) {
    await sendMessage(chat_id, `\`\`\`\n${profile.profile_card}\n\`\`\``);
  }

  // Send next steps based on level
  const nextSteps = buildNextSteps(profile);
  await sendMessage(chat_id, nextSteps, {
    reply_markup: {
      inline_keyboard: [[
        { text: '📊 View Full Dashboard', web_app: { url: APP_URL } },
      ]],
    },
  });
}

function buildNextSteps(profile: ScoredProfile): string {
  const name = profile.first_name;

  if (profile.level_number === 1) {
    return `🌱 *${name}, welcome to the journey.*\n\nEvery multiplier started exactly where you are. Nicodemus came to Jesus at night — confused, searching, not sure what he believed. Jesus didn't turn him away. Neither do we.\n\n_Your coach will be in touch soon. When they reach out, just reply. That's all it takes to start._ 🤝`;
  }

  if (profile.level_number === 2) {
    return `📖 *${name}, you're building your foundation.*\n\nYou've got the commitment — now it's about consistency. Jesus said the wise man builds his house on the rock. That takes time, repetition, and showing up even when it's not exciting.\n\n_Your weekly check-ins start this week. The pipeline rewards those who just keep showing up._ 💪`;
  }

  if (profile.level_number === 3) {
    return `🤝 *${name}, you've proven F.A.T. — Faithful, Available, Teachable.*\n\nThat's not a small thing. Most people never get here. Luke 16:10 says whoever is faithful in little will be faithful in much — and you've been faithful in the little.\n\n_A senior leader will review your ministry placement this week. Stay ready. Your season is coming._ 🔥`;
  }

  if (profile.level_number === 4) {
    return `🌟 *${name}, you're ready to lead.*\n\nPaul told Timothy: "The things you've heard from me, entrust to faithful people who will be able to teach others also." That's 2 Timothy 2:2 — and that's your assignment now.\n\n_Your job isn't just to grow anymore. It's to bring someone with you. Your coach will help you figure out who._ 👑`;
  }

  return `🔥 *${name}, you're a multiplier.*\n\nThis is what Acts 2:42-47 looks like when it's fully alive — disciples making disciples, the Lord adding to their number daily. You've walked the whole pipeline. Now you are the pipeline for someone else.\n\n_Your next assignment: identify your Table of 4. Let's build what lasts._ ⚡`;
}

// ─────────────────────────────────────────────
// ALREADY ASSESSED — user already has a profile
// ─────────────────────────────────────────────
export async function sendAlreadyAssessed(
  chat_id: number,
  first_name: string,
  level: string,
  level_number: number
): Promise<void> {
  const emoji = { seeker: '🌱', disciple: '📖', servant: '🤝', leader: '🌟', multiplier: '🔥' }[level] ?? '⭐';
  await sendMessage(
    chat_id,
    `${emoji} *${first_name}, you've already completed your 242Go Assessment.*\n\nYour current level: *${level.charAt(0).toUpperCase() + level.slice(1)} (Level ${level_number})*\n\nOpen your dashboard to see your full profile or check in with your coach.`,
    {
      reply_markup: {
        inline_keyboard: [[
          { text: '📊 Open Dashboard', web_app: { url: APP_URL } },
        ]],
      },
    }
  );
}

// ─────────────────────────────────────────────
// INVALID ANSWER — user sent something unexpected
// ─────────────────────────────────────────────
export async function sendInvalidAnswer(chat_id: number, question_number: number): Promise<void> {
  await sendMessage(
    chat_id,
    `⚠️ Please reply with *A*, *B*, *C*, or *D* for Question ${question_number}.`,
    {
      reply_markup: {
        keyboard: [
          [{ text: 'A' }, { text: 'B' }],
          [{ text: 'C' }, { text: 'D' }],
        ],
        resize_keyboard: true,
        one_time_keyboard: true,
      },
    }
  );
}

// ─────────────────────────────────────────────
// ERROR — something went wrong
// ─────────────────────────────────────────────
export async function sendErrorMessage(chat_id: number): Promise<void> {
  await sendMessage(
    chat_id,
    `⚠️ Something went wrong on our end. Please try again in a moment.\n\nIf this keeps happening, reach out to your ministry leader.`
  );
}

// ─────────────────────────────────────────────
// GROUP CHAT — redirect to private
// ─────────────────────────────────────────────
export async function sendGroupRedirect(user_id: number, first_name: string): Promise<void> {
  await sendMessage(
    user_id,
    `👋 Hi ${first_name}! Your 242Go Leadership Assessment is a private conversation.\n\nTap below to open your personal dashboard.`,
    {
      reply_markup: {
        inline_keyboard: [[
          { text: '🔥 Open Leadership Dashboard', web_app: { url: APP_URL } },
        ]],
      },
    }
  );
}
