-- Sprint 1~6: 추가 필드, reviews, admin, RPC

ALTER TABLE user_profiles
  ADD COLUMN IF NOT EXISTS phone TEXT,
  ADD COLUMN IF NOT EXISTS age_group TEXT,
  ADD COLUMN IF NOT EXISTS gender TEXT,
  ADD COLUMN IF NOT EXISTS available_time TEXT,
  ADD COLUMN IF NOT EXISTS is_admin BOOLEAN NOT NULL DEFAULT FALSE;

CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  meetup_id UUID NOT NULL REFERENCES meetups(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  met_new_people BOOLEAN,
  retry_intention BOOLEAN,
  next_activity TEXT,
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, meetup_id)
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "reviews_select_own" ON reviews FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "reviews_insert_own" ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "reviews_update_own" ON reviews FOR UPDATE USING (auth.uid() = user_id);

-- 참여자 수 조회 (공개)
CREATE OR REPLACE FUNCTION get_meetup_participant_count(meetup_uuid UUID)
RETURNS INTEGER
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COUNT(*)::INTEGER
  FROM participations
  WHERE meetup_id = meetup_uuid
    AND status IN ('confirmed', 'completed');
$$;

GRANT EXECUTE ON FUNCTION get_meetup_participant_count(UUID) TO authenticated, anon;

-- 모임 참여자 프로필 (이름/연령대만)
CREATE OR REPLACE FUNCTION get_meetup_participants(meetup_uuid UUID)
RETURNS TABLE (
  display_name TEXT,
  age_group TEXT
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT p.display_name, p.age_group
  FROM participations part
  JOIN user_profiles p ON p.id = part.user_id
  WHERE part.meetup_id = meetup_uuid
    AND part.status IN ('confirmed', 'completed');
$$;

GRANT EXECUTE ON FUNCTION get_meetup_participants(UUID) TO authenticated, anon;

-- Admin helper (RLS recursion 방지)
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT is_admin FROM user_profiles WHERE id = auth.uid()),
    false
  );
$$;

GRANT EXECUTE ON FUNCTION is_admin() TO authenticated;

-- Admin policies
DROP POLICY IF EXISTS "user_profiles_admin_read" ON user_profiles;
CREATE POLICY "user_profiles_admin_read" ON user_profiles
  FOR SELECT USING (is_admin());

DROP POLICY IF EXISTS "participations_admin_read" ON participations;
CREATE POLICY "participations_admin_read" ON participations
  FOR SELECT USING (is_admin());

DROP POLICY IF EXISTS "reviews_admin_read" ON reviews;
CREATE POLICY "reviews_admin_read" ON reviews
  FOR SELECT USING (is_admin());

DROP POLICY IF EXISTS "meetups_admin_all" ON meetups;
CREATE POLICY "meetups_admin_all" ON meetups
  FOR ALL USING (is_admin());

-- 다른 참여자 participations 조회 (같은 모임)
CREATE POLICY "participations_select_same_meetup" ON participations
  FOR SELECT USING (
    meetup_id IN (
      SELECT meetup_id FROM participations
      WHERE user_id = auth.uid() AND status IN ('confirmed', 'completed', 'pending')
    )
  );
