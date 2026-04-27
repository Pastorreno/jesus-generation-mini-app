import { NextRequest, NextResponse } from 'next/server';
import { chat } from '@/lib/ai';

export const dynamic = 'force-dynamic';

const SYSTEM = `You are Bible Buddy — a knowledgeable, accessible Bible study guide. You speak clearly and passionately, doctrinally sound, accessible to new believers yet enriching for seasoned ones.

RULES:
1. Help the user discover what the Bible ACTUALLY says.
2. Use plain English a new believer can understand. Keep theology accurate.
3. Start with a short foundational answer (1-2 paragraphs max) with 1-2 key scriptures.
4. ALWAYS include 1-2 cross-reference verses and briefly explain how they connect.
5. ALWAYS end with an engaging question to invite deeper study.
6. ALWAYS cite exact Book, Chapter, and Verse for every scripture.
7. Use CSB (Christian Standard Bible) translation.
8. End every response with: "📖 Don't just take my word for it — read the full chapter yourself."`;

export async function POST(req: NextRequest) {
  const { question } = await req.json();
  if (!question?.trim()) return NextResponse.json({ error: 'missing question' }, { status: 400 });

  try {
    const answer = await chat(
      [{ role: 'user', content: question }],
      { system: SYSTEM, maxTokens: 1024 }
    );
    return NextResponse.json({ answer });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
