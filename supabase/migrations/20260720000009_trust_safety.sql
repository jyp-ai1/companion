-- EPIC 14: Trust & Safety

ALTER TABLE user_profiles
  ADD COLUMN IF NOT EXISTS safe_guide_seen_at TIMESTAMPTZ;

ALTER TABLE reviews
  ADD COLUMN IF NOT EXISTS satisfaction TEXT CHECK (satisfaction IN ('happy', 'ok', 'sad')),
  ADD COLUMN IF NOT EXISTS again_choice TEXT CHECK (again_choice IN ('yes', 'ok', 'later'));

ALTER TABLE reviews ALTER COLUMN rating DROP NOT NULL;

CREATE TABLE IF NOT EXISTS open_activity_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  open_activity_id UUID NOT NULL REFERENCES open_activities(id) ON DELETE CASCADE,
  satisfaction TEXT NOT NULL CHECK (satisfaction IN ('happy', 'ok', 'sad')),
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, open_activity_id)
);

CREATE TABLE IF NOT EXISTS again_together (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  peer_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  source_type TEXT NOT NULL CHECK (source_type IN ('meetup', 'open_activity')),
  source_id UUID NOT NULL,
  choice TEXT NOT NULL CHECK (choice IN ('yes', 'ok', 'later')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, peer_user_id, source_type, source_id)
);

CREATE TABLE IF NOT EXISTS user_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reporter_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reported_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reason TEXT NOT NULL CHECK (reason IN ('no_show', 'uncomfortable', 'spam', 'other')),
  detail TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'dismissed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_blocks (
  blocker_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  blocked_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (blocker_id, blocked_user_id),
  CHECK (blocker_id != blocked_user_id)
);

ALTER TABLE open_activity_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE again_together ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_blocks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "open_activity_reviews_own" ON open_activity_reviews
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "again_together_own" ON again_together
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_reports_insert" ON user_reports
  FOR INSERT WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "user_reports_own_read" ON user_reports
  FOR SELECT USING (auth.uid() = reporter_id);

CREATE POLICY "user_reports_admin" ON user_reports
  FOR ALL USING (is_admin());

CREATE POLICY "user_blocks_own" ON user_blocks
  FOR ALL USING (auth.uid() = blocker_id) WITH CHECK (auth.uid() = blocker_id);

