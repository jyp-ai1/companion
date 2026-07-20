import type { MeetupCategory } from "@/lib/types";
import { CATEGORY_LABELS } from "@/lib/types";
import type { DynamicTypeInsight } from "./insights";

export type CoachMessage = {
  greeting: string;
  headline: string;
  body: string;
  suggestion: string;
  reasons: string[];
  category: MeetupCategory | null;
};

export function getAiCoachMessage(
  name: string,
  dynamicType: DynamicTypeInsight,
  topCategory: MeetupCategory | null,
  recentDropCategory: MeetupCategory | null,
): CoachMessage {
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "좋은 아침입니다" : hour < 18 ? "좋은 오후입니다" : "좋은 저녁입니다";

  const category = topCategory ?? "walking";
  const label = CATEGORY_LABELS[category];

  let body = `관심사가 비슷한 이웃들이 ${label} 활동에 많이 참여하고 있어요.`;
  let suggestion = `먼저 ${label} 활동을 둘러보세요. 모임은 그다음입니다.`;

  if (recentDropCategory) {
    const dropLabel = CATEGORY_LABELS[recentDropCategory];
    body = `최근 ${dropLabel} 관심사 활동이 줄었습니다.`;
    suggestion = `비슷한 사람들이 좋아하는 ${dropLabel} 활동을 추천합니다.`;
  }

  const reasons = [
    `✓ ${dynamicType.evolvedTitle} 관심 프로필`,
    "✓ 공통 관심사 매칭",
    "✓ 우리 동네 이웃",
    "✓ 참여 기록 학습",
  ];

  return {
    greeting: `${greeting} ${name}님 😊`,
    headline: "오늘 AI 코치 추천",
    body,
    suggestion,
    reasons,
    category,
  };
}
