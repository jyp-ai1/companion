import { getInterestEmoji, getInterestLabel } from "@/lib/ieum/interests";
import { activityPhrase, COPY } from "@/lib/copy";

export type DailyQuestion = {
  key: string;
  text: string;
  options: { value: string; label: string; emoji: string }[];
};

const QUESTION_POOL: DailyQuestion[] = [
  {
    key: "want_today",
    text: "요즘 가장 해보고 싶은 것은?",
    options: [
      { value: "travel", label: "여행", emoji: "🚌" },
      { value: "movie", label: "영화", emoji: "🎬" },
      { value: "walk", label: "걷기", emoji: "🚶" },
      { value: "cafe", label: "카페", emoji: "☕" },
    ],
  },
  {
    key: "today_mood",
    text: "오늘 가장 하고 싶은 활동은?",
    options: [
      { value: "walk", label: "산책", emoji: "🌿" },
      { value: "culture", label: "문화", emoji: "🎭" },
      { value: "cafe", label: "카페", emoji: "☕" },
      { value: "exercise", label: "운동", emoji: "🏃" },
    ],
  },
  {
    key: "with_whom",
    text: "오늘은 어떤 시간을 보내고 싶으세요?",
    options: [
      { value: "quiet", label: "조용히", emoji: "🍃" },
      { value: "chat", label: "대화하며", emoji: "💬" },
      { value: "active", label: "활동하며", emoji: "⚡" },
      { value: "new", label: "새로운 만남", emoji: "✨" },
    ],
  },
];

export type MicroAction = {
  key: string;
  title: string;
  body: string;
  interestSlug: string;
};

export type TodayCardType = "question" | "micro" | "open";

export const DAILY_MOODS = [
  { value: "calm", label: "차분해요", emoji: "🍃" },
  { value: "light", label: "가벼워요", emoji: "☀️" },
  { value: "social", label: "만나고 싶어요", emoji: "💬" },
  { value: "active", label: "움직이고 싶어요", emoji: "⚡" },
] as const;

export type DailyMood = (typeof DAILY_MOODS)[number]["value"];

export function getTodayQuestion(day = new Date()): DailyQuestion {
  const idx = day.getDate() % QUESTION_POOL.length;
  return QUESTION_POOL[idx];
}

export function getTodayCardType(day = new Date()): TodayCardType {
  const types: TodayCardType[] = ["question", "micro", "open", "question", "micro"];
  return types[day.getDate() % types.length];
}

export function getTodayMicroAction(
  topInterest: string | null,
  day = new Date(),
): MicroAction {
  const slug = topInterest ?? "walk";
  const label = getInterestLabel(slug);
  return {
    key: `micro_${slug}_${day.toISOString().slice(0, 10)}`,
    title: activityPhrase(slug),
    body: `오늘 30분 ${label}, 가능하세요?`,
    interestSlug: slug,
  };
}

export type OpenActivityItem = {
  id: string;
  title: string;
  location_name: string;
  starts_at: string;
  duration_minutes: number;
  interest_slug: string | null;
  participant_count: number;
  max_participants: number;
  invitation_message?: string | null;
};

export function buildOpenActivityTitle(
  interestSlug: string,
  location: string,
): string {
  return `${activityPhrase(interestSlug)} · ${location}`;
}

export function formatOpenTime(startsAt: string): string {
  const d = new Date(startsAt);
  const now = new Date();
  const isToday =
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear();
  const time = d.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" });
  return isToday ? `오늘 ${time}` : d.toLocaleDateString("ko-KR", { weekday: "short", hour: "2-digit", minute: "2-digit" });
}

export { getInterestEmoji, getInterestLabel, COPY };