CREATE INDEX IF NOT EXISTS idx_again_together_peer ON again_together(peer_user_id, choice);
CREATE INDEX IF NOT EXISTS idx_user_reports_status ON user_reports(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_blocks_blocked ON user_blocks(blocked_user_id);

-- Exclude blocked users from matching
CREATE OR REPLACE FUNCTION get_matchable_profiles()
RETURNS TABLE (
  id UUID,
  display_name TEXT,
  age_group TEXT,
  region TEXT,
  activity_score NUMERIC,
  relationship_score NUMERIC,
  ieum_code TEXT,
  dna_title TEXT,
  interest_slugs TEXT[],
  created_at TIMESTAMPTZ
)
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT
    p.id,
    p.display_name,
    p.age_group,
    p.region,
    p.activity_score,
    p.relationship_score,
    p.ieum_code,
    p.dna_title,
    COALESCE(
      ARRAY_AGG(ui.interest_slug ORDER BY ui.interest_slug) FILTER (WHERE ui.interest_slug IS NOT NULL),
      '{}'::TEXT[]
    ) AS interest_slugs,
    p.created_at
  FROM user_profiles p
  LEFT JOIN user_interests ui ON ui.user_id = p.id
  WHERE p.id != auth.uid()
    AND p.test_completed_at IS NOT NULL
    AND p.onboarding_completed = TRUE
    AND NOT EXISTS (
      SELECT 1 FROM user_blocks b
      WHERE (b.blocker_id = auth.uid() AND b.blocked_user_id = p.id)
         OR (b.blocked_user_id = auth.uid() AND b.blocker_id = p.id)
    )
  GROUP BY p.id, p.display_name, p.age_group, p.region,
           p.activity_score, p.relationship_score, p.ieum_code, p.dna_title, p.created_at;
$$;

-- Exclude blocked peers from Together
CREATE OR REPLACE FUNCTION get_together_connections()
RETURNS TABLE (
  peer_id UUID,
  display_name TEXT,
  age_group TEXT,
  meet_count BIGINT,
  first_met_at TIMESTAMPTZ,
  last_met_at TIMESTAMPTZ,
  last_activity TEXT,
  last_category meetup_category
)
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT
    p2.user_id AS peer_id,
    up.display_name,
    up.age_group,
    COUNT(DISTINCT p1.meetup_id) AS meet_count,
    MIN(COALESCE(m.scheduled_at, p1.created_at)) AS first_met_at,
    MAX(COALESCE(m.scheduled_at, p1.created_at)) AS last_met_at,
    (
      SELECT m2.title
      FROM participations px
      JOIN participations py ON px.meetup_id = py.meetup_id
      JOIN meetups m2 ON m2.id = px.meetup_id
      WHERE px.user_id = auth.uid()
        AND py.user_id = p2.user_id
        AND px.status IN ('confirmed', 'completed')
        AND py.status IN ('confirmed', 'completed')
      ORDER BY COALESCE(m2.scheduled_at, px.created_at) DESC
      LIMIT 1
    ) AS last_activity,
    (
      SELECT m2.category
      FROM participations px
      JOIN participations py ON px.meetup_id = py.meetup_id
      JOIN meetups m2 ON m2.id = px.meetup_id
      WHERE px.user_id = auth.uid()
        AND py.user_id = p2.user_id
        AND px.status IN ('confirmed', 'completed')
        AND py.status IN ('confirmed', 'completed')
      ORDER BY COALESCE(m2.scheduled_at, px.created_at) DESC
      LIMIT 1
    ) AS last_category
  FROM participations p1
  JOIN participations p2
    ON p1.meetup_id = p2.meetup_id AND p1.user_id != p2.user_id
  JOIN user_profiles up ON up.id = p2.user_id
  LEFT JOIN meetups m ON m.id = p1.meetup_id
  WHERE p1.user_id = auth.uid()
    AND p1.status IN ('confirmed', 'completed')
    AND p2.status IN ('confirmed', 'completed')
    AND NOT EXISTS (
      SELECT 1 FROM user_blocks b
      WHERE (b.blocker_id = auth.uid() AND b.blocked_user_id = p2.user_id)
         OR (b.blocked_user_id = auth.uid() AND b.blocker_id = p2.user_id)
    )
  GROUP BY p2.user_id, up.display_name, up.age_group
  ORDER BY meet_count DESC, last_met_at DESC;
$$;

CREATE OR REPLACE FUNCTION get_trust_metrics()
RETURNS TABLE (
  activity_completion_rate NUMERIC,
  review_write_rate NUMERIC,
  again_yes_rate NUMERIC,
  report_rate NUMERIC,
  block_rate NUMERIC,
  happy_rate NUMERIC,
  pending_reports BIGINT
)
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  WITH parts AS (
    SELECT COUNT(*) FILTER (WHERE status = 'completed') AS completed,
           COUNT(*) FILTER (WHERE status IN ('confirmed', 'completed')) AS total
    FROM participations
  ),
  rev AS (
    SELECT COUNT(*) AS review_count FROM reviews
  ),
  rev_eligible AS (
    SELECT COUNT(*) AS eligible
    FROM participations
    WHERE status = 'completed'
  ),
  again AS (
    SELECT COUNT(*) FILTER (WHERE choice = 'yes') AS yes_count,
           COUNT(*) AS total
    FROM again_together
  ),
  reps AS (
    SELECT COUNT(*) AS report_count FROM user_reports
  ),
  blks AS (
    SELECT COUNT(*) AS block_count FROM user_blocks
  ),
  users AS (
    SELECT COUNT(*) AS user_count FROM user_profiles
  ),
  happy AS (
    SELECT COUNT(*) FILTER (WHERE satisfaction = 'happy') AS happy,
           COUNT(*) FILTER (WHERE satisfaction IS NOT NULL) AS total
    FROM (
      SELECT satisfaction FROM reviews WHERE satisfaction IS NOT NULL
      UNION ALL
      SELECT satisfaction FROM open_activity_reviews
    ) s
  )
  SELECT
    CASE WHEN (SELECT total FROM parts) > 0
      THEN ROUND((SELECT completed FROM parts)::NUMERIC / (SELECT total FROM parts) * 100, 1)
      ELSE 0 END,
    CASE WHEN (SELECT eligible FROM rev_eligible) > 0
      THEN ROUND((SELECT review_count FROM rev)::NUMERIC / (SELECT eligible FROM rev_eligible) * 100, 1)
      ELSE 0 END,
    CASE WHEN (SELECT total FROM again) > 0
      THEN ROUND((SELECT yes_count FROM again)::NUMERIC / (SELECT total FROM again) * 100, 1)
      ELSE 0 END,
    CASE WHEN (SELECT user_count FROM users) > 0
      THEN ROUND((SELECT report_count FROM reps)::NUMERIC / (SELECT user_count FROM users) * 100, 2)
      ELSE 0 END,
    CASE WHEN (SELECT user_count FROM users) > 0
      THEN ROUND((SELECT block_count FROM blks)::NUMERIC / (SELECT user_count FROM users) * 100, 2)
      ELSE 0 END,
    CASE WHEN (SELECT total FROM happy) > 0
      THEN ROUND((SELECT happy FROM happy)::NUMERIC / (SELECT total FROM happy) * 100, 1)
      ELSE 0 END,
    (SELECT COUNT(*) FROM user_reports WHERE status = 'pending')::BIGINT;
$$;

GRANT EXECUTE ON FUNCTION get_trust_metrics() TO authenticated;

CREATE OR REPLACE FUNCTION get_meetup_co_participants(meetup_uuid UUID)
RETURNS TABLE (
  user_id UUID,
  display_name TEXT,
  age_group TEXT
)
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT p.id, p.display_name, p.age_group
  FROM participations part
  JOIN user_profiles p ON p.id = part.user_id
  WHERE part.meetup_id = meetup_uuid
    AND part.user_id != auth.uid()
    AND part.status IN ('confirmed', 'completed')
    AND NOT EXISTS (
      SELECT 1 FROM user_blocks b
      WHERE (b.blocker_id = auth.uid() AND b.blocked_user_id = p.id)
         OR (b.blocked_user_id = auth.uid() AND b.blocker_id = p.id)
    );
$$;

GRANT EXECUTE ON FUNCTION get_meetup_co_participants(UUID) TO authenticated;

CREATE OR REPLACE FUNCTION get_open_activity_co_participants(activity_uuid UUID)
RETURNS TABLE (
  user_id UUID,
  display_name TEXT,
  age_group TEXT
)
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT p.id, p.display_name, p.age_group
  FROM open_activity_participants oap
  JOIN user_profiles p ON p.id = oap.user_id
  WHERE oap.open_activity_id = activity_uuid
    AND oap.user_id != auth.uid()
    AND NOT EXISTS (
      SELECT 1 FROM user_blocks b
      WHERE (b.blocker_id = auth.uid() AND b.blocked_user_id = p.id)
         OR (b.blocked_user_id = auth.uid() AND b.blocker_id = p.id)
    );
$$;

GRANT EXECUTE ON FUNCTION get_open_activity_co_participants(UUID) TO authenticated;
