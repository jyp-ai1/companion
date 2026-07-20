import type { Meetup, MeetupCategory } from "@/lib/types";
import { CATEGORY_LABELS } from "@/lib/types";

const CATEGORY_ICONS: Partial<Record<MeetupCategory, string>> = {
  walking: "🌿",
  hiking: "⛰️",
  travel: "🚌",
  health: "💪",
  cafe: "☕",
  culture: "🎭",
  reading: "📚",
  exercise: "🏃",
  social: "🤝",
  class: "🎓",
  writing: "✍️",
  other: "✨",
};

const ACTIVITY_TITLES: Partial<Record<MeetupCategory, string>> = {
  walking: "오늘 30분 산책 같이 하기",
  cafe: "새로운 친구와 브런치",
  culture: "문화 공연 함께 보기",
  travel: "근교 여행 떠나기",
  exercise: "가볍게 운동하기",
  hiking: "등산 함께하기",
  reading: "독서 모임",
  health: "건강 관리 함께하기",
};

export type FeedItem = {
  id: string;
  meetupId: string;
  icon: string;
  activityTitle: string;
  meetupTitle: string;
  category: MeetupCategory;
  categoryLabel: string;
  timeLabel: string;
  location: string | null;
  participantCount: number;
  maxParticipants: number;
  score?: number;
};

function formatTimeLabel(scheduledAt: string | null): string {
  if (!scheduledAt) return "일정 미정";
  const d = new Date(scheduledAt);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const target = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const diff = (target.getTime() - today.getTime()) / 86400000;

  const time = d.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" });
  if (diff === 0) return `오늘 ${time}`;
  if (diff === 1) return `내일 ${time}`;
  return d.toLocaleDateString("ko-KR", { month: "long", day: "numeric", weekday: "short" });
}

export function meetupToFeedItem(
  meetup: Meetup,
  participantCount: number,
  score?: number,
): FeedItem {
  const icon = CATEGORY_ICONS[meetup.category] ?? "✨";
  const activityTitle =
    ACTIVITY_TITLES[meetup.category] ?? `${CATEGORY_LABELS[meetup.category]} 함께하기`;

  return {
    id: meetup.id,
    meetupId: meetup.id,
    icon,
    activityTitle,
    meetupTitle: meetup.title,
    category: meetup.category,
    categoryLabel: CATEGORY_LABELS[meetup.category],
    timeLabel: formatTimeLabel(meetup.scheduled_at),
    location: meetup.location_name,
    participantCount,
    maxParticipants: meetup.max_participants,
    score,
  };
}

export function buildDiscoveryFeed(
  meetups: Meetup[],
  counts: Record<string, number>,
  scores: Record<string, number>,
  limit = 6,
): FeedItem[] {
  return meetups.slice(0, limit).map((m) =>
    meetupToFeedItem(m, counts[m.id] ?? 0, scores[m.id]),
  );
}
