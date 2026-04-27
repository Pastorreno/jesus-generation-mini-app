import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

function validateTelegramInitData(initData: string, botToken: string) {
  const urlParams = new URLSearchParams(initData);
  const hash = urlParams.get('hash');
  if (!hash) return { ok: false, error: 'Missing hash' };

  urlParams.delete('hash');

  const dataCheckString = [...urlParams.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');

  const secretKey = crypto.createHmac('sha256', 'WebAppData').update(botToken).digest();
  const computedHash = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');

  if (computedHash !== hash) return { ok: false, error: 'Invalid signature' };

  const authDate = Number(urlParams.get('auth_date'));
  if (!authDate || Math.floor(Date.now() / 1000) - authDate > 86400) {
    return { ok: false, error: 'Init data expired' };
  }

  const userRaw = urlParams.get('user');
  const user = userRaw ? JSON.parse(userRaw) : null;
  return { ok: true, user };
}

export async function POST(req: NextRequest) {
  const { initData } = await req.json();
  if (!initData) return NextResponse.json({ error: 'Missing initData' }, { status: 400 });

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) return NextResponse.json({ error: 'Missing TELEGRAM_BOT_TOKEN' }, { status: 500 });

  const result = validateTelegramInitData(initData, botToken);
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 401 });

  return NextResponse.json({ ok: true, user: result.user });
}
