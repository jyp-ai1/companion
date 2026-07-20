-- Sprint 9: AI Discovery Engine — event tracking + activity proposals

CREATE TABLE IF NOT EXISTS recommendation_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('impression', 'click', 'dismiss', 'join', 'complete')),
  item_type TEXT NOT NULL CHECK (item_type IN ('feed', 'today', 'meetup', 'person', 'activity')),
  item_id TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS activity_proposals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  category meetup_category NOT NULL DEFAULT 'other',
  interest_slug TEXT,
  region TEXT,
  suggested_participants INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE recommendation_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_proposals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "recommendation_events_own" ON recommendation_events
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "activity_proposals_admin_read" ON activity_proposals
  FOR SELECT USING (is_admin());

CREATE POLICY "activity_proposals_admin_update" ON activity_proposals
  FOR UPDATE USING (is_admin());

CREATE INDEX IF NOT EXISTS idx_recommendation_events_user ON recommendation_events(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_proposals_status ON activity_proposals(status);

CREATE TRIGGER activity_proposals_updated_at
  BEFORE UPDATE ON activity_proposals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
