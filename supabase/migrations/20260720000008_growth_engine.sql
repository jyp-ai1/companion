-- Sprint 12: Growth Engine — invitations, anonymous, viral loop

ALTER TABLE open_activities
  ADD COLUMN IF NOT EXISTS invitation_message TEXT,
  ADD COLUMN IF NOT EXISTS is_anonymous BOOLEAN NOT NULL DEFAULT TRUE;

CREATE TABLE IF NOT EXISTS invite_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT NOT NULL UNIQUE,
  inviter_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  interest_slug TEXT,
  message TEXT NOT NULL,
  use_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS profile_reveals (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  peer_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_consented BOOLEAN NOT NULL DEFAULT FALSE,
  peer_consented BOOLEAN NOT NULL DEFAULT FALSE,
  revealed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, peer_user_id)
);

CREATE TABLE IF NOT EXISTS growth_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL CHECK (event_type IN (
    'invite_created', 'invite_accepted', 'invite_shared',
    'referral_signup', 'first_activity', 'activity_join',
    'profile_reveal', 'viral_loop_complete'
  )),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE invite_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_reveals ENABLE ROW LEVEL SECURITY;
ALTER TABLE growth_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "invite_links_own" ON invite_links
  FOR ALL USING (auth.uid() = inviter_id) WITH CHECK (auth.uid() = inviter_id);

CREATE POLICY "invite_links_read_by_code" ON invite_links
  FOR SELECT USING (true);

CREATE POLICY "profile_reveals_own" ON profile_reveals
  FOR ALL USING (auth.uid() = user_id OR auth.uid() = peer_user_id)
  WITH CHECK (auth.uid() = user_id OR auth.uid() = peer_user_id);

CREATE POLICY "growth_events_insert" ON growth_events
  FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "growth_events_admin_read" ON growth_events
  FOR SELECT USING (is_admin());

CREATE INDEX IF NOT EXISTS idx_growth_events_type ON growth_events(event_type, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_invite_links_code ON invite_links(code);

CREATE OR REPLACE FUNCTION get_growth_metrics()
RETURNS TABLE (
  invites_created BIGINT,
  invite_joins BIGINT,
  invite_links_shared BIGINT,
  referral_signups BIGINT,
  first_activities BIGINT
)
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT
    (SELECT COUNT(*) FROM growth_events WHERE event_type = 'invite_created' AND created_at >= CURRENT_DATE)::BIGINT,
    (SELECT COUNT(*) FROM growth_events WHERE event_type = 'invite_accepted' AND created_at >= CURRENT_DATE)::BIGINT,
    (SELECT COUNT(*) FROM growth_events WHERE event_type = 'invite_shared' AND created_at >= CURRENT_DATE)::BIGINT,
    (SELECT COUNT(*) FROM growth_events WHERE event_type = 'referral_signup' AND created_at >= CURRENT_DATE)::BIGINT,
    (SELECT COUNT(*) FROM growth_events WHERE event_type = 'first_activity' AND created_at >= CURRENT_DATE)::BIGINT;
$$;

GRANT EXECUTE ON FUNCTION get_growth_metrics() TO authenticated;

CREATE OR REPLACE FUNCTION get_anonymous_profile(target_user UUID)
RETURNS TABLE (
  age_group TEXT,
  region TEXT,
  interest_slugs TEXT[]
)
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT
    p.age_group,
    p.region,
    COALESCE(
      ARRAY_AGG(ui.interest_slug ORDER BY ui.interest_slug) FILTER (WHERE ui.interest_slug IS NOT NULL),
      '{}'::TEXT[]
    )
  FROM user_profiles p
  LEFT JOIN user_interests ui ON ui.user_id = p.id
  WHERE p.id = target_user
  GROUP BY p.id, p.age_group, p.region;
$$;

GRANT EXECUTE ON FUNCTION get_anonymous_profile(UUID) TO authenticated;
