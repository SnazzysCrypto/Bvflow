CREATE TABLE IF NOT EXISTS funnels (
  id           TEXT PRIMARY KEY,
  slug         TEXT UNIQUE NOT NULL,
  title        TEXT NOT NULL,
  description  TEXT NOT NULL DEFAULT '',
  status       TEXT NOT NULL DEFAULT 'draft',
  funnel_json  TEXT NOT NULL,
  created_at   TEXT NOT NULL,
  updated_at   TEXT NOT NULL,
  published_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_funnels_status ON funnels(status);
CREATE INDEX IF NOT EXISTS idx_funnels_slug ON funnels(slug);

CREATE TABLE IF NOT EXISTS submissions (
  id            TEXT PRIMARY KEY,
  funnel_id     TEXT NOT NULL,
  funnel_slug   TEXT NOT NULL,
  started_at    TEXT NOT NULL,
  completed_at  TEXT,
  data_json     TEXT NOT NULL,
  last_step     INTEGER NOT NULL DEFAULT 0,
  total_steps   INTEGER NOT NULL DEFAULT 1,
  is_complete   INTEGER NOT NULL DEFAULT 0,
  metadata_json TEXT NOT NULL DEFAULT '{}',
  status        TEXT NOT NULL DEFAULT 'new',
  FOREIGN KEY (funnel_id) REFERENCES funnels(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_submissions_funnel ON submissions(funnel_id);
CREATE INDEX IF NOT EXISTS idx_submissions_started ON submissions(started_at);

CREATE TABLE IF NOT EXISTS analytics_events (
  id            TEXT PRIMARY KEY,
  funnel_id     TEXT NOT NULL,
  funnel_slug   TEXT NOT NULL,
  session_id    TEXT NOT NULL,
  event_type    TEXT NOT NULL,
  step_index    INTEGER,
  step_id       TEXT,
  occurred_at   TEXT NOT NULL,
  metadata_json TEXT NOT NULL DEFAULT '{}',
  FOREIGN KEY (funnel_id) REFERENCES funnels(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_analytics_funnel ON analytics_events(funnel_id);
CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_session ON analytics_events(session_id);
