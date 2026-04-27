// 242Go AHDP — Telegram Webhook
// Full assessment state machine + coaching bot handler

import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { chat as aiChat } from '@/lib/ai';

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
import { scoreAndSaveProfile, getProfile, generateDevelopmentPlan } from '@/lib/assessment/scoring';
import { compareGrowth } from '@/lib/regression';
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
import { getRole, setRole, ensureVisitor, hasRole, type BotRole } from '@/lib/roles';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://telegram-mini-app-beta-coral.vercel.app';

// Admin Telegram user IDs — ultimate override, always treated as admin
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

    // ── PHOTO UPLOAD + VISION ──────────────────────────────
    if (message.photo && message.photo.length > 0) {
      const photo = message.photo[message.photo.length - 1];
      const file_id: string = photo.file_id;
      const caption: string = (message.caption || '').trim();

      // Save as profile avatar
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );
      await supabase
        .from('profiles_242go')
        .update({ avatar_file_id: file_id })
        .eq('telegram_user_id', user_id);

      // Analyze with Claude Vision
      try {
        await sendMessage(chat_id, `🔍 Analyzing...`);
        const fileRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getFile?file_id=${file_id}`);
        const fileData = await fileRes.json() as { result: { file_path: string } };
        const filePath = fileData.result.file_path;

        const imgRes = await fetch(`https://api.telegram.org/file/bot${BOT_TOKEN}/${filePath}`);
        const imgBuffer = await imgRes.arrayBuffer();
        const base64 = Buffer.from(imgBuffer).toString('base64');
        const mediaType = filePath.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg';

        const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
        const aiRes = await anthropic.messages.create({
          model: 'claude-sonnet-4-6',
          max_tokens: 1024,
          messages: [{
            role: 'user',
            content: [
              { type: 'image', source: { type: 'base64', media_type: mediaType, data: base64 } },
              { type: 'text', text: caption || 'What is in this image? Describe it clearly and concisely.' },
            ],
          }],
        });
        const reply = aiRes.content[0].type === 'text' ? aiRes.content[0].text : 'Unable to analyze image.';
        await sendMessage(chat_id, reply);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error('Vision error:', msg);
        await sendMessage(chat_id, `✅ Photo saved! (Vision analysis unavailable: ${msg.slice(0, 100)})`);
      }
      return NextResponse.json({ ok: true });
    }

    // ── GROUP CHATS: redirect to private ──────────────────
    if (chat_type === 'group' || chat_type === 'supergroup') {
      if (text.startsWith('/start') && user_id) {
        await sendGroupRedirect(user_id, first_name);
      }
      return NextResponse.json({ ok: true });
    }

    // ── RESOLVE ROLE ───────────────────────────────────────
    // Admins in env var are always admin regardless of DB
    const isEnvAdmin = ADMIN_IDS.includes(user_id);
    const userRole: BotRole = isEnvAdmin ? 'admin' : await ensureVisitor(user_id, first_name, username);

    // ── ADMIN: personal assistant (free-form messages) ─────
    if (userRole === 'admin' && text && !text.startsWith('/')) {
      // Deploy shortcut
      if (text.toLowerCase().trim() === 'deploy') {
        const codeServerUrl = process.env.CODE_SERVER_URL;
        const codeServerSecret = process.env.CODE_SERVER_SECRET || 'mrthomas';
        if (!codeServerUrl) {
          await sendMessage(chat_id, `⚠️ Code server not running. Can't auto-deploy.`);
          return NextResponse.json({ ok: true });
        }
        try {
          await sendMessage(chat_id, `🚀 Deploying to Vercel...`, { parse_mode: null });
          const res = await fetch(codeServerUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-secret': codeServerSecret, 'ngrok-skip-browser-warning': '1' },
            body: JSON.stringify({ path: '~/.deploy-trigger', content: new Date().toISOString() }),
          });
          // Trigger deploy via shell on the local server
          const deployRes = await fetch(`${codeServerUrl}/deploy`, {
            headers: { 'x-secret': codeServerSecret, 'ngrok-skip-browser-warning': '1' },
          });
          const data = await deployRes.json() as { ok?: boolean; error?: string };
          if (data.error) throw new Error(data.error);
          await sendMessage(chat_id, `✅ Deploy triggered. Check Vercel for status.`, { parse_mode: null });
        } catch {
          await sendMessage(chat_id, `Run this in terminal:\ncd ~/telegram-mini-app && vercel --prod --yes`, { parse_mode: null });
        }
        return NextResponse.json({ ok: true });
      }
      try {
        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // Load last 20 messages for context
        const { data: history } = await supabase
          .from('conversation_history')
          .select('role, content')
          .eq('telegram_user_id', user_id)
          .order('created_at', { ascending: false })
          .limit(20);

        const pastMessages = (history ?? []).reverse().map(r => ({
          role: r.role as 'user' | 'assistant',
          content: r.content,
        }));

        // Save the user message
        await supabase.from('conversation_history').insert({
          telegram_user_id: user_id,
          role: 'user',
          content: text,
        });

        const reply = await aiChat(
          [...pastMessages, { role: 'user', content: text }],
          {
            system: `You are Mr. Thomas — a senior-level developer, architect, life coach, and all-around straight shooter. You work exclusively for Pastorreno, founder of GGI Hub. You don't sugarcoat, you don't pad answers with filler, and you don't waste his time. You give him the real answer, the best path forward, and call it like it is — whether that's code, strategy, life decisions, or hard truths. You can write and review code at a senior level across any stack. You know his world: AI, churches, ministries, businesses, Telegram bots, Supabase, Next.js, Vercel, Anthropic. Today is ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}.`,
            maxTokens: 1024,
          }
        );

        // Save the assistant reply
        await supabase.from('conversation_history').insert({
          telegram_user_id: user_id,
          role: 'assistant',
          content: reply,
        });

        await sendMessage(chat_id, reply, { parse_mode: null });
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error('Assistant error:', msg);
        await sendMessage(chat_id, `⚠️ Error: ${msg.slice(0, 200)}`, { parse_mode: null });
      }
      return NextResponse.json({ ok: true });
    }

    // ── /local — admin only, routes to local Ollama via ngrok ─
    if (text.startsWith('/local')) {
      if (!hasRole(userRole, 'admin')) {
        await sendMessage(chat_id, `⛔ You don't have permission to use that command.`);
        return NextResponse.json({ ok: true });
      }
      const question = text.replace('/local', '').trim();
      if (!question) {
        await sendMessage(chat_id, `🖥️ *Local AI*\n\nSend a prompt after the command.\n\nExample: /local summarize John chapter 3`);
        return NextResponse.json({ ok: true });
      }
      const localUrl = process.env.LOCAL_AI_URL;
      if (!localUrl) {
        await sendMessage(chat_id, `⚠️ LOCAL_AI_URL is not configured.`);
        return NextResponse.json({ ok: true });
      }
      try {
        await sendMessage(chat_id, `⏳ Asking your local AI...`);
        const res = await fetch(`${localUrl}/api/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': '1' },
          body: JSON.stringify({ model: 'phi4-mini', prompt: question, stream: false }),
        });
        if (!res.ok) throw new Error(`Ollama returned ${res.status}`);
        const json = await res.json() as { response?: string };
        const reply = json.response?.trim() || 'No response from local AI.';
        await sendMessage(chat_id, `🖥️ Local AI:\n\n${reply}`, { parse_mode: null });
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error('Local AI error:', msg);
        await sendMessage(chat_id, `⚠️ Local AI error: ${msg.slice(0, 200)}\n\nMake sure ngrok is running on your Mac.`);
      }
      return NextResponse.json({ ok: true });
    }

    // ── /code — admin only, reads files from your Mac ─────
    if (text.startsWith('/code')) {
      if (!hasRole(userRole, 'admin')) {
        await sendMessage(chat_id, `⛔ You don't have permission.`);
        return NextResponse.json({ ok: true });
      }
      const parts = text.split(' ');
      const filePath = parts[1];
      const question = parts.slice(2).join(' ').trim();

      if (!filePath) {
        await sendMessage(chat_id, `💻 *Mr. Thomas — Code Access*\n\nUsage:\n/code <path> — read a file\n/code <path> <question> — read + ask\n\nExamples:\n/code ~/telegram-mini-app/src/lib/coaching.ts\n/code ~/telegram-mini-app/src/app/api/webhook/route.ts what is the /start flow?`);
        return NextResponse.json({ ok: true });
      }

      const codeServerUrl = process.env.CODE_SERVER_URL;
      const codeServerSecret = process.env.CODE_SERVER_SECRET || 'mrthomas';

      if (!codeServerUrl) {
        await sendMessage(chat_id, `⚠️ CODE_SERVER_URL not set.\n\n1. Run: node ~/code-server.js\n2. Run: ngrok http 19000\n3. Add CODE_SERVER_URL to Vercel env vars`);
        return NextResponse.json({ ok: true });
      }

      try {
        await sendMessage(chat_id, `🔍 Reading ${filePath}...`, { parse_mode: null });
        const res = await fetch(`${codeServerUrl}?path=${encodeURIComponent(filePath)}`, {
          headers: { 'x-secret': codeServerSecret, 'ngrok-skip-browser-warning': '1' },
        });
        const data = await res.json() as { type?: string; content?: string; entries?: Array<{name: string; type: string}>; error?: string };

        if (data.error) throw new Error(data.error);

        if (data.type === 'directory') {
          const listing = (data.entries ?? []).map(e => `${e.type === 'dir' ? '📁' : '📄'} ${e.name}`).join('\n');
          await sendMessage(chat_id, `📁 *${filePath}*\n\n${listing}`, { parse_mode: null });
          return NextResponse.json({ ok: true });
        }

        const fileContent = data.content ?? '';

        if (!question) {
          // Just show the file (truncated for Telegram's 4096 char limit)
          const preview = fileContent.slice(0, 3500);
          await sendMessage(chat_id, `📄 *${filePath}*\n\`\`\`\n${preview}${fileContent.length > 3500 ? '\n...[truncated]' : ''}\n\`\`\``);
          return NextResponse.json({ ok: true });
        }

        // Ask Mr. Thomas about the file
        const reply = await aiChat(
          [{
            role: 'user',
            content: `File: ${filePath}\n\n\`\`\`\n${fileContent.slice(0, 8000)}\n\`\`\`\n\nQuestion: ${question}`,
          }],
          {
            system: `You are Mr. Thomas — senior developer, straight shooter. You're reviewing code for Pastorreno. Be direct, specific, and actionable. No fluff.`,
            maxTokens: 1500,
          }
        );
        await sendMessage(chat_id, reply, { parse_mode: null });
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        await sendMessage(chat_id, `⚠️ ${msg}\n\nMake sure code-server.js and ngrok are running on your Mac.`, { parse_mode: null });
      }
      return NextResponse.json({ ok: true });
    }

    // ── /write — admin only, Mr. Thomas edits files on your Mac ─
    if (text.startsWith('/write')) {
      if (!hasRole(userRole, 'admin')) {
        await sendMessage(chat_id, `⛔ You don't have permission.`);
        return NextResponse.json({ ok: true });
      }

      const codeServerUrl = process.env.CODE_SERVER_URL;
      const codeServerSecret = process.env.CODE_SERVER_SECRET || 'mrthomas';

      if (!codeServerUrl) {
        await sendMessage(chat_id, `⚠️ CODE_SERVER_URL not set. Run code-server.js and ngrok first.`);
        return NextResponse.json({ ok: true });
      }

      // Format: /write <path> <instruction>
      // Mr. Thomas reads the file, applies the instruction, writes it back
      const parts = text.replace('/write', '').trim().split(' ');
      const filePath = parts[0];
      const instruction = parts.slice(1).join(' ').trim();

      if (!filePath || !instruction) {
        await sendMessage(chat_id, `✏️ *Mr. Thomas — File Editor*\n\nUsage:\n/write <path> <instruction>\n\nExample:\n/write ~/telegram-mini-app/src/lib/coaching.ts add error handling to the runWeeklyCoaching function`, { parse_mode: null });
        return NextResponse.json({ ok: true });
      }

      try {
        await sendMessage(chat_id, `✏️ Reading and editing ${filePath}...`, { parse_mode: null });

        // Read the file
        const readRes = await fetch(`${codeServerUrl}?path=${encodeURIComponent(filePath)}`, {
          headers: { 'x-secret': codeServerSecret, 'ngrok-skip-browser-warning': '1' },
        });
        const fileData = await readRes.json() as { content?: string; error?: string };
        if (fileData.error) throw new Error(fileData.error);

        const fileContent = fileData.content ?? '';

        // Ask Mr. Thomas to apply the change
        const newContent = await aiChat(
          [{
            role: 'user',
            content: `File: ${filePath}\n\nInstruction: ${instruction}\n\nCurrent content:\n${fileContent}`,
          }],
          {
            system: `You are Mr. Thomas — senior developer. You will be given a file and an instruction. Apply the instruction and return ONLY the complete updated file content. No explanation, no markdown fences, no commentary. Just the raw updated file.`,
            maxTokens: 8000,
          }
        );
        if (!newContent) throw new Error('Mr. Thomas returned empty content');

        // Write the file back
        const writeRes = await fetch(codeServerUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-secret': codeServerSecret, 'ngrok-skip-browser-warning': '1' },
          body: JSON.stringify({ path: filePath, content: newContent }),
        });
        const writeData = await writeRes.json() as { ok?: boolean; error?: string };
        if (writeData.error) throw new Error(writeData.error);

        await sendMessage(chat_id, `✅ Done. ${filePath} has been updated.\n\nDeploy when ready: send me "deploy" or run vercel --prod in terminal.`, { parse_mode: null });
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        await sendMessage(chat_id, `⚠️ Write failed: ${msg}`, { parse_mode: null });
      }
      return NextResponse.json({ ok: true });
    }

    // ── /bible — available to all roles ───────────────────
    if (text.startsWith('/bible')) {
      const question = text.replace('/bible', '').trim();
      if (!question) {
        await sendMessage(
          chat_id,
          `📖 *Bible Buddies*\n\n_Deep Truth. Real Talk._\n\nSend a verse, topic, or question after the command.\n\nExample: /bible What does the Bible say about forgiveness?`
        );
        return NextResponse.json({ ok: true });
      }
      try {
        const reply = await aiChat(
          [{ role: 'user', content: question }],
          {
            system: `You are a helpful, knowledgeable, and highly accessible Bible study guide called Bible Buddies. You speak in the stylistic vein of Dr. Eric Mason — clear, passionate, doctrinally sound, accessible to new believers yet enriching for seasoned ones.

RULES:
1. Help the user discover what the Bible ACTUALLY says. Handle practical, theological, and historical questions comprehensively.
2. Use plain, basic English a brand-new believer can understand. Avoid heavy jargon, but keep theology accurate.
3. PACING: Do NOT give everything at once. Start with a short, bite-sized response (1-2 short paragraphs max). Give a brief foundational answer with one or two key scriptures.
4. CROSS-REFERENCING: ALWAYS include 1-2 cross-reference verses that connect to the primary scripture. Briefly explain how they connect.
5. GOING DEEPER: ALWAYS end your response with an engaging question to invite them to go deeper.
6. Let the truth of God's Word do the heavy lifting — avoid mere personal opinions.
7. ALWAYS cite the exact Book, Chapter, and Verse for every scripture referenced.
8. Format clearly: separate scripture text so it stands out visually.
9. ALWAYS use the CSB (Christian Standard Bible) translation.
10. End every response with: "📖 Don't just take my word for it — read the full chapter yourself."`,
            maxTokens: 1024,
          }
        );
        await sendMessage(chat_id, reply, { parse_mode: null });
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error('Bible mode error:', msg);
        await sendMessage(chat_id, '⚠️ Unable to retrieve scriptures right now. Try again.');
      }
      return NextResponse.json({ ok: true });
    }

    // ── /promote — admin only ──────────────────────────────
    if (text.startsWith('/promote')) {
      if (!hasRole(userRole, 'admin')) {
        await sendMessage(chat_id, `⛔ You don't have permission to use that command.`);
        return NextResponse.json({ ok: true });
      }
      // Usage: /promote <user_id> <role>
      const parts = text.split(' ');
      const targetId = Number(parts[1]);
      const newRole = parts[2] as BotRole;
      const validRoles: BotRole[] = ['visitor', 'member', 'staff', 'admin'];

      if (!targetId || !validRoles.includes(newRole)) {
        await sendMessage(chat_id, `Usage: /promote <telegram_user_id> <visitor|member|staff|admin>`);
        return NextResponse.json({ ok: true });
      }

      await setRole(targetId, '', null, newRole, user_id);
      await sendMessage(chat_id, `✅ User ${targetId} has been promoted to *${newRole}*.`);
      return NextResponse.json({ ok: true });
    }

    // ── /myrole — check your own role ─────────────────────
    if (text === '/myrole') {
      const role = await getRole(user_id);
      const roleEmoji: Record<BotRole, string> = {
        visitor: '👋',
        member: '✅',
        staff: '⭐',
        admin: '👑',
      };
      await sendMessage(
        chat_id,
        `${roleEmoji[role]} *Your role:* ${role.charAt(0).toUpperCase() + role.slice(1)}\n\nYour Telegram ID is \`${user_id}\`.`
      );
      return NextResponse.json({ ok: true });
    }

    // ── /admin — admin only ────────────────────────────────
    if (text === '/admin') {
      if (!hasRole(userRole, 'admin')) {
        await sendMessage(chat_id, `⛔ You don't have permission to use that command.`);
        return NextResponse.json({ ok: true });
      }
      await sendMessage(
        chat_id,
        `👑 *Admin Panel*\n\n*Role commands:*\n/promote <id> <role> — change a user's role\n/myrole — check your role\n/reset <id> — reset assessment\n\n*AI commands:*\n/local <prompt> — ask your local Mac AI\n\n*Roles:* visitor → member → staff → admin`,
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

    // ── /reset — admin only ────────────────────────────────
    if (text.startsWith('/reset')) {
      if (!hasRole(userRole, 'admin')) {
        await sendMessage(chat_id, `⛔ You don't have permission to use that command.`);
        return NextResponse.json({ ok: true });
      }
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

    // ── /dashboard — member+ ───────────────────────────────
    if (text === '/dashboard') {
      if (!hasRole(userRole, 'member')) {
        await sendMessage(chat_id, `Complete your leadership assessment first to unlock your dashboard. Send /start to begin.`);
        return NextResponse.json({ ok: true });
      }
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

    // ── /prayer — member+ ──────────────────────────────────
    if (text === '/prayer') {
      if (!hasRole(userRole, 'member')) {
        await sendMessage(chat_id, `Complete your leadership assessment first. Send /start to begin.`);
        return NextResponse.json({ ok: true });
      }
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

    // ── /resources — member+ ───────────────────────────────
    if (text === '/resources') {
      if (!hasRole(userRole, 'member')) {
        await sendMessage(chat_id, `Complete your leadership assessment first. Send /start to begin.`);
        return NextResponse.json({ ok: true });
      }
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

    // ── /retest — member retakes after 90 days ─────────────
    if (text === '/retest') {
      const existingProfile = await getProfile(user_id);
      if (!existingProfile) {
        await sendMessage(chat_id, `You haven't taken the assessment yet. Send /start to begin.`);
        return NextResponse.json({ ok: true });
      }
      // Store baseline scores before resetting, then start fresh session
      const { createClient: createRetestClient } = await import('@supabase/supabase-js');
      const retestSupabase = createRetestClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );
      await retestSupabase.from('profiles_242go').update({
        baseline_overall: existingProfile.overall_score,
        baseline_character: existingProfile.character_score,
        baseline_competency: existingProfile.competency_score,
        baseline_consistency: existingProfile.consistency_score,
        is_retest: true,
      }).eq('telegram_user_id', user_id);
      await startSession(user_id, first_name, username);
      await sendMessage(chat_id, `🔄 *90-Day Retest — Let's see your growth, ${first_name}.*\n\nSame 30 questions. Answer honestly. Your results will be compared to your baseline.\n\nReady?`, {
        reply_markup: { keyboard: [[{ text: "✅ Yes, I'm ready" }]], resize_keyboard: true, one_time_keyboard: true },
      });
      return NextResponse.json({ ok: true });
    }

    // ── /start ─────────────────────────────────────────────
    if (text === '/start' || text.startsWith('/start ')) {
      const existingProfile = await getProfile(user_id);
      if (existingProfile) {
        await sendAlreadyAssessed(chat_id, first_name, existingProfile.level, existingProfile.level_number);
        return NextResponse.json({ ok: true });
      }
      await startSession(user_id, first_name, username);
      await sendWelcome(chat_id, first_name);
      return NextResponse.json({ ok: true });
    }

    // ── STATE MACHINE ──────────────────────────────────────
    const session = await getSession(user_id);

    if (!session) {
      await sendMessage(
        chat_id,
        `👋 Hi ${first_name}! Send /start to begin your 242Go Leadership Assessment.\n\nAvailable commands:\n/bible — Bible study\n/myrole — Check your access level`,
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

    if (session.state === 'in_assessment') {
      const answer = parseAnswer(text);
      if (!answer) {
        await sendInvalidAnswer(chat_id, session.current_question);
        return NextResponse.json({ ok: true });
      }

      const { session: updated, isComplete } = await recordAnswer(user_id, session.current_question, answer);

      if (isComplete) {
        await sendProcessingMessage(chat_id, first_name);
        const profile = await scoreAndSaveProfile(user_id, first_name, username, updated.answers);
        syncProfileToNotion(profile).catch(err => console.error('Notion sync error:', err));
        await markComplete(user_id);
        await setRole(user_id, first_name, username, 'member', user_id);
        await sendProfileResult(chat_id, profile);
        // Generate and send 90-day development plan
        generateDevelopmentPlan(profile).then(async (plan) => {
          if (plan) {
            await sendMessage(chat_id, `📋 *Your 90-Day Development Plan*\n\n${plan}`, { parse_mode: null });
          }
        }).catch(err => console.error('Dev plan error:', err));
        // If retest, send growth comparison
        compareGrowth(user_id, first_name, profile).catch(err => console.error('Growth compare error:', err));
      } else {
        if (updated.current_question === 11 || updated.current_question === 21) {
          await sendProgressMessage(chat_id, updated.current_question - 1);
          await new Promise(r => setTimeout(r, 500));
        }
        await sendQuestion(chat_id, updated.current_question);
      }
      return NextResponse.json({ ok: true });
    }

    if (session.state === 'processing') {
      await sendMessage(chat_id, `⏳ Your profile is still being generated. Hang tight, ${first_name}!`);
      return NextResponse.json({ ok: true });
    }

    if (session.state === 'complete') {
      if (text && !text.startsWith('/')) {
        const isCrisis = await checkForCrisis(user_id, first_name, text);
        if (isCrisis) {
          await sendMessage(
            chat_id,
            `I hear you, ${first_name}. Please reach out to your pastor immediately or call *988* (Suicide & Crisis Lifeline). You are not alone and you are loved. 🙏`
          );
          return NextResponse.json({ ok: true });
        }
        await recordCoachingResponse(user_id, text);
        const acks = [
          `🙏 Got it, ${first_name}. Keep pushing.`,
          `✅ Logged. Your coach sees you, ${first_name}.`,
          `💪 Received. Stay the course, ${first_name}.`,
          `🔥 That's real. Your coach has noted it.`,
        ];
        await sendMessage(chat_id, acks[Math.floor(Math.random() * acks.length)]);
        return NextResponse.json({ ok: true });
      }

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

    return NextResponse.json({ ok: true });

  } catch (err) {
    console.error('Webhook error:', err instanceof Error ? err.message : String(err));
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    message: '242Go Leadership Pipeline webhook active',
    token_set: !!BOT_TOKEN,
    version: '2.0.0',
  });
}
