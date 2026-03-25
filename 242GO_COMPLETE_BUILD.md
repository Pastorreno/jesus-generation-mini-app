# 242Go Leadership Pipeline — Complete System Build
**Version 1.0 | Built March 2026 | GGI Hub / Jesus Generation Movement**

---

## What Is 242Go?

242Go is a kingdom-grade Adaptive Human Development & Profiling (AHDP) system for church leadership development. The name comes from Acts 2:42–47 (the first church model) and the Great Commission (Go). It is designed to help pastors build disciples who make disciples — treating ministry development with the same structure as corporate leadership pipelines.

**Core philosophy:** No man left behind. Everyone is assessed. Everyone is walked with. Promotion is earned through Character, Competency, and Consistency — not tenure or popularity.

---

## The Framework

### 5 Levels of Development
| Level | Name | Score | Description |
|-------|------|-------|-------------|
| 1 | Seeker | 0–35 | Just arrived. Exploring faith. Not yet committed. |
| 2 | Disciple | 36–50 | Committed. Building foundation. Needs development. |
| 3 | Servant | 51–65 | F.A.T. proven. Ready for supporting ministry roles. |
| 4 | Leader | 66–80 | C/C/C proven. Ready to lead and develop others. |
| 5 | Multiplier | 81–100 | Reproducing leaders. Kingdom-focused. Ready to send. |

### The C/C/C Scoring System (100 points total)
- **Character** — 8 questions, 32 points max
- **Competency** — 7 questions, 28 points max
- **Consistency** — 10 questions, 40 points max (heaviest weight — biggest church problem)

### F.A.T. Gate
Questions 9, 16, 22, 28 measure Faithfulness, Availability, and Teachability. If score ≤ 10/16, member is capped at Servant (Level 3) regardless of overall score.

### 4 Animal Personalities
| Animal | Type | Strength |
|--------|------|----------|
| 🦁 Lion | Bold, decisive, direct | Leadership, vision |
| 🦦 Otter | Social, enthusiastic, fun | Evangelism, outreach |
| 🐕 Golden Retriever | Loyal, empathetic, steady | Pastoral care, discipleship |
| 🦫 Beaver | Analytical, precise, systematic | Administration, teaching |

### 6 Passages (Kingdom Transitions)
1. **The Welcome** — Entry into the pipeline
2. **The Commitment** — Public declaration of discipleship
3. **The Deployment** — First ministry assignment
4. **The Commission** — Sent as a leader
5. **The Multiplication** — Developing others
6. **The Sending** — Releasing to plant or lead elsewhere

### Bot Modes
- **Care** (Level 1): Pastoral warmth, no assignments, gentle check-ins
- **Companion** (Level 2): Accountability partner, builds consistency habits
- **Coach** (Level 3+): Kingdom assignments, strategic development, multiplication focus

---

## Technical Architecture

### Stack
| Component | Technology |
|-----------|-----------|
| Frontend / API | Next.js 16 (App Router) |
| Bot Platform | Telegram Bot API |
| Mini App | Telegram Web App (TWA) |
| Database | Supabase (PostgreSQL) |
| AI Engine | Claude claude-sonnet-4-6 (Anthropic) |
| CRM Sync | Notion API |
| Hosting (cloud) | Vercel |
| Hosting (self) | Docker + Mac Mini / Mini PC |
| Tunnel (self) | Cloudflare Tunnel |
| Scheduling | Vercel Cron Jobs |

### Repository
**GitHub:** `github.com/Pastorreno/jesus-generation-mini-app`
**Branch:** `main`
**Deploy:** Auto-deploys to Vercel on push

---

## File Structure

```
telegram-mini-app/
├── src/
│   ├── app/
│   │   └── api/
│   │       ├── webhook/route.ts          ← Main Telegram bot handler
│   │       ├── broadcast/route.ts        ← Bulk message sender
│   │       └── cron/
│   │           ├── coaching/route.ts     ← Mon/Wed/Fri coaching trigger
│   │           └── regression/route.ts  ← Daily watchdog trigger
│   └── lib/
│       ├── assessment/
│       │   ├── questions.ts              ← 30-question bank + scoring maps
│       │   ├── session.ts                ← State machine (5 states)
│       │   └── scoring.ts                ← Claude scoring engine
│       ├── coaching.ts                   ← Weekly coaching + crisis detection
│       ├── regression.ts                 ← Behavioral drift detection
│       ├── notion.ts                     ← Notion CRM sync
│       ├── telegram.ts                   ← All bot message helpers
│       └── church.ts                     ← Multi-church config loader
├── scripts/
│   ├── setup-church.sh                   ← Church onboarding wizard
│   └── announce-april1.ts                ← April 1 launch broadcast
├── supabase_schema.sql                   ← Core database tables
├── supabase_schema_multichurch.sql       ← Multi-church + RLS
├── docker-compose.yml                    ← Self-hosting stack
├── Dockerfile                            ← Production container
├── vercel.json                           ← Cron job schedules
└── .env.local.example                    ← All required env vars
```

