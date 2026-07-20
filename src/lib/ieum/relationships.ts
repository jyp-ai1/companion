import { CATEGORY_LABELS } from "@/lib/types";
import type { MeetupCategory } from "@/lib/types";

export type TogetherConnection = {
  peer_id: string;
  display_name: string | null;
  age_group: string | null;
  meet_count: number;
  first_met_at: string | null;
  last_met_at: string | null;
  last_activity: string | null;
  last_category: MeetupCategory | null;
  status: "met" | "regular" | "friend";
};

export type TimelineStep = {
  id: string;
  label: string;
  emoji: string;
  dateLabel: string;
  meetupId?: string;
};

const CATEGORY_EMOJI: Partial<Record<MeetupCategory, string>> = {
  walking: "🚶",
  hiking: "⛰️",
  cafe: "☕",
  culture: "🎬",
  travel: "🚌",
  reading: "📚",
  social: "🤝",
  exercise: "🏃",
};

export function inferRelationshipStatus(meetCount: number): TogetherConnection["status"] {
  if (meetCount >= 4) return "friend";
  if (meetCount >= 2) return "regular";
  return "met";
}

export function buildRelationshipTimeline(
  connection: TogetherConnection,
  activities: { meetup_id: string; title: string; category: MeetupCategory; activity_at: string }[],
): TimelineStep[] {
  const steps: TimelineStep[] = [];

  if (connection.first_met_at) {
    steps.push({
      id: "first",
      label: "처음 만남",
      emoji: "👋",
      dateLabel: new Date(connection.first_met_at).toLocaleDateString("ko-KR", {
        month: "long",
        day: "numeric",
      }),
    });
  }

  for (const act of activities) {
    const cat = act.category;
    steps.push({
      id: act.meetup_id,
      label: CATEGORY_LABELS[cat] ?? act.title,
      emoji: CATEGORY_EMOJI[cat] ?? "✨",
      dateLabel: new Date(act.activity_at).toLocaleDateString("ko-KR", {
        month: "long",
        day: "numeric",
      }),
      meetupId: act.meetup_id,
    });
  }

  if (connection.status === "friend") {
    steps.push({
      id: "friend",
      label: "친구",
      emoji: "❤️",
      dateLabel: "함께하는 관계",
    });
  }

  return steps;
}

export function maskName(name: string | null): string {
  if (!name || name.length < 2) return "이웃";
  return name.charAt(0) + "○".repeat(Math.min(name.length - 1, 2));
}
