export type AxisType = "activity" | "relationship" | "interest" | "participation";

export type MeetupCategory =
  | "walking"
  | "hiking"
  | "travel"
  | "health"
  | "cafe"
  | "culture"
  | "reading"
  | "writing"
  | "class"
  | "exercise"
  | "social"
  | "other";

export interface TypeDefinition {
  type_code: string;
  title: string;
  description: string;
  emoji: string;
  recommendations: string[];
}

export interface UserProfile {
  id: string;
  display_name: string | null;
  birth_year: number | null;
  region: string | null;
  type_code: string | null;
  ieum_code: string | null;
  dna_title: string | null;
  activity_score: number;
  relationship_score: number;
  interest_score: number;
  participation_score: number;
  test_completed_at: string | null;
  onboarding_completed: boolean;
}

export interface Question {
  id: number;
  sort_order: number;
  question: string;
  option_a: string;
  option_b: string;
  axis: AxisType;
  option_a_value: string;
  option_b_value: string;
}

export interface Meetup {
  id: string;
  title: string;
  description: string | null;
  category: MeetupCategory;
  region: string;
  location_name: string | null;
  scheduled_at: string | null;
  max_participants: number;
}

export const AXIS_LABELS: Record<AxisType, { a: string; b: string }> = {
  activity: { a: "활동형", b: "평온형" },
  relationship: { a: "교류형", b: "소수형" },
  interest: { a: "건강형", b: "학습형" },
  participation: { a: "정기형", b: "자유형" },
};

export const CATEGORY_LABELS: Record<MeetupCategory, string> = {
  walking: "산책",
  hiking: "등산",
  travel: "여행",
  health: "건강",
  cafe: "카페",
  culture: "문화",
  reading: "독서",
  writing: "글쓰기",
  class: "강좌",
  exercise: "운동",
  social: "친목",
  other: "기타",
};
