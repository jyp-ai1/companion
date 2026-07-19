-- Age-Tech AI Platform: 이음 (Companion)
-- Sprint 0: Initial schema

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- Type definitions (16 이음 타입)
-- ============================================================
CREATE TABLE type_definitions (
  type_code CHAR(4) PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  emoji TEXT NOT NULL DEFAULT '🌿',
  recommendations TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- User profiles (extends auth.users)
-- ============================================================
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  birth_year INTEGER,
  region TEXT,
  type_code CHAR(4) REFERENCES type_definitions(type_code),
  activity_score NUMERIC(3,2) DEFAULT 0.5,
  relationship_score NUMERIC(3,2) DEFAULT 0.5,
  interest_score NUMERIC(3,2) DEFAULT 0.5,
  participation_score NUMERIC(3,2) DEFAULT 0.5,
  test_completed_at TIMESTAMPTZ,
  onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- Questions (12문항, 4축)
-- ============================================================
CREATE TYPE axis_type AS ENUM ('activity', 'relationship', 'interest', 'participation');

CREATE TABLE questions (
  id SERIAL PRIMARY KEY,
  sort_order INTEGER NOT NULL UNIQUE,
  question TEXT NOT NULL,
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  axis axis_type NOT NULL,
  option_a_value CHAR(1) NOT NULL,
  option_b_value CHAR(1) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- Answers
-- ============================================================
CREATE TABLE answers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id INTEGER NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  selected_option CHAR(1) NOT NULL CHECK (selected_option IN ('A', 'B')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, question_id)
);

-- ============================================================
-- Meetups
-- ============================================================
CREATE TYPE meetup_category AS ENUM (
  'walking', 'hiking', 'travel', 'health',
  'cafe', 'culture', 'reading', 'writing',
  'class', 'exercise', 'social', 'other'
);

CREATE TABLE meetups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  category meetup_category NOT NULL DEFAULT 'other',
  region TEXT NOT NULL,
  location_name TEXT,
  scheduled_at TIMESTAMPTZ,
  max_participants INTEGER NOT NULL DEFAULT 10,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- Participations
-- ============================================================
CREATE TYPE participation_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');

CREATE TABLE participations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  meetup_id UUID NOT NULL REFERENCES meetups(id) ON DELETE CASCADE,
  status participation_status NOT NULL DEFAULT 'confirmed',
  satisfaction INTEGER CHECK (satisfaction >= 1 AND satisfaction <= 5),
  feedback TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, meetup_id)
);

-- ============================================================
-- Type → Category mapping (rule-based recommendations)
-- ============================================================
CREATE TABLE type_category_rules (
  type_code CHAR(4) NOT NULL REFERENCES type_definitions(type_code) ON DELETE CASCADE,
  category meetup_category NOT NULL,
  priority INTEGER NOT NULL DEFAULT 1,
  PRIMARY KEY (type_code, category)
);

-- ============================================================
-- Indexes
-- ============================================================
CREATE INDEX idx_user_profiles_type_code ON user_profiles(type_code);
CREATE INDEX idx_user_profiles_region ON user_profiles(region);
CREATE INDEX idx_answers_user_id ON answers(user_id);
CREATE INDEX idx_meetups_region ON meetups(region);
CREATE INDEX idx_meetups_category ON meetups(category);
CREATE INDEX idx_participations_user_id ON participations(user_id);
CREATE INDEX idx_participations_meetup_id ON participations(meetup_id);

-- ============================================================
-- Updated_at trigger
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER meetups_updated_at
  BEFORE UPDATE ON meetups
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER participations_updated_at
  BEFORE UPDATE ON participations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- Auto-create profile on signup
-- ============================================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- Row Level Security
-- ============================================================
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE participations ENABLE ROW LEVEL SECURITY;
ALTER TABLE type_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE meetups ENABLE ROW LEVEL SECURITY;
ALTER TABLE type_category_rules ENABLE ROW LEVEL SECURITY;

-- Public read for reference data
CREATE POLICY "type_definitions_public_read" ON type_definitions FOR SELECT USING (true);
CREATE POLICY "questions_public_read" ON questions FOR SELECT USING (true);
CREATE POLICY "meetups_public_read" ON meetups FOR SELECT USING (is_active = true);
CREATE POLICY "type_category_rules_public_read" ON type_category_rules FOR SELECT USING (true);

-- User profiles: own data only
CREATE POLICY "user_profiles_select_own" ON user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "user_profiles_update_own" ON user_profiles FOR UPDATE USING (auth.uid() = id);

-- Answers: own data only
CREATE POLICY "answers_select_own" ON answers FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "answers_insert_own" ON answers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "answers_update_own" ON answers FOR UPDATE USING (auth.uid() = user_id);

-- Participations: own data only
CREATE POLICY "participations_select_own" ON participations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "participations_insert_own" ON participations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "participations_update_own" ON participations FOR UPDATE USING (auth.uid() = user_id);
