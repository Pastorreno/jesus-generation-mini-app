-- 242Go AHDP — Multi-Church Schema
-- Run this in ADDITION to supabase_schema.sql for multi-church deployments
-- Each church gets full data isolation via church_id on every table

-- ─────────────────────────────────────────────
-- 0. CHURCHES
--    Master registry of every church on the network
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS churches (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  church_id           TEXT NOT NULL UNIQUE,
  -- slug: e.g. "jesus-generation", "hope-church-atl"

  -- Identity
  name                TEXT NOT NULL,
  pastor_name         TEXT,
  city                TEXT,
  state               TEXT,
  denomination        TEXT,

  -- Telegram
  bot_token           TEXT,
  -- each church has their own @bot
  bot_username        TEXT,
  admin_telegram_ids  TEXT,
  -- comma-separated Telegram user IDs

  -- Deployment
  app_url             TEXT,
  -- their deployed URL or local tunnel
  hosting_type        TEXT DEFAULT 'cloud',
  -- cloud | mac_mini | mini_pc

  -- Notion CRM (optional per church)
  notion_api_key      TEXT,
  notion_database_id  TEXT,

  -- Network
  network_id          TEXT DEFAULT 'jgm',
  -- Jesus Generation Movement network
  joined_at           TIMESTAMPTZ DEFAULT NOW(),
  active              BOOLEAN DEFAULT TRUE,

  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- ADD church_id to all existing tables
-- Run these ALTER statements on your existing DB
-- ─────────────────────────────────────────────
ALTER TABLE assessment_sessions  ADD COLUMN IF NOT EXISTS church_id TEXT DEFAULT 'jesus-generation';
ALTER TABLE profiles_242go        ADD COLUMN IF NOT EXISTS church_id TEXT DEFAULT 'jesus-generation';
ALTER TABLE coaching_log          ADD COLUMN IF NOT EXISTS church_id TEXT DEFAULT 'jesus-generation';
ALTER TABLE regression_alerts     ADD COLUMN IF NOT EXISTS church_id TEXT DEFAULT 'jesus-generation';
ALTER TABLE passage_milestones    ADD COLUMN IF NOT EXISTS church_id TEXT DEFAULT 'jesus-generation';

-- ─────────────────────────────────────────────
-- INDEXES for multi-church queries
-- ─────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_sessions_church   ON assessment_sessions(church_id);
CREATE INDEX IF NOT EXISTS idx_profiles_church   ON profiles_242go(church_id);
CREATE INDEX IF NOT EXISTS idx_coaching_church   ON coaching_log(church_id);
CREATE INDEX IF NOT EXISTS idx_regression_church ON regression_alerts(church_id);
CREATE INDEX IF NOT EXISTS idx_passages_church   ON passage_milestones(church_id);
CREATE INDEX IF NOT EXISTS idx_churches_network  ON churches(network_id);

-- ─────────────────────────────────────────────
-- ROW LEVEL SECURITY (RLS)
-- Ensures each church can only see their own data
-- ─────────────────────────────────────────────

-- Enable RLS on all tables
ALTER TABLE assessment_sessions  ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles_242go        ENABLE ROW LEVEL SECURITY;
ALTER TABLE coaching_log          ENABLE ROW LEVEL SECURITY;
ALTER TABLE regression_alerts     ENABLE ROW LEVEL SECURITY;
ALTER TABLE passage_milestones    ENABLE ROW LEVEL SECURITY;

-- Service role bypasses RLS (used by the app)
-- Anon/authenticated roles are restricted by church_id
-- (Policies added per-church when they onboard)

-- ─────────────────────────────────────────────
-- NETWORK STATS VIEW
--    GGI Hub can see aggregate health across all churches
-- ─────────────────────────────────────────────
CREATE OR REPLACE VIEW network_stats AS
SELECT
  c.church_id,
  c.name AS church_name,
  c.city,
  c.state,
  COUNT(DISTINCT p.telegram_user_id) AS total_members,
  AVG(p.overall_score)::INT AS avg_score,
  COUNT(DISTINCT p.telegram_user_id) FILTER (WHERE p.level_number >= 4) AS leaders,
  COUNT(DISTINCT p.telegram_user_id) FILTER (WHERE p.level_number = 5) AS multipliers,
  COUNT(DISTINCT r.id) FILTER (WHERE r.resolved = FALSE) AS open_alerts
FROM churches c
LEFT JOIN profiles_242go p ON p.church_id = c.church_id
LEFT JOIN regression_alerts r ON r.church_id = c.church_id
WHERE c.active = TRUE
GROUP BY c.church_id, c.name, c.city, c.state;

-- ─────────────────────────────────────────────
-- SEED: Jesus Generation (founding church)
-- ─────────────────────────────────────────────
INSERT INTO churches (church_id, name, pastor_name, city, state, hosting_type, network_id)
VALUES ('jesus-generation', 'Jesus Generation', 'Pastor Reno', 'Atlanta', 'GA', 'cloud', 'jgm')
ON CONFLICT (church_id) DO NOTHING;
