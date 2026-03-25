// 242Go — Daily Regression Check (Vercel Cron Job)
// Runs every day at 8am — checks all members for drift/silence
// Configured in vercel.json

import { NextRequest, NextResponse } from 'next/server';
import { runRegressionCheck } from '@/lib/regression';

// Protect this endpoint — only Vercel cron can call it
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await runRegressionCheck();
    return NextResponse.json({
      ok: true,
      checked: result.checked,
      flagged: result.flagged,
      ran_at: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Cron regression check failed:', err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
