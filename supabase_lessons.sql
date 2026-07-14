-- ETS Academy Lessons
-- Run in Supabase SQL editor

CREATE TABLE IF NOT EXISTS lessons (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  series        TEXT NOT NULL DEFAULT 'General',
  title         TEXT NOT NULL,
  lesson_number INT,
  file_id       TEXT NOT NULL,        -- Telegram file_id for the PDF
  file_name     TEXT,
  posted_by     BIGINT,               -- admin telegram_user_id
  channel_message_id INT,             -- message_id in ETS channel
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_lessons_series ON lessons(series);
CREATE INDEX IF NOT EXISTS idx_lessons_created ON lessons(created_at DESC);
