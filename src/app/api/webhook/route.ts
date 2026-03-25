import { NextRequest, NextResponse } from "next/server";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const APP_URL = "https://telegram-mini-app-beta-coral.vercel.app";

async function sendMessage(chat_id: number, text: string, extra?: object) {
  if (!BOT_TOKEN) {
    console.error("TELEGRAM_BOT_TOKEN is not set");
    return;
  }
  const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id, text, parse_mode: "Markdown", ...extra }),
  });
  const data = await res.json();
  if (!data.ok) {
    console.error("sendMessage failed:", JSON.stringify(data));
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const message = body?.message;
    if (!message) return NextResponse.json({ ok: true });

    const chat_id: number = message.chat.id;
    const text: string = message.text || "";
    const first_name: string = message.from?.first_name || "Leader";

    // /start command
    if (text === "/start" || text.startsWith("/start")) {
      await sendMessage(
        chat_id,
        `🌍 *Welcome to Jesus Generation, ${first_name}!*\n\nThis is your Leadership Pipeline Dashboard. Track your growth, access resources, and connect with your team.\n\nTap the button below to open your dashboard. 🔥`,
        {
          reply_markup: {
            inline_keyboard: [[
              {
                text: "🔥 Open Leadership Dashboard",
                web_app: { url: APP_URL },
              },
            ]],
          },
        }
      );
      return NextResponse.json({ ok: true });
    }

    // /dashboard command
    if (text === "/dashboard") {
      await sendMessage(
        chat_id,
        `📊 *Your Leadership Dashboard*\n\nTap below to view your pipeline scores, growth track, and focus areas.`,
        {
          reply_markup: {
            inline_keyboard: [[
              { text: "Open Dashboard", web_app: { url: APP_URL } },
            ]],
          },
        }
      );
      return NextResponse.json({ ok: true });
    }

    // /prayer command
    if (text === "/prayer") {
      await sendMessage(
        chat_id,
        `🙏 *Submit a Prayer Request*\n\nOpen your dashboard and tap the Prayer tab to submit your request to the leadership team.`,
        {
          reply_markup: {
            inline_keyboard: [[
              { text: "Open Prayer Tab", web_app: { url: `${APP_URL}?tab=prayer` } },
            ]],
          },
        }
      );
      return NextResponse.json({ ok: true });
    }

    // /resources command
    if (text === "/resources") {
      await sendMessage(
        chat_id,
        `📚 *Leadership Resources*\n\nAccess your training materials, guides, and tools inside the dashboard.`,
        {
          reply_markup: {
            inline_keyboard: [[
              { text: "Open Resources", web_app: { url: `${APP_URL}?tab=resources` } },
            ]],
          },
        }
      );
      return NextResponse.json({ ok: true });
    }

    // Any other message — acknowledge and invite them to the dashboard
    await sendMessage(
      chat_id,
      `Hi ${first_name}! 👋\n\nUse the *Open Dashboard* button below or send a command:\n/start — Open dashboard\n/prayer — Submit prayer request\n/resources — Access resources`,
      {
        reply_markup: {
          inline_keyboard: [[
            { text: "🔥 Open Dashboard", web_app: { url: APP_URL } },
          ]],
        },
      }
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    message: "Jesus Generation webhook active",
    token_set: !!BOT_TOKEN,
    token_prefix: BOT_TOKEN ? BOT_TOKEN.substring(0, 8) + "..." : "MISSING",
  });
}
