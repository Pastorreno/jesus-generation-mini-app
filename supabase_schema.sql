-- 242Go AHDP System — Supabase Schema
-- Run this in your Supabase SQL editor

-- ─────────────────────────────────────────────
-- 1. ASSESSMENT SESSIONS
--    Tracks in-progress assessments question by question
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS assessment_sessions (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  telegram_user_id  BIGINT NOT NULL UNIQUE,
  first_name        TEXT,
  username          TEXT,
  state             TEXT NOT NULL DEFAULT 'awaiting_start',
  -- states: awaiting_start | in_assessment | processing | complete
  current_question  INT NOT NULL DEFAULT 0,
  answers           JSONB NOT NULL DEFAULT '[]',
  -- array of { q: 1, answer: "A" }
  started_at        TIMESTAMPTZ DEFAULT NOW(),
  completed_at      TIMESTAMPTZ,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- 2. 242GO PROFILES
--    Completed profiles — permanent record
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles_242go (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  telegram_user_id      BIGINT NOT NULL,
  first_name            TEXT,
  username              TEXT,

  -- Level placement
  level                 TEXT NOT NULL,
  -- seeker | disciple | servant | leader | multiplier
  level_number          INT NOT NULL,
  overall_score         INT NOT NULL,

  -- C/C/C breakdown
  character_score       INT NOT NULL,
  character_max         INT NOT NULL DEFAULT 32,
  competency_score      INT NOT NULL,
  competency_max        INT NOT NULL DEFAULT 28,
  consistency_score     INT NOT NULL,
  consistency_max       INT NOT NULL DEFAULT 40,

  -- Pillar breakdown
  pillar_word           INT,
  pillar_fellowship     INT,
  pillar_worship_prayer INT,
  pillar_fat            INT,
  pillar_stewardship    INT,

  -- Personality
  dominant_animal       TEXT,
  -- lion | otter | retriever | beaver
  secondary_animal      TEXT,

  -- Flags
  fat_gate_triggered    BOOLEAN DEFAULT FALSE,
  character_flagged     BOOLEAN DEFAULT FALSE,
  competency_flagged    BOOLEAN DEFAULT FALSE,
  consistency_flagged   BOOLEAN DEFAULT FALSE,
  regression_level      TEXT DEFAULT 'none',
  -- none | yellow | orange | red

  -- AI-generated content
  strengths             TEXT,
  growth_areas          TEXT,
  calling_direction     TEXT,
  ministry_placement    TEXT,
  profile_card          TEXT,
  -- full formatted profile card
  bot_mode              TEXT DEFAULT 'companion',
  -- coach | companion | care

  -- Passage tracking
  current_passage       INT DEFAULT 1,
  -- 1-6
  passage_history       JSONB DEFAULT '[]',

  -- Profile photo (Telegram file_id)
  avatar_file_id        TEXT,

  -- External links
  notion_page_id        TEXT,
  table_assignment      TEXT,
  mentor_assigned       TEXT,

  -- Timestamps
  assessed_at           TIMESTAMPTZ DEFAULT NOW(),
  last_reassessed_at    TIMESTAMPTZ,
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- 3. COACHING LOG
--    Every bot interaction tracked
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS coaching_log (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  telegram_user_id  BIGINT NOT NULL,
  week_number       INT NOT NULL DEFAULT 1,
  day_type          TEXT NOT NULL,
  -- monday_mission | wednesday_checkin | friday_debrief | care_checkin | response
  bot_mode          TEXT NOT NULL DEFAULT 'companion',
  message_text      TEXT,
  response_text     TEXT,
  sent_at           TIMESTAMPTZ DEFAULT NOW(),
  responded_at      TIMESTAMPTZ,
  -- Regression indicators extracted from response
  consistency_signal  INT DEFAULT 0,
  -- 0=neutral, 1=positive, -1=negative
  character_signal    INT DEFAULT 0,
  competency_signal   INT DEFAULT 0
);

-- ─────────────────────────────────────────────
-- 4. REGRESSION ALERTS
--    Behavioral tracking — the AHDP watchdog
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS regression_alerts (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  telegram_user_id  BIGINT NOT NULL,
  alert_level       TEXT NOT NULL,
  -- yellow | orange | red
  dimension         TEXT NOT NULL,
  -- consistency | character | competency | general
  trigger_reason    TEXT,
  weeks_flagged     INT DEFAULT 1,
  pastor_notified   BOOLEAN DEFAULT FALSE,
  mentor_notified   BOOLEAN DEFAULT FALSE,
  resolved          BOOLEAN DEFAULT FALSE,
  resolved_at       TIMESTAMPTZ,
  resolved_notes    TEXT,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- 5. PASSAGE MILESTONES
--    Permanent record of each passage transition
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS passage_milestones (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  telegram_user_id  BIGINT NOT NULL,
  passage_number    INT NOT NULL,
  -- 1-6
  passage_name      TEXT NOT NULL,
  -- The Welcome | The Commitment | The Deployment | etc.
  from_level        TEXT,
  to_level          TEXT,
  approved_by       TEXT,
  -- senior leader name
  score_at_passage  INT,
  notes             TEXT,
  achieved_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- INDEXES
-- ─────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_sessions_user    ON assessment_sessions(telegram_user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_user    ON profiles_242go(telegram_user_id);
CREATE INDEX IF NOT EXISTS idx_coaching_user    ON coaching_log(telegram_user_id);
CREATE INDEX IF NOT EXISTS idx_regression_user  ON regression_alerts(telegram_user_id);
CREATE INDEX IF NOT EXISTS idx_passages_user    ON passage_milestones(telegram_user_id);
CREATE INDEX IF NOT EXISTS idx_regression_open  ON regression_alerts(resolved) WHERE resolved = FALSE;

-- ─────────────────────────────────────────────
-- AUTO-UPDATE updated_at
-- ─────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_sessions_updated
  BEFORE UPDATE ON assessment_sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_profiles_updated
  BEFORE UPDATE ON profiles_242go
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
