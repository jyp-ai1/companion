import type { MeetupCategory, TypeDefinition } from "@/lib/types";
import { CATEGORY_LABELS } from "@/lib/types";

const CATEGORY_ICONS: Partial<Record<MeetupCategory, string>> = {
  walking: "🚶",
  hiking: "⛰️",
  travel: "🚌",
  health: "💪",
  cafe: "☕",
  culture: "🎭",
  reading: "📚",
  writing: "✍️",
  class: "🎓",
  exercise: "🏃",
  social: "🤝",
  other: "✨",
};

export function getDailyGreeting(hour = new Date().getHours()) {
  if (hour < 12) return "좋은 아침입니다";
  if (hour < 18) return "좋은 오후입니다";
  return "좋은 저녁입니다";
}

export function getDailyRecommendationReasons(typeCode: string | null) {
  const base = ["✓ 활동 성향", "✓ 거리", "✓ 참여 성향"];
  if (!typeCode) return base;
  if (typeCode.startsWith("A")) base.unshift("✓ 활동성");
  if (typeCode.includes("H")) base.unshift("✓ 건강");
  if (typeCode.includes("L")) base.unshift("✓ 문화·학습");
  return base.slice(0, 4);
}

export function getDailyAiMessage(
  name: string,
  typeDef: TypeDefinition | null,
  topCategory: MeetupCategory | null,
) {
  const typeTitle = typeDef?.title ?? "이음 회원";
  const categoryLabel = topCategory ? CATEGORY_LABELS[topCategory] : "산책";
  const icon = topCategory ? CATEGORY_ICONS[topCategory] ?? "🌿" : "🌿";

  return {
    headline: `${name}님께 추천드립니다`,
    body: `오늘 날씨가 좋아 ${categoryLabel} 모임을 추천합니다.`,
    typeTitle,
    icon,
  };
}

export const INTEREST_CATEGORIES: { key: MeetupCategory; label: string; icon: string }[] = [
  { key: "walking", label: "산책", icon: "🚶" },
  { key: "hiking", label: "등산", icon: "⛰️" },
  { key: "travel", label: "여행", icon: "🚌" },
  { key: "cafe", label: "카페", icon: "☕" },
  { key: "culture", label: "문화", icon: "🎭" },
  { key: "reading", label: "독서", icon: "📚" },
  { key: "exercise", label: "운동", icon: "🏃" },
  { key: "health", label: "건강", icon: "💪" },
];
