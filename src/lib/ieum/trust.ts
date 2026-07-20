export type Satisfaction = "happy" | "ok" | "sad";
export type AgainChoice = "yes" | "ok" | "later";
export type ReportReason = "no_show" | "uncomfortable" | "spam" | "other";

export type TrustStats = {
  completedActivities: number;
  completionRate: number;
  reviewCount: number;
  againYesCount: number;
  memberDays: number;
  profileCompleteness: number;
};

export type TrustBadge = {
  id: string;
  emoji: string;
  title: string;
  earned: boolean;
  description: string;
};

export const SATISFACTION_OPTIONS: {
  value: Satisfaction;
  label: string;
  emoji: string;
}[] = [
  { value: "happy", label: "즐거웠어요", emoji: "😊" },
  { value: "ok", label: "괜찮았어요", emoji: "🙂" },
  { value: "sad", label: "아쉬웠어요", emoji: "😔" },
];

export const AGAIN_OPTIONS: {
  value: AgainChoice;
  label: string;
}[] = [
  { value: "yes", label: "네" },
  { value: "ok", label: "괜찮아요" },
  { value: "later", label: "다음 기회에" },
];

export const REPORT_REASONS: {
  value: ReportReason;
  label: string;
}[] = [
  { value: "no_show", label: "약속 불참" },
  { value: "uncomfortable", label: "불쾌한 행동" },
  { value: "spam", label: "광고" },
  { value: "other", label: "기타" },
];

export function satisfactionToRating(satisfaction: Satisfaction): number {
  if (satisfaction === "happy") return 5;
  if (satisfaction === "ok") return 3;
  return 2;
}

export function computeProfileCompleteness(profile: {
  display_name?: string | null;
  region?: string | null;
  age_group?: string | null;
  phone?: string | null;
  test_completed_at?: string | null;
  ieum_code?: string | null;
}): number {
  const fields = [
    profile.display_name,
    profile.region,
    profile.age_group,
    profile.phone,
    profile.test_completed_at,
    profile.ieum_code,
  ];
  const filled = fields.filter(Boolean).length;
  return Math.round((filled / fields.length) * 100);
}

export function computeMemberDays(createdAt: string | null | undefined): number {
  if (!createdAt) return 0;
  return Math.max(
    0,
    Math.floor((Date.now() - new Date(createdAt).getTime()) / 86400000),
  );
}

export function getTrustBadges(stats: TrustStats): TrustBadge[] {
  const { completedActivities, reviewCount, againYesCount } = stats;

  return [
    {
      id: "first_step",
      emoji: "🌱",
      title: "첫걸음",
      earned: completedActivities >= 1,
      description: "첫 활동을 함께했어요",
    },
    {
      id: "steady",
      emoji: "🌿",
      title: "꾸준한 동행",
      earned: completedActivities >= 5,
      description: "5번 함께했어요",
    },
    {
      id: "trusted",
      emoji: "🌳",
      title: "믿음직한 이웃",
      earned: completedActivities >= 20,
      description: "20번 함께했어요",
    },
    {
      id: "reviewer",
      emoji: "💬",
      title: "따뜻한 후기",
      earned: reviewCount >= 10,
      description: "활동 후기 10개",
    },
    {
      id: "again",
      emoji: "⭐",
      title: "지역 리더",
      earned: againYesCount >= 10,
      description: "다시 함께하기 10회",
    },
  ];
}

export function buildTrustStats(input: {
  completedCount: number;
  confirmedCount: number;
  reviewCount: number;
  againYesCount: number;
  createdAt: string | null | undefined;
  profile: {
    display_name?: string | null;
    region?: string | null;
    age_group?: string | null;
    phone?: string | null;
    test_completed_at?: string | null;
    ieum_code?: string | null;
  };
}): TrustStats {
  const completionRate =
    input.confirmedCount > 0
      ? Math.round((input.completedCount / input.confirmedCount) * 100)
      : 0;

  return {
    completedActivities: input.completedCount,
    completionRate,
    reviewCount: input.reviewCount,
    againYesCount: input.againYesCount,
    memberDays: computeMemberDays(input.createdAt),
    profileCompleteness: computeProfileCompleteness(input.profile),
  };
}

export async function fetchTrustStatsForUser(
  supabase: Awaited<ReturnType<typeof import("@/lib/supabase/server").createClient>>,
  userId: string,
): Promise<TrustStats> {
  const { data: profile } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  const { data: parts } = await supabase
    .from("participations")
    .select("status")
    .eq("user_id", userId)
    .in("status", ["confirmed", "completed"]);

  const completedCount = parts?.filter((p) => p.status === "completed").length ?? 0;
  const confirmedCount = parts?.length ?? 0;

  let reviewCount = 0;
  try {
    const { count: meetupReviews } = await supabase
      .from("reviews")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);
    const { count: openReviews } = await supabase
      .from("open_activity_reviews")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);
    reviewCount = (meetupReviews ?? 0) + (openReviews ?? 0);
  } catch {
    const { count } = await supabase
      .from("reviews")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);
    reviewCount = count ?? 0;
  }

  let againYesCount = 0;
  try {
    const { count } = await supabase
      .from("again_together")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("choice", "yes");
    againYesCount = count ?? 0;
  } catch {
    againYesCount = 0;
  }

  return buildTrustStats({
    completedCount,
    confirmedCount,
    reviewCount,
    againYesCount,
    createdAt: profile?.created_at,
    profile: profile ?? {},
  });
}
