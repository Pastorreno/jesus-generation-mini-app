// Coach Reno — Personal Assistant Bot
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { chat as aiChat } from '@/lib/ai';

export const dynamic = 'force-dynamic';

const BOT_TOKEN = process.env.COACH_RENO_BOT_TOKEN;
const OWNER_ID = process.env.ADMIN_TELEGRAM_IDS?.split(',').map(Number)[0];

async function send(chat_id: number, text: string) {
  if (!BOT_TOKEN) return;
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id, text, parse_mode: 'Markdown' }),
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const message = body?.message;
    if (!message) return NextResponse.json({ ok: true });

    const chat_id: number = message.chat.id;
    const user_id: number = message.from?.id;
    const text: string = (message.text || '').trim();

    // Only respond to the owner
    if (OWNER_ID && user_id !== OWNER_ID) {
      await send(chat_id, "This is a private assistant.");
      return NextResponse.json({ ok: true });
    }

    if (!text) return NextResponse.json({ ok: true });

    // Deploy shortcut
    if (text.toLowerCase() === 'deploy') {
      const codeServerUrl = process.env.CODE_SERVER_URL;
      const secret = process.env.CODE_SERVER_SECRET || 'mrthomas';
      if (!codeServerUrl) {
        await send(chat_id, `Run in terminal:\ncd ~/telegram-mini-app && vercel --prod --yes`);
        return NextResponse.json({ ok: true });
      }
      try {
        await send(chat_id, `🚀 Deploying...`);
        const deployRes = await fetch(`${codeServerUrl}/deploy`, {
          headers: { 'x-secret': secret, 'ngrok-skip-browser-warning': '1' },
        });
        const data = await deployRes.json() as { ok?: boolean; error?: string };
        if (data.error) throw new Error(data.error);
        await send(chat_id, `✅ Deploy triggered.`);
      } catch {
        await send(chat_id, `Run in terminal:\ncd ~/telegram-mini-app && vercel --prod --yes`);
      }
      return NextResponse.json({ ok: true });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: history } = await supabase
      .from('conversation_history')
      .select('role, content')
      .eq('telegram_user_id', user_id)
      .order('created_at', { ascending: false })
      .limit(20);

    const past = (history ?? []).reverse().map(r => ({
      role: r.role as 'user' | 'assistant',
      content: r.content,
    }));

    await supabase.from('conversation_history').insert({ telegram_user_id: user_id, role: 'user', content: text });

    const reply = await aiChat(
      [...past, { role: 'user', content: text }],
      {
        system: `You are Mr. Thomas — senior developer, architect, life coach, straight shooter. You work exclusively for Pastorreno, founder of GGI Hub. No filler, no sugarcoating. Real answers, best path forward. You know his stack: Next.js, Supabase, Vercel, Telegram bots, Anthropic, church/ministry tech. Today is ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}.`,
        maxTokens: 1024,
      }
    );

    await supabase.from('conversation_history').insert({ telegram_user_id: user_id, role: 'assistant', content: reply });
    await send(chat_id, reply);

  } catch (err) {
    console.error('Coach Reno error:', err);
  }
  return NextResponse.json({ ok: true });
}
