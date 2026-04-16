import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

function getSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// GET /api/profile?telegram_id=123456789
export async function GET(req: NextRequest) {
  const telegram_id = req.nextUrl.searchParams.get('telegram_id');
  if (!telegram_id) return NextResponse.json({ error: 'missing telegram_id' }, { status: 400 });

  const { data: profile } = await getSupabaseClient()
    .from('profiles_242go')
    .select('*')
    .eq('telegram_user_id', parseInt(telegram_id))
    .single();

  return NextResponse.json({ profile: profile || null });
}

// POST /api/profile
// Body: { telegram_id, first_name, username, scores?, calling_score? }
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { telegram_id, first_name, username, scores, calling_score } = body;

  if (!telegram_id) return NextResponse.json({ error: 'missing telegram_id' }, { status: 400 });

  // Upsert user record (users table may not have metadata col — use safe subset)
  await getSupabaseClient().from('users').upsert(
    { telegram_id, full_name: first_name },
    { onConflict: 'telegram_id' }
  );

  // Upsert into profiles_242go — all score columns are nullable in the live schema
  if (scores || calling_score !== undefined) {
    const upsertData: Record<string, unknown> = {
      telegram_user_id: telegram_id,
      first_name,
      username,
    };

    if (scores) {
      upsertData.character_score = scores.character;
      upsertData.competency_score = scores.competency;
      // overall_score as 0-100 percentage across all 4 sections
      const totalRaw =
        (scores.character ?? 0) +
        (scores.competency ?? 0) +
        (scores.ownership ?? 0) +
        (scores.relational ?? 0);
      upsertData.overall_score = Math.round((totalRaw / (50 * 4)) * 100);
    }

    if (calling_score !== undefined) {
      // calling assessment pct (0-100) stored in consistency_score
      upsertData.consistency_score = calling_score;
    }

    await getSupabaseClient()
      .from('profiles_242go')
      .upsert(upsertData, { onConflict: 'telegram_user_id' });
  }

  return NextResponse.json({ ok: true });
}
