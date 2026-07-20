import { getInterestLabel } from "@/lib/ieum/interests";
import type { MatchProfile } from "@/lib/ieum/similarity";

export type CompatibilityBreakdown = {
  interests: number;
  conversation: number;
  lifestyle: number;
  activity: number;
  distance: number;
  time: number;
  together: number;
  reasons: string[];
};

function regionOverlap(a: string | null, b: string | null): boolean {
  if (!a || !b) return false;
  if (a === b) return true;
  const aPart = a.split(" ").pop() ?? "";
  const bPart = b.split(" ").pop() ?? "";
  return a.includes(bPart) || b.includes(aPart);
}

function timePreferenceScore(activityScore: number): number {
  return activityScore >= 0.5 ? 88 : 82;
}

export function calculateCompatibility(
  myInterests: string[],
  myProfile: {
    activity_score: number;
    relationship_score: number;
    participation_score: number;
    region: string | null;
  },
  peer: MatchProfile,
): CompatibilityBreakdown {
  const shared = myInterests.filter((i) => peer.interest_slugs.includes(i));
  const union = new Set([...myInterests, ...peer.interest_slugs]).size;
  const jaccard = union > 0 ? shared.length / union : 0;

  const interests = Math.round(Math.min(99, 70 + jaccard * 30));
  const conversation = Math.round(
    Math.min(
      99,
      75 +
        (1 - Math.abs(myProfile.relationship_score - Number(peer.relationship_score))) * 20 +
        shared.length * 2,
    ),
  );
  const lifestyle = Math.round(
    Math.min(
      99,
      72 +
        (1 - Math.abs(myProfile.participation_score - 0.5)) * 15 +
        (regionOverlap(myProfile.region, peer.region) ? 10 : 0),
    ),
  );
  const activity = Math.round(
    Math.min(
      99,
      70 + (1 - Math.abs(myProfile.activity_score - Number(peer.activity_score))) * 25,
    ),
  );
  const distance = regionOverlap(myProfile.region, peer.region) ? 92 : 68;
  const time = timePreferenceScore(myProfile.activity_score);

  const together = Math.round(
    interests * 0.3 +
      conversation * 0.25 +
      lifestyle * 0.15 +
      activity * 0.15 +
      distance * 0.1 +
      time * 0.05,
  );

  const reasons: string[] = [];
  if (shared.length > 0) {
    reasons.push(`✓ ${getInterestLabel(shared[0])} 등 공통 관심사 ${shared.length}개`);
  }
  if (myProfile.activity_score >= 0.5) reasons.push("✓ 오전·낮 활동 선호");
  else reasons.push("✓ 여유로운 활동 시간");
  if (regionOverlap(myProfile.region, peer.region)) reasons.push("✓ 같은 지역");
  reasons.push(`✓ 함께할 가능성 ${together}%`);

  return {
    interests,
    conversation,
    lifestyle,
    activity,
    distance,
    time,
    together,
    reasons,
  };
}
