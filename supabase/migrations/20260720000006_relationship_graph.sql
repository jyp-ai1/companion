-- Sprint 10: Connection Graph / Life Graph

CREATE TABLE IF NOT EXISTS relationships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  peer_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'met' CHECK (status IN ('met', 'regular', 'friend')),
  meet_count INTEGER NOT NULL DEFAULT 0,
  first_met_at TIMESTAMPTZ,
  last_met_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, peer_user_id)
);

CREATE TABLE IF NOT EXISTS relationship_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  peer_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('first_meet', 'activity', 'milestone')),
  activity_label TEXT,
  meetup_id UUID REFERENCES meetups(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE relationship_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "relationships_own" ON relationships
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "relationship_events_own" ON relationship_events
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_relationships_user ON relationships(user_id);
CREATE INDEX IF NOT EXISTS idx_relationship_events_user ON relationship_events(user_id, created_at DESC);

CREATE TRIGGER relationships_updated_at
  BEFORE UPDATE ON relationships
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Co-participation connections (same meetup)
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
  GROUP BY p2.user_id, up.display_name, up.age_group
  ORDER BY meet_count DESC, last_met_at DESC;
$$;

GRANT EXECUTE ON FUNCTION get_together_connections() TO authenticated;

-- Shared activity timeline with a peer
CREATE OR REPLACE FUNCTION get_relationship_timeline(peer_uuid UUID)
RETURNS TABLE (
  meetup_id UUID,
  title TEXT,
  category meetup_category,
  activity_at TIMESTAMPTZ
)
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT
    m.id AS meetup_id,
    m.title,
    m.category,
    COALESCE(m.scheduled_at, p1.created_at) AS activity_at
  FROM participations p1
  JOIN participations p2 ON p1.meetup_id = p2.meetup_id
  JOIN meetups m ON m.id = p1.meetup_id
  WHERE p1.user_id = auth.uid()
    AND p2.user_id = peer_uuid
    AND p1.status IN ('confirmed', 'completed')
    AND p2.status IN ('confirmed', 'completed')
  ORDER BY activity_at ASC;
$$;

GRANT EXECUTE ON FUNCTION get_relationship_timeline(UUID) TO authenticated;

-- Monthly together stats
CREATE OR REPLACE FUNCTION get_together_monthly_stats()
RETURNS TABLE (
  people_count BIGINT,
  activity_count BIGINT,
  new_people BIGINT
)
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  WITH peers AS (
    SELECT DISTINCT p2.user_id, MIN(p1.created_at) AS first_together
    FROM participations p1
    JOIN participations p2 ON p1.meetup_id = p2.meetup_id AND p1.user_id != p2.user_id
    WHERE p1.user_id = auth.uid()
      AND p1.status IN ('confirmed', 'completed')
      AND p2.status IN ('confirmed', 'completed')
      AND p1.created_at >= date_trunc('month', CURRENT_DATE)
    GROUP BY p2.user_id
  ),
  acts AS (
    SELECT COUNT(*) AS cnt
    FROM participations
    WHERE user_id = auth.uid()
      AND status IN ('confirmed', 'completed')
      AND created_at >= date_trunc('month', CURRENT_DATE)
  )
  SELECT
    (SELECT COUNT(*) FROM peers)::BIGINT,
    (SELECT cnt FROM acts)::BIGINT,
    (SELECT COUNT(*) FROM peers WHERE first_together >= date_trunc('month', CURRENT_DATE))::BIGINT;
$$;

GRANT EXECUTE ON FUNCTION get_together_monthly_stats() TO authenticated;
