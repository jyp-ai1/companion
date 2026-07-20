import { getInterestLabel } from "@/lib/ieum/interests";
import type { CompatibilityBreakdown } from "@/lib/ieum/compatibility";
import type { MatchProfile } from "@/lib/ieum/similarity";
import type { Meetup } from "@/lib/types";
import { CATEGORY_LABELS } from "@/lib/types";

export function generatePairSummary(
  myName: string,
  peer: MatchProfile,
  sharedSlugs: string[],
  compat: CompatibilityBreakdown,
): string {
  const labels = sharedSlugs.slice(0, 2).map(getInterestLabel);
  const peerName = peer.display_name ?? "이웃";
  const timePref = compat.activity >= 85 ? "오전 활동" : "여유로운 시간";

  if (labels.length >= 2) {
    return `${myName}님과 ${peerName}님은 ${labels[0]}와 ${labels[1]}를 좋아하며 ${timePref}을 선호합니다. 첫 만남으로 ${labels[0]} 활동을 추천드립니다.`;
  }
  if (labels.length === 1) {
    return `두 분 모두 ${labels[0]}를 좋아합니다. ${timePref}에 함께할 수 있는 활동을 추천드립니다.`;
  }
  return `비슷한 생활 패턴을 가진 이웃입니다. 함께할 가능성 ${compat.together}%로 첫 활동을 시작해 보세요.`;
}

export function generateMeetupWhy(
  meetup: Meetup,
  reasons: string[],
  interestSlugs: string[],
): string {
  const cat = CATEGORY_LABELS[meetup.category];
  const interestMatch = interestSlugs.find((s) => {
    const label = getInterestLabel(s);
    return cat.includes(label) || label.includes(cat.slice(0, 1));
  });
  const interestPart = interestMatch
    ? `${getInterestLabel(interestMatch)}를 좋아하시고, `
    : "";
  const reasonText = reasons.slice(0, 2).join(" ").replace(/✓ /g, "");
  return `${interestPart}${reasonText}. 오늘 ${cat} 활동을 함께해 보세요.`;
}

export function generateDailyCoachSummary(
  name: string,
  droppedInterest: string | null,
  topInterest: string | null,
): string {
  if (droppedInterest) {
    return `${name}님, 최근 ${getInterestLabel(droppedInterest)} 활동이 줄었습니다. 이번 주 관련 활동을 추천드립니다.`;
  }
  if (topInterest) {
    return `${name}님, 오늘 ${getInterestLabel(topInterest)} 활동이 잘 맞습니다. 비슷한 이웃들과 함께해 보세요.`;
  }
  return `${name}님, 오늘의 이음에서 새로운 관심사와 활동을 발견해 보세요.`;
}
