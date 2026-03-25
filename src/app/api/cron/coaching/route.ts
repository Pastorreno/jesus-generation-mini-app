// 242Go — Weekly Coaching Cron
// Mon 9am: Mission | Wed 9am: Check-in | Fri 9am: Debrief

import { NextRequest, NextResponse } from 'next/server';
import { runWeeklyCoaching } from '@/lib/coaching';

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const day = new Date().getDay(); // 0=Sun, 1=Mon, 3=Wed, 5=Fri
  const dayTypeMap: Record<number, 'monday_mission' | 'wednesday_checkin' | 'friday_debrief'> = {
    1: 'monday_mission',
    3: 'wednesday_checkin',
    5: 'friday_debrief',
  };

  const dayType = dayTypeMap[day];
  if (!dayType) {
    return NextResponse.json({ ok: true, message: 'Not a coaching day' });
  }

  try {
    const result = await runWeeklyCoaching(dayType);
    return NextResponse.json({ ok: true, day_type: dayType, ...result });
  } catch (err) {
    console.error('Coaching cron failed:', err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
