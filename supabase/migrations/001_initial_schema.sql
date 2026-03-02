-- School Portal: News, Events, Polls, Announcements
-- Run this in Supabase SQL Editor: https://app.supabase.com → SQL Editor

-- News
CREATE TABLE IF NOT EXISTS news (
  id BIGSERIAL PRIMARY KEY,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image TEXT DEFAULT '',
  status TEXT NOT NULL CHECK (status IN ('Опубликовано', 'Черновик')),
  date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  author TEXT NOT NULL DEFAULT 'Админ',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Events
CREATE TABLE IF NOT EXISTS events (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('school', 'olympiad')),
  subject TEXT,
  date TEXT NOT NULL,
  time TEXT,
  location TEXT,
  description TEXT,
  image TEXT,
  status TEXT NOT NULL CHECK (status IN ('Активно', 'Завершено', 'Отменено')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Polls (options stored as JSONB)
CREATE TABLE IF NOT EXISTS polls (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  options JSONB NOT NULL DEFAULT '[]',
  status TEXT NOT NULL CHECK (status IN ('Активен', 'Завершен')),
  deadline TEXT NOT NULL,
  total_votes INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Announcements
CREATE TABLE IF NOT EXISTS announcements (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('info', 'warning', 'event')),
  date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "from" TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Poll votes (to prevent duplicate votes per user)
CREATE TABLE IF NOT EXISTS poll_votes (
  id BIGSERIAL PRIMARY KEY,
  poll_id BIGINT NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  option_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(poll_id, user_id)
);

-- Enable RLS
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE poll_votes ENABLE ROW LEVEL SECURITY;

-- Policies: allow public read, allow all for write (anon + authenticated)
-- You can tighten these later for admin-only writes

CREATE POLICY "news_select" ON news FOR SELECT USING (true);
CREATE POLICY "news_insert" ON news FOR INSERT WITH CHECK (true);
CREATE POLICY "news_update" ON news FOR UPDATE USING (true);
CREATE POLICY "news_delete" ON news FOR DELETE USING (true);

CREATE POLICY "events_select" ON events FOR SELECT USING (true);
CREATE POLICY "events_insert" ON events FOR INSERT WITH CHECK (true);
CREATE POLICY "events_update" ON events FOR UPDATE USING (true);
CREATE POLICY "events_delete" ON events FOR DELETE USING (true);

CREATE POLICY "polls_select" ON polls FOR SELECT USING (true);
CREATE POLICY "polls_insert" ON polls FOR INSERT WITH CHECK (true);
CREATE POLICY "polls_update" ON polls FOR UPDATE USING (true);
CREATE POLICY "polls_delete" ON polls FOR DELETE USING (true);

CREATE POLICY "announcements_select" ON announcements FOR SELECT USING (true);
CREATE POLICY "announcements_insert" ON announcements FOR INSERT WITH CHECK (true);
CREATE POLICY "announcements_update" ON announcements FOR UPDATE USING (true);
CREATE POLICY "announcements_delete" ON announcements FOR DELETE USING (true);

CREATE POLICY "poll_votes_select" ON poll_votes FOR SELECT USING (true);
CREATE POLICY "poll_votes_insert" ON poll_votes FOR INSERT WITH CHECK (true);

-- Enable Realtime for live updates across devices
ALTER PUBLICATION supabase_realtime ADD TABLE news;
ALTER PUBLICATION supabase_realtime ADD TABLE events;
ALTER PUBLICATION supabase_realtime ADD TABLE polls;
ALTER PUBLICATION supabase_realtime ADD TABLE announcements;
