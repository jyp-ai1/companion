import { getInterestLabel } from "@/lib/ieum/interests";
import { activityPhrase } from "@/lib/copy";

export function generateInvitationMessage(
  interestSlug: string,
  durationMinutes: number,
  locationName: string,
): string {
  const interest = getInterestLabel(interestSlug);
  const activity = activityPhrase(interestSlug);

  return [
    "안녕하세요.",
    `${interest}를 좋아하는 분과`,
    `가볍게 ${durationMinutes}분 ${activity.replace("오늘 ", "")}하고 싶습니다.`,
    `(${locationName})`,
    "부담 없이 함께해 주실 분 찾습니다.",
  ].join("\n");
}

export function generateFriendInviteMessage(
  interestSlug: string,
  inviterName: string,
): string {
  const interest = getInterestLabel(interestSlug);
  return `우리 둘 다 ${interest}를 좋아하는데, 같이 이음에서 시작해볼까요? — ${inviterName}`;
}

export function generateShareText(message: string, url: string): string {
  return `${message}\n\n${url}`;
}

export type GrowthEventType =
  | "invite_created"
  | "invite_accepted"
  | "invite_shared"
  | "referral_signup"
  | "first_activity"
  | "activity_join"
  | "profile_reveal"
  | "viral_loop_complete";

export const VIRAL_LOOP = [
  "Activity",
  "Invitation",
  "New User",
  "New Activity",
  "Invitation",
] as const;
