import type { Meetup, MeetupCategory } from "@/lib/types";
import { CATEGORY_LABELS } from "@/lib/types";

export type ScoredMeetup = {
  meetup: Meetup;
  score: number;
  scorePercent: number;
  reasons: string[];
};

function scoreMeetup(
  meetup: Meetup,
  categories: MeetupCategory[],
  region: string | null,
): { score: number; reasons: string[] } {
  let score = 0;
  const reasons: string[] = [];
  const regionKey = region?.replace(/\s/g, "") ?? "";

  const catIdx = categories.indexOf(meetup.category);
  if (catIdx >= 0) {
    score += 100 - catIdx * 10;
    reasons.push(`✓ ${CATEGORY_LABELS[meetup.category]}를 좋아합니다`);
  }

  const meetupRegion = meetup.region.replace(/\s/g, "");
  if (regionKey && meetupRegion.includes(regionKey)) {
    score += 50;
    reasons.push("✓ 같은 지역 · 약 1~2km");
  }

  if (meetup.scheduled_at) {
    const d = new Date(meetup.scheduled_at);
    const hour = d.getHours();
    const days = (d.getTime() - Date.now()) / 86400000;
    if (days >= 0 && days <= 14) {
      score += 20;
      reasons.push(hour < 12 ? "✓ 오전 활동 선호" : "✓ 활동 시간 적합");
    }
  }

  if (catIdx >= 0) {
    reasons.push(`✓ 관심사 매칭 ${Math.max(75, 95 - catIdx * 5)}%`);
  }

  if (reasons.length === 0) reasons.push("✓ 참여 성향");

  return { score, reasons };
}

export function scoreMeetupsForRecommend(
  meetups: Meetup[],
  categories: MeetupCategory[],
  region: string | null,
): ScoredMeetup[] {
  const maxScore = 170;
  return meetups
    .map((meetup) => {
      const { score, reasons } = scoreMeetup(meetup, categories, region);
      return {
        meetup,
        score,
        scorePercent: Math.min(99, Math.max(60, Math.round((score / maxScore) * 100))),
        reasons,
      };
    })
    .sort((a, b) => b.score - a.score);
}

export function rankMeetups(
  meetups: Meetup[],
  categories: MeetupCategory[],
  region: string | null,
  limit = 5,
): Meetup[] {
  const regionKey = region?.replace(/\s/g, "") ?? "";

  const scored = meetups.map((m) => {
    let score = 0;
    const catIdx = categories.indexOf(m.category);
    if (catIdx >= 0) score += 100 - catIdx * 10;

    const meetupRegion = m.region.replace(/\s/g, "");
    if (regionKey && meetupRegion.includes(regionKey)) score += 50;
    else if (regionKey && regionKey.includes(meetupRegion.split(" ").pop() ?? ""))
      score += 30;

    if (m.scheduled_at) {
      const days = (new Date(m.scheduled_at).getTime() - Date.now()) / 86400000;
      if (days >= 0 && days <= 14) score += 20;
    }

    return { meetup: m, score };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.meetup);
}
