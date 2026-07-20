-- Product Pivot: Interest DNA (이음 코드) + Similarity Engine

CREATE TABLE IF NOT EXISTS interest_tags (
  slug TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  emoji TEXT NOT NULL DEFAULT '✨',
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS user_interests (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  interest_slug TEXT NOT NULL REFERENCES interest_tags(slug) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, interest_slug)
);

ALTER TABLE user_profiles
  ADD COLUMN IF NOT EXISTS ieum_code TEXT,
  ADD COLUMN IF NOT EXISTS dna_title TEXT;

-- Seed interest tags (24)
INSERT INTO interest_tags (slug, label, emoji, sort_order) VALUES
  ('coffee', '커피', '☕', 1),
  ('walk', '걷기', '🚶', 2),
  ('travel', '여행', '🚌', 3),
  ('pet', '반려동물', '🐾', 4),
  ('movie', '영화', '🎬', 5),
  ('photo', '사진', '📷', 6),
  ('health', '건강', '💪', 7),
  ('volunteer', '봉사', '🤝', 8),
  ('music', '음악', '🎵', 9),
  ('exhibition', '전시', '🎨', 10),
  ('food', '맛집', '🍽', 11),
  ('reading', '독서', '📚', 12),
  ('hiking', '등산', '⛰️', 13),
  ('garden', '원예', '🌱', 14),
  ('cooking', '요리', '🍳', 15),
  ('dance', '댄스', '💃', 16),
  ('golf', '골프', '⛳', 17),
  ('fishing', '낚시', '🎣', 18),
  ('craft', '공예', '🧵', 19),
  ('nature', '자연', '🌿', 20),
  ('family', '가족', '👨‍👩‍👧', 21),
  ('exercise', '운동', '🏃', 22),
  ('culture', '문화', '🎭', 23),
  ('writing', '글쓰기', '✍️', 24)
ON CONFLICT (slug) DO NOTHING;

ALTER TABLE interest_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_interests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "interest_tags_public_read" ON interest_tags FOR SELECT USING (true);
CREATE POLICY "user_interests_select_own" ON user_interests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "user_interests_insert_own" ON user_interests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "user_interests_delete_own" ON user_interests FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_user_interests_user ON user_interests(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_ieum_code ON user_profiles(ieum_code);

-- Matchable profiles for Similarity Engine (limited fields)
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
  GROUP BY p.id, p.display_name, p.age_group, p.region,
           p.activity_score, p.relationship_score, p.ieum_code, p.dna_title, p.created_at;
$$;

GRANT EXECUTE ON FUNCTION get_matchable_profiles() TO authenticated;

-- Count similar users (same region + at least 1 shared interest)
CREATE OR REPLACE FUNCTION count_similar_users(min_shared INTEGER DEFAULT 1)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
DECLARE
  my_region TEXT;
  my_interests TEXT[];
  cnt INTEGER;
BEGIN
  SELECT region INTO my_region FROM user_profiles WHERE id = auth.uid();
  SELECT ARRAY_AGG(interest_slug) INTO my_interests
  FROM user_interests WHERE user_id = auth.uid();

  IF my_interests IS NULL OR array_length(my_interests, 1) IS NULL THEN
    SELECT COUNT(*)::INTEGER INTO cnt
    FROM user_profiles p
    WHERE p.id != auth.uid()
      AND p.test_completed_at IS NOT NULL
      AND (my_region IS NULL OR p.region = my_region OR p.region LIKE '%' || split_part(my_region, ' ', -1) || '%');
    RETURN cnt;
  END IF;

  SELECT COUNT(DISTINCT p.id)::INTEGER INTO cnt
  FROM user_profiles p
  JOIN user_interests ui ON ui.user_id = p.id
  WHERE p.id != auth.uid()
    AND p.test_completed_at IS NOT NULL
    AND ui.interest_slug = ANY(my_interests)
    AND (my_region IS NULL OR p.region = my_region OR p.region LIKE '%' || split_part(my_region, ' ', -1) || '%');

  RETURN cnt;
END;
$$;

GRANT EXECUTE ON FUNCTION count_similar_users(INTEGER) TO authenticated;

-- New users today count
CREATE OR REPLACE FUNCTION count_new_users_today()
RETURNS INTEGER
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT COUNT(*)::INTEGER
  FROM user_profiles
  WHERE id != auth.uid()
    AND test_completed_at IS NOT NULL
    AND created_at >= CURRENT_DATE;
$$;

GRANT EXECUTE ON FUNCTION count_new_users_today() TO authenticated;
