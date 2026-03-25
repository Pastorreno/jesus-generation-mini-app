// 242Go AHDP — Telegram Webhook
// Full assessment state machine + coaching bot handler

import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import {
  getSession,
  startSession,
  confirmStart,
  recordAnswer,
  markComplete,
  resetSession,
  parseAnswer,
} from '@/lib/assessment/session';
import { scoreAndSaveProfile, getProfile } from '@/lib/assessment/scoring';
import { syncProfileToNotion } from '@/lib/notion';
import { recordCoachingResponse, checkForCrisis } from '@/lib/coaching';
import {
  sendWelcome,
  sendAssessmentStart,
  sendQuestion,
  sendProgressMessage,
  sendProcessingMessage,
  sendProfileResult,
  sendAlreadyAssessed,
  sendInvalidAnswer,
  sendErrorMessage,
  sendGroupRedirect,
  sendMessage,
} from '@/lib/telegram';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://telegram-mini-app-beta-coral.vercel.app';

// Admin Telegram user IDs who can use /reset and /admin commands
const ADMIN_IDS: number[] = process.env.ADMIN_TELEGRAM_IDS
  ? process.env.ADMIN_TELEGRAM_IDS.split(',').map(Number)
  : [];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const message = body?.message;
    if (!message) return NextResponse.json({ ok: true });

    const chat_id: number = message.chat.id;
    const chat_type: string = message.chat.type;
    const user_id: number = message.from?.id;
    const text: string = (message.text || '').trim();
    const first_name: string = message.from?.first_name || 'Leader';
    const username: string | null = message.from?.username ?? null;

    // ── PHOTO UPLOAD ───────────────────────────────────────
    if (message.photo && message.photo.length > 0) {
      const photo = message.photo[message.photo.length - 1]; // highest resolution
      const file_id: string = photo.file_id;

      // Save file_id to their profile
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );
      await supabase
        .from('profiles_242go')
        .update({ avatar_file_id: file_id })
        .eq('telegram_user_id', user_id);

      await sendMessage(
        chat_id,
        `✅ Got it, ${first_name}! Your profile photo has been saved.`
      );
      return NextResponse.json({ ok: true });
    }

    // ── GROUP CHATS: redirect to private ──────────────────
    if (chat_type === 'group' || chat_type === 'supergroup') {
      if (text.startsWith('/start') && user_id) {
        await sendGroupRedirect(user_id, first_name);
      }
      return NextResponse.json({ ok: true });
    }

    // ── ADMIN COMMANDS ─────────────────────────────────────
    if (ADMIN_IDS.includes(user_id)) {
      // /reset @username or /reset <user_id>
      if (text.startsWith('/reset')) {
        const parts = text.split(' ');
        const target = parts[1];
        if (target && !isNaN(Number(target))) {
          await resetSession(Number(target));
          await sendMessage(chat_id, `✅ Session reset for user ${target}.`);
        } else {
          await sendMessage(chat_id, `Usage: /reset <telegram_user_id>`);
        }
        return NextResponse.json({ ok: true });
      }

      // /admin — show admin panel link
      if (text === '/admin') {
        await sendMessage(
          chat_id,
          `🔧 *242Go Admin*\n\nOpen the admin dashboard to view all profiles, flag reviews, and manage the pipeline.`,
          {
            reply_markup: {
              inline_keyboard: [[
                { text: '🔧 Admin Dashboard', web_app: { url: `${APP_URL}?admin=true` } },
              ]],
            },
          }
        );
        return NextResponse.json({ ok: true });
      }
    }

    // ── /start ─────────────────────────────────────────────
    if (text === '/start' || text.startsWith('/start ')) {
      // Check if they already have a complete profile
      const existingProfile = await getProfile(user_id);
      if (existingProfile) {
        await sendAlreadyAssessed(chat_id, first_name, existingProfile.level, existingProfile.level_number);
        return NextResponse.json({ ok: true });
      }

      // Start or restart their session
      await startSession(user_id, first_name, username);
      await sendWelcome(chat_id, first_name);
      return NextResponse.json({ ok: true });
    }

    // ── /dashboard ─────────────────────────────────────────
    if (text === '/dashboard') {
      await sendMessage(
        chat_id,
        `📊 *Your 242Go Dashboard*\n\nTap below to view your leadership profile, pipeline scores, and coaching resources.`,
        {
          reply_markup: {
            inline_keyboard: [[
              { text: '📊 Open Dashboard', web_app: { url: APP_URL } },
            ]],
          },
        }
      );
      return NextResponse.json({ ok: true });
    }

    // ── /prayer ────────────────────────────────────────────
    if (text === '/prayer') {
      await sendMessage(
        chat_id,
        `🙏 *Submit a Prayer Request*\n\nOpen your dashboard and tap the Prayer tab to submit your request to the leadership team.`,
        {
          reply_markup: {
            inline_keyboard: [[
              { text: '🙏 Prayer Tab', web_app: { url: `${APP_URL}?tab=prayer` } },
            ]],
          },
        }
      );
      return NextResponse.json({ ok: true });
    }

    // ── /resources ─────────────────────────────────────────
    if (text === '/resources') {
      await sendMessage(
        chat_id,
        `📚 *Leadership Resources*\n\nAccess your training materials, guides, and tools inside the dashboard.`,
        {
          reply_markup: {
            inline_keyboard: [[
              { text: '📚 Open Resources', web_app: { url: `${APP_URL}?tab=resources` } },
            ]],
          },
        }
      );
      return NextResponse.json({ ok: true });
    }

    // ── STATE MACHINE — get current session ────────────────
    const session = await getSession(user_id);

    // No session + no /start — prompt them
    if (!session) {
      await sendMessage(
        chat_id,
        `👋 Hi ${first_name}! Send /start to begin your 242Go Leadership Assessment, or tap below to open your dashboard.`,
        {
          reply_markup: {
            inline_keyboard: [[
              { text: '🔥 Open Dashboard', web_app: { url: APP_URL } },
            ]],
          },
        }
      );
      return NextResponse.json({ ok: true });
    }

    // ── STATE: awaiting_start ──────────────────────────────
    if (session.state === 'awaiting_start') {
      const normalized = text.toLowerCase();
      if (
        normalized.includes('yes') ||
        normalized.includes('ready') ||
        normalized === 'a' ||
        normalized === '✅'
      ) {
        await confirmStart(user_id);
        await sendAssessmentStart(chat_id, first_name);
        // Small delay then send Q1
        await new Promise(r => setTimeout(r, 1000));
        await sendQuestion(chat_id, 1);
      } else {
        await sendMessage(
          chat_id,
          `When you're ready to begin your assessment, tap *Yes, I\'m ready* or type "yes".`,
          {
            reply_markup: {
              keyboard: [[{ text: "✅ Yes, I'm ready" }]],
              resize_keyboard: true,
              one_time_keyboard: true,
            },
          }
        );
      }
      return NextResponse.json({ ok: true });
    }

    // ── STATE: in_assessment ───────────────────────────────
    if (session.state === 'in_assessment') {
      const answer = parseAnswer(text);

      if (!answer) {
        await sendInvalidAnswer(chat_id, session.current_question);
        return NextResponse.json({ ok: true });
      }

      // Record the answer
      const { session: updated, isComplete } = await recordAnswer(
        user_id,
        session.current_question,
        answer
      );

      if (isComplete) {
        // Send processing message
        await sendProcessingMessage(chat_id, first_name);

        // Score and save profile (calls Claude API + Supabase)
        const profile = await scoreAndSaveProfile(
          user_id,
          first_name,
          username,
          updated.answers
        );

        // Sync to Notion CRM (non-blocking on error)
        syncProfileToNotion(profile).catch(err =>
          console.error('Notion sync error:', err)
        );

        // Mark session complete
        await markComplete(user_id);

        // Send profile result
        await sendProfileResult(chat_id, profile);

      } else {
        // Send progress checkpoint if milestone
        if (updated.current_question === 11 || updated.current_question === 21) {
          await sendProgressMessage(chat_id, updated.current_question - 1);
          await new Promise(r => setTimeout(r, 500));
        }

        // Send next question
        await sendQuestion(chat_id, updated.current_question);
      }

      return NextResponse.json({ ok: true });
    }

    // ── STATE: processing ──────────────────────────────────
    if (session.state === 'processing') {
      await sendMessage(
        chat_id,
        `⏳ Your profile is still being generated. This only takes a moment — hang tight, ${first_name}!`
      );
      return NextResponse.json({ ok: true });
    }

    // ── STATE: complete — handle ongoing coaching responses ──
    if (session.state === 'complete') {
      // If they typed something, it's a response to a coaching message
      if (text && !text.startsWith('/')) {
        // Crisis check runs first — always
        const isCrisis = await checkForCrisis(user_id, first_name, text);
        if (isCrisis) {
          await sendMessage(
            chat_id,
            `I hear you, ${first_name}. Please reach out to your pastor immediately or call *988* (Suicide & Crisis Lifeline). You are not alone and you are loved. 🙏`
          );
          return NextResponse.json({ ok: true });
        }

        await recordCoachingResponse(user_id, text);
        // Simple acknowledgment — coaching reply comes from scheduled messages
        const acks = [
          `🙏 Got it, ${first_name}. Keep pushing.`,
          `✅ Logged. Your coach sees you, ${first_name}.`,
          `💪 Received. Stay the course, ${first_name}.`,
          `🔥 That's real. Your coach has noted it.`,
        ];
        const ack = acks[Math.floor(Math.random() * acks.length)];
        await sendMessage(chat_id, ack);
        return NextResponse.json({ ok: true });
      }

      // Commands or re-opens
      const profile = await getProfile(user_id);
      if (profile) {
        await sendAlreadyAssessed(chat_id, first_name, profile.level, profile.level_number);
      } else {
        await sendMessage(
          chat_id,
          `Your assessment is complete! Open your dashboard to view your profile.`,
          {
            reply_markup: {
              inline_keyboard: [[
                { text: '📊 Open Dashboard', web_app: { url: APP_URL } },
              ]],
            },
          }
        );
      }
      return NextResponse.json({ ok: true });
    }

    // Fallback
    return NextResponse.json({ ok: true });

  } catch (err) {
    console.error('Webhook error:', err);
    // Try to send error message if we have a chat_id
    try {
      const body = await (req as NextRequest & { _body?: unknown })._body;
      if (body) {
        const chat_id = (body as { message?: { chat?: { id?: number } } })?.message?.chat?.id;
        if (chat_id) await sendErrorMessage(chat_id);
      }
    } catch {
      // silent
    }
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    message: '242Go Leadership Pipeline webhook active',
    token_set: !!BOT_TOKEN,
    version: '1.0.0',
  });
}