---

## Database Tables

### `assessment_sessions`
Tracks each member's in-progress assessment. State machine: `awaiting_start → in_assessment → processing → complete`. Stores all 30 answers as JSONB.

### `profiles_242go`
Permanent profile for every assessed member. Stores C/C/C scores, pillar breakdown, animal personality, level placement, flags, AI-generated narrative, bot mode, and passage history.

### `coaching_log`
Every bot interaction. Bot message sent + member's response. Behavioral signals extracted per response (-1 / 0 / +1 for consistency, character, competency).

### `regression_alerts`
Every drift flag triggered. Level (yellow / orange / red), dimension, reason, whether pastor was notified, resolution notes.

### `passage_milestones`
Permanent record of every level transition. Who approved it, score at time of passage, date.

### `churches` (multi-church)
Master registry of every church on the network. Bot token, admin IDs, hosting type, Notion config per church.

---

## The Assessment Flow

```
User sends /start
    ↓
Bot sends welcome + scripture (Acts 2:42 context)
    ↓
User confirms ready
    ↓
30 questions delivered one at a time (A/B/C/D)
Progress checkpoints at Q10 and Q20
    ↓
Answer 30 recorded → state → processing
    ↓
Claude calculates C/C/C scores + pillar breakdown
F.A.T. gate applied → level determined
Animal personality tallied
    ↓
Claude generates narrative profile (1,500 tokens)
Strengths / Growth Areas / Calling Direction / Ministry Placement / Profile Card
    ↓
Profile saved to Supabase
Profile synced to Notion CRM
    ↓
Profile card delivered in Telegram
Bot mode activated (Care / Companion / Coach)
```

---

## Weekly Coaching Cadence

| Day | Message Type | Who Gets It |
|-----|-------------|-------------|
| Monday 9am | Mission — kingdom assignment for the week | Levels 2–5 |
| Wednesday 9am | Check-in — how's the mission going? | Levels 2–5 |
| Friday 9am | Debrief — reflect on the week | Levels 2–5 |
| Wednesday 9am | Care check-in — pastoral warmth | Level 1 (Seekers) |

Every message is generated by Claude using:
- Member's full profile (scores, personality, flags)
- Last 5 coaching responses (the bot knows their history)
- Blue Letter Bible depth — original Hebrew/Greek word meanings
- Conversational scripture — never decorative, always contextual

---

## Regression Watchdog

Runs daily at 8am. Checks every Level 2+ member for:

**Silence Detection:**
- 48 hrs no response → 🟡 Yellow alert
- 96 hrs no response → 🟠 Orange alert
- 7 days no response → 🔴 Red alert

**AI Drift Analysis (Claude Haiku):**
- Reads last 10 coaching responses
- Looks for: tone changes, discouragement, spiritual drift, inconsistency
- Flags patterns, not one-off bad days

**Crisis Detection (every message):**
- Scans for crisis keywords in real-time
- Immediately stops coaching
- Sends 988 + pastor notification
- Creates Red alert in database

All alerts delivered to admin Telegram IDs instantly.

---

## Guardrails

The bot operates under 8 absolute rules that cannot be overridden:

1. **Topic lock** — Faith, discipleship, pipeline only
2. **No shame** — Low scores always get "we walk with you"
3. **No professional advice** — Medical, legal, financial, mental health → defer to pastor/professional
4. **No placement authority** — Bot can never promote or assign — senior leader confirms all placements
5. **Crisis protocol** — Danger keywords → stop coaching, send 988, alert admin immediately
6. **No impersonation** — Always identifies as the 242Go coaching system
7. **Brevity** — 5 sentences max per message
8. **Theology boundary** — Orthodox Christian faith only, no false doctrine

---

## Multi-Church / SaaS Architecture

### Cloud Deployment (Vercel)
One codebase. Multiple churches identified by `church_id` on every database table. Each church has their own Telegram bot token. Row Level Security in Supabase keeps data isolated.

### Self-Hosted Deployment (Mac Mini / Mini PC)
Each church runs their own Docker stack:
- `docker compose up -d` starts everything
- Cloudflare Tunnel gives public HTTPS with no port forwarding
- Auto-updates via Watchtower when new code is pushed
- `scripts/setup-church.sh` completes full setup in ~10 minutes

