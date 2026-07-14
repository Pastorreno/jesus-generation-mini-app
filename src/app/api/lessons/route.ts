import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function GET() {
  const sb = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await sb
    .from('lessons')
    .select('id, series, title, lesson_number, file_name, created_at')
    .order('series')
    .order('lesson_number', { ascending: true, nullsFirst: false })
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Group by series
  const grouped: Record<string, typeof data> = {};
  for (const lesson of data ?? []) {
    if (!grouped[lesson.series]) grouped[lesson.series] = [];
    grouped[lesson.series]!.push(lesson);
  }

  return NextResponse.json({ lessons: data, grouped });
}
