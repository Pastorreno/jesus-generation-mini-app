import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

function getSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// GET /api/profile?user_id=123 or ?telegram_id=123
export async function GET(req: NextRequest) {
  const raw = req.nextUrl.searchParams.get('user_id') ?? req.nextUrl.searchParams.get('telegram_id');
  if (!raw) return NextResponse.json({ error: 'missing user_id' }, { status: 400 });

  const uid = parseInt(raw);

  const [{ data: profile }, { data: coaching }] = await Promise.all([
    getSupabaseClient().from('profiles_242go').select('*').eq('telegram_user_id', uid).single(),
    getSupabaseClient().from('coaching_log').select('id, sent_at, message_text, response_text, day_type')
      .eq('telegram_user_id', uid).order('sent_at', { ascending: false }).limit(20),
  ]);

  return NextResponse.json({ profile: profile ?? null, coaching: coaching ?? [] });
}

// POST /api/profile — capture Telegram identity on app open
export async function POST(req: NextRequest) {
  const { telegram_id, first_name, username } = await req.json();
  if (!telegram_id) return NextResponse.json({ ok: false });

  // Upsert identity only — don't touch any assessment columns
  await getSupabaseClient()
    .from('profiles_242go')
    .upsert(
      { telegram_user_id: telegram_id, first_name, username: username?.replace('@', '') || null },
      { onConflict: 'telegram_user_id', ignoreDuplicates: false }
    );

  return NextResponse.json({ ok: true });
}