### Network View (GGI Hub)
The `network_stats` view in Supabase gives the hub-level view:
- Total members per church
- Average score per church
- Number of leaders and multipliers
- Open regression alerts

---

## Environment Variables

```bash
# Church Identity
CHURCH_ID=jesus-generation
CHURCH_NAME=Jesus Generation
PASTOR_NAME=Pastor Reno

# Telegram
TELEGRAM_BOT_TOKEN=          # From @BotFather
NEXT_PUBLIC_APP_URL=         # Vercel URL or Cloudflare tunnel URL
ADMIN_TELEGRAM_IDS=          # Comma-separated Telegram user IDs

# AI
ANTHROPIC_API_KEY=           # From console.anthropic.com

# Database
NEXT_PUBLIC_SUPABASE_URL=    # From Supabase dashboard
SUPABASE_SERVICE_ROLE_KEY=   # From Supabase dashboard

# CRM (optional)
NOTION_API_KEY=              # From notion.so/my-integrations
NOTION_DATABASE_ID=          # Jesus Generation Database ID

# Security
CRON_SECRET=                 # Random string — protects cron endpoints
CLOUDFLARE_TUNNEL_TOKEN=     # For self-hosted deployments only
```

---

## Deployment Checklist

### Cloud (Vercel) — Jesus Generation
- [ ] Push code to GitHub → Vercel auto-deploys
- [ ] Add all env vars in Vercel → Settings → Environment Variables
- [ ] Run `supabase_schema.sql` in Supabase SQL editor
- [ ] Run `supabase_schema_multichurch.sql` in Supabase SQL editor
- [ ] Register Telegram webhook: `https://api.telegram.org/bot{TOKEN}/setWebhook?url={APP_URL}/api/webhook`
- [ ] Send `/start` to bot and test full assessment flow
- [ ] Set your Telegram user ID as `ADMIN_TELEGRAM_IDS`
- [ ] Send April 1 broadcast when ready

### Self-Hosted (New Church)
- [ ] Install Docker Desktop on Mac Mini / mini PC
- [ ] Clone repo: `git clone https://github.com/Pastorreno/jesus-generation-mini-app`
- [ ] Run `bash scripts/setup-church.sh`
- [ ] Follow wizard (10 minutes)
- [ ] Confirm webhook registered
- [ ] Send `/start` to church's bot

---

## Scheduled Jobs

| Job | Schedule | What It Does |
|-----|----------|-------------|
| Coaching | Mon/Wed/Fri 9am | Sends personalized coaching messages to all active members |
| Regression | Daily 8am | Checks all Level 2+ members for silence and behavioral drift |

Both jobs are protected by `CRON_SECRET` and run automatically on Vercel's infrastructure.

---

## April 1, 2026 Launch

To broadcast the system launch announcement to all current members:

```bash
curl -X POST https://your-app-url.vercel.app/api/broadcast \
  -H "Content-Type: application/json" \
  -d '{
    "secret": "your_cron_secret",
    "message": "your message here — use {name} for personalization"
  }'
```

The pre-written announcement is in `scripts/announce-april1.ts`.

---

## The Vision: GGI Hub SaaS

242Go is built to scale across the African American church revitalization network. The roadmap:

**Phase 1 — Jesus Generation (April 2026)**
Single church deployment. Validate the system. Build the testimony.

**Phase 2 — Network Launch (Summer 2026)**
Onboard 5–10 churches from the Jesus Generation Movement network. Each self-hosts or runs cloud. GGI Hub gets the aggregate dashboard.

**Phase 3 — SaaS Portal (Fall 2026)**
Web portal for pastors. Church dashboard, member management, Table of 4 matching, coaching analytics. Monthly subscription per church.

**Phase 4 — Church Candy Integration**
Marketing layer built into the portal. Visitor follow-up bot → member pipeline → leadership pipeline. Full discipleship + growth funnel in one system.

**Phase 5 — The Agent**
Single AI agent that handles discipleship coaching, marketing, visitor follow-up, regression monitoring, and reporting. The pastor gets a daily briefing. The agent handles the rest.

---

## Built By
**GGI Hub** — AI solutions for kingdom advancement
**Founder:** Pastor Reno
**System:** 242Go AHDP v1.0
**AI Engine:** Claude claude-sonnet-4-6 (Anthropic)
**Built:** March 2026
**Contact:** @Pastorreno (Telegram)

---

*"And they devoted themselves to the apostles' teaching and the fellowship, to the breaking of bread and the prayers... And the Lord added to their number day by day those who were being saved."*
— Acts 2:42, 47
