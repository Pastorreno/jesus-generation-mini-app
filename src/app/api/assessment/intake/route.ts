import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Fires the moment someone hits "Begin Assessment" — captures contact info
// even if they never finish. Does NOT overwrite anyone who already completed.
export async function POST(req: NextRequest) {
  const { name, email, phone, telegram } = await req.json() as {
    name: string; email: string; phone: string; telegram: string;
  };

  if (!name?.trim()) return NextResponse.json({ ok: false });

  try {
    // Check if this email already has a completed assessment — don't overwrite
    if (email?.trim()) {
      const { data: existing } = await supabase
        .from('leaders')
        .select('id, assessment_completed_at')
        .eq('email', email.trim())
        .single();

      if (existing?.assessment_completed_at) {
        return NextResponse.json({ ok: true, note: 'already completed' });
      }

      if (existing) {
        // Update contact info on partial record
        await supabase.from('leaders').update({ name: name.trim(), phone: phone?.trim() || null }).eq('id', existing.id);
        return NextResponse.json({ ok: true });
      }
    }

    // New person — create a partial record
    await supabase.from('leaders').insert({
      name: name.trim(),
      email: email?.trim() || null,
      phone: phone?.trim() || null,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false });
  }
}
