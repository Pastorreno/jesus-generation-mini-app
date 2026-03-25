// 242Go — April 1, 2026 System Launch Announcement
// Run once: npx ts-node scripts/announce-april1.ts
// OR call POST /api/broadcast from your terminal (see below)

const BROADCAST_URL = process.env.NEXT_PUBLIC_APP_URL + '/api/broadcast';
const CRON_SECRET = process.env.CRON_SECRET!;

const APRIL_1_MESSAGE = `🔥 *A New Era Begins — 242Go Launches April 1, 2026*

{name}, this message is for you personally.

Starting *April 1st*, Jesus Generation is activating a new standard for kingdom leadership.

━━━━━━━━━━━━━━━━━━━━━━━
   *THE 242GO PIPELINE*
━━━━━━━━━━━━━━━━━━━━━━━

Based on Acts 2:42–47 and the Great Commission, every partner will go through the *242Go Leadership Assessment* — a tool designed not to judge you, but to see you clearly and walk with you toward who God has called you to be.

*What this means for you:*
→ A personal AI coaching companion — your own bot
→ A leadership profile that shows your strengths
→ A growth track built specifically for you
→ A place at the table — a *Table of 4*

*This is not church as usual.*
This is the kingdom operating at a new level.

Ministry assignments, team placements, and advancement through the pipeline will all flow from this system. You don't get promoted without development. But you will *never* be left behind.

*April 1, 2026 — the pipeline goes live.*

When you receive your assessment link, treat it with the same seriousness you'd give any kingdom assignment. This is the beginning of something historic.

_— Jesus Generation Leadership_

_"And they devoted themselves to the apostles' teaching and the fellowship, to the breaking of bread and the prayers." — Acts 2:42_`;

async function announce() {
  const res = await fetch(BROADCAST_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      secret: CRON_SECRET,
      message: APRIL_1_MESSAGE,
    }),
  });
  const data = await res.json();
  console.log('Broadcast result:', data);
}

announce().catch(console.error);
