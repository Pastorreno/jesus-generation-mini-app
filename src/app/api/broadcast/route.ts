// 242Go — Broadcast Message API
// Send a message to all members (or filtered subset)
// POST /api/broadcast  { message, level_filter?, secret }

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendMessage } from '@/lib/telegram';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Auth check
    if (body.secret !== process.env.CRON_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { message, level_filter } = body;
    if (!message) {
      return NextResponse.json({ error: 'message required' }, { status: 400 });
    }

    // Fetch recipients
    let query = supabase
      .from('profiles_242go')
      .select('telegram_user_id, first_name');

    if (level_filter) {
      query = query.eq('level', level_filter);
    }

    const { data: profiles, error } = await query;
    if (error || !profiles) {
      return NextResponse.json({ error: 'Could not fetch profiles' }, { status: 500 });
    }

    let sent = 0;
    let failed = 0;

    for (const profile of profiles) {
      try {
        // Personalize the message with their name
        const personalized = message.replace(/\{name\}/g, profile.first_name);
        await sendMessage(profile.telegram_user_id, personalized);
        sent++;
        // Small delay to avoid Telegram rate limits
        await new Promise(r => setTimeout(r, 50));
      } catch {
        failed++;
      }
    }

    return NextResponse.json({ ok: true, sent, failed, total: profiles.length });
  } catch (err) {
    console.error('Broadcast error:', err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
