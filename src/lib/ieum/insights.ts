import type { MeetupCategory } from "@/lib/types";
import { CATEGORY_LABELS } from "@/lib/types";

export type ActivityGraphEntry = {
  category: MeetupCategory;
  label: string;
  count: number;
};

export type DynamicTypeInsight = {
  initialTypeCode: string | null;
  initialTitle: string | null;
  evolvedTitle: string;
  evolvedEmoji: string;
  shiftDescription: string;
  topCategories: MeetupCategory[];
};

const EVOLVED_TYPES: Record<
  string,
  { title: string; emoji: string; categories: MeetupCategory[] }
> = {
  active: { title: "활력 동행형", emoji: "🚶", categories: ["walking", "hiking", "exercise"] },
  culture: { title: "조용한 문화형", emoji: "🎭", categories: ["culture", "reading", "class"] },
  social: { title: "따뜻한 교류형", emoji: "☕", categories: ["cafe", "social", "travel"] },
  health: { title: "건강 실천형", emoji: "💪", categories: ["health", "exercise", "walking"] },
};

function detectEvolvedType(
  categoryCounts: Record<string, number>,
): { key: string; categories: MeetupCategory[] } {
  const scores: Record<string, number> = {
    active: 0,
    culture: 0,
    social: 0,
    health: 0,
  };

  for (const [key, def] of Object.entries(EVOLVED_TYPES)) {
    for (const cat of def.categories) {
      scores[key] += categoryCounts[cat] ?? 0;
    }
  }

  const top = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
  if (!top || top[1] === 0) return { key: "active", categories: EVOLVED_TYPES.active.categories };

  return { key: top[0], categories: EVOLVED_TYPES[top[0]].categories };
}

export function buildActivityGraph(
  categoryCounts: Record<string, number>,
): ActivityGraphEntry[] {
  return Object.entries(categoryCounts)
    .map(([category, count]) => ({
      category: category as MeetupCategory,
      label: CATEGORY_LABELS[category as MeetupCategory] ?? category,
      count,
    }))
    .sort((a, b) => b.count - a.count);
}

export function buildDynamicType(
  initialTypeCode: string | null,
  initialTitle: string | null,
  initialEmoji: string | null,
  categoryCounts: Record<string, number>,
  totalParticipations: number,
): DynamicTypeInsight {
  if (totalParticipations < 2) {
    return {
      initialTypeCode,
      initialTitle,
      evolvedTitle: initialTitle ?? "이음 회원",
      evolvedEmoji: initialEmoji ?? "🌿",
      shiftDescription: "참여가 쌓이면 AI가 성향을 학습합니다.",
      topCategories: [],
    };
  }

  const { key, categories } = detectEvolvedType(categoryCounts);
  const evolved = EVOLVED_TYPES[key];

  const shiftDescription =
    initialTitle && evolved.title !== initialTitle
      ? `실제 참여 패턴을 반영해 ${evolved.title}으로 업데이트되었습니다.`
      : "참여 활동을 바탕으로 추천이 고도화되고 있습니다.";

  return {
    initialTypeCode,
    initialTitle,
    evolvedTitle: evolved.title,
    evolvedEmoji: evolved.emoji,
    shiftDescription,
    topCategories: categories,
  };
}

export function buildSocialImpactStats(
  participations: { created_at: string; status: string }[],
  reviews: { met_new_people: boolean | null; rating: number }[],
) {
  const completed = participations.filter((p) => p.status === "completed");
  const now = new Date();
  const thisMonth = completed.filter((p) => {
    const d = new Date(p.created_at);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  const lastMonth = completed.filter((p) => {
    const d = new Date(p.created_at);
    const lm = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    return d.getMonth() === lm.getMonth() && d.getFullYear() === lm.getFullYear();
  }).length;

  const metNewPeople = reviews.filter((r) => r.met_new_people).length;
  const avgRating =
    reviews.length > 0
      ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
      : 0;

  const userIds = new Set(participations.map(() => true));
  const rejoinRate =
    completed.length >= 2 ? 100 : completed.length === 1 ? 0 : 0;

  return {
    monthlyOutings: thisMonth,
    outingIncrease: thisMonth - lastMonth,
    newFriends: metNewPeople,
    avgSatisfaction: avgRating,
    rejoinRate,
    totalCompleted: completed.length,
    activeUsers: userIds.size,
  };
}
