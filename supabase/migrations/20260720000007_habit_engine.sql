-- Sprint 11: Habit Engine — Daily Companion

CREATE TABLE IF NOT EXISTS habit_checkins (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  checkin_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, checkin_date)
);

CREATE TABLE IF NOT EXISTS daily_question_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_key TEXT NOT NULL,
  answer TEXT NOT NULL,
  response_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, response_date)
);

CREATE TABLE IF NOT EXISTS micro_action_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action_key TEXT NOT NULL,
  response TEXT NOT NULL CHECK (response IN ('yes', 'later')),
  response_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, action_key, response_date)
);

CREATE TABLE IF NOT EXISTS open_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  location_name TEXT NOT NULL,
  region TEXT,
  interest_slug TEXT,
  starts_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 30,
  max_participants INTEGER NOT NULL DEFAULT 6,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'full', 'closed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS open_activity_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  open_activity_id UUID NOT NULL REFERENCES open_activities(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (open_activity_id, user_id)
);

ALTER TABLE habit_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_question_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE micro_action_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE open_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE open_activity_participants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "habit_checkins_own" ON habit_checkins
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "daily_question_own" ON daily_question_responses
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "micro_action_own" ON micro_action_responses
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "open_activities_read" ON open_activities
  FOR SELECT USING (status = 'open' AND starts_at >= NOW() - INTERVAL '1 day');

CREATE POLICY "open_activities_insert" ON open_activities
  FOR INSERT WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "open_participants_own" ON open_activity_participants
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "open_participants_read" ON open_activity_participants
  FOR SELECT USING (true);

CREATE INDEX IF NOT EXISTS idx_habit_checkins_date ON habit_checkins(checkin_date);
CREATE INDEX IF NOT EXISTS idx_open_activities_starts ON open_activities(starts_at);

CREATE OR REPLACE FUNCTION get_open_activity_participant_count(activity_uuid UUID)
RETURNS INTEGER
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT COUNT(*)::INTEGER FROM open_activity_participants WHERE open_activity_id = activity_uuid;
$$;

GRANT EXECUTE ON FUNCTION get_open_activity_participant_count(UUID) TO authenticated, anon;

CREATE OR REPLACE FUNCTION get_habit_metrics()
RETURNS TABLE (
  dau BIGINT,
  question_responses_today BIGINT,
  checkins_today BIGINT,
  open_activities_today BIGINT,
  open_joins_today BIGINT
)
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT
    (SELECT COUNT(DISTINCT user_id) FROM habit_checkins WHERE checkin_date = CURRENT_DATE)::BIGINT,
    (SELECT COUNT(*) FROM daily_question_responses WHERE response_date = CURRENT_DATE)::BIGINT,
    (SELECT COUNT(*) FROM habit_checkins WHERE checkin_date = CURRENT_DATE)::BIGINT,
    (SELECT COUNT(*) FROM open_activities WHERE starts_at::date = CURRENT_DATE)::BIGINT,
    (SELECT COUNT(*) FROM open_activity_participants WHERE created_at::date = CURRENT_DATE)::BIGINT;
$$;

GRANT EXECUTE ON FUNCTION get_habit_metrics() TO authenticated;
