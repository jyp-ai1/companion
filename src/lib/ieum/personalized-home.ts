import type { BrowseActivity } from "@/lib/browse/types";
import { BROWSE_CATALOG } from "@/lib/browse/catalog";

const ANSWER_INTERESTS: Record<string, string[]> = {
  travel: ["travel", "photo", "nature"],
  movie: ["movie", "culture"],
  walk: ["walk", "nature", "health"],
  cafe: ["coffee", "food"],
  coffee: ["coffee", "food"],
  culture: ["culture", "exhibition", "music"],
  exercise: ["exercise", "health", "hiking"],
  quiet: ["reading", "garden", "walk"],
  chat: ["coffee", "food", "culture"],
  active: ["exercise", "hiking", "dance"],
  new: ["travel", "volunteer", "culture"],
};

const MOOD_INTERESTS: Record<string, string[]> = {
  calm: ["walk", "reading", "garden", "nature"],
  light: ["coffee", "photo", "food"],
  social: ["coffee", "food", "volunteer", "culture"],
  active: ["exercise", "hiking", "dance", "walk"],
};

function slugBoost(slug: string, weights: Map<string, number>, amount: number) {
  weights.set(slug, (weights.get(slug) ?? 0) + amount);
}

function buildReason(
  activity: BrowseActivity,
  dnaTitle: string | null,
  mood: string | null,
): string {
  if (mood === "calm" && activity.difficulty === "easy") {
    return "오늘 기분에 맞게 가볍게 시작하기 좋아요";
  }
  if (mood === "active" && activity.difficulty !== "easy") {
    return "지금 에너지에 맞는 활동이에요";
  }
  if (mood === "social" && activity.participantCount >= 2) {
    return "함께하는 분위기가 잘 맞아요";
  }
  if (dnaTitle) {
    return `${dnaTitle} 성향과 잘 맞는 ${activity.title.includes("산책") ? "걷기" : "활동"}이에요`;
  }
  return activity.aiReason ?? "오늘 둘러보기 좋은 활동이에요";
}

export type PersonalizedInput = {
  interestSlugs: string[];
  questionAnswer: string | null;
  mood: string | null;
  ieumCode: string | null;
  dnaTitle: string | null;
  region?: string | null;
};

export type PersonalizedPick = BrowseActivity & { personalReason: string };

export function getPersonalizedTodayPicks(
  input: PersonalizedInput,
  limit = 6,
): PersonalizedPick[] {
  const weights = new Map<string, number>();

  for (const slug of input.interestSlugs) {
    slugBoost(slug, weights, 3);
  }

  if (input.questionAnswer) {
    for (const slug of ANSWER_INTERESTS[input.questionAnswer] ?? [input.questionAnswer]) {
      slugBoost(slug, weights, 4);
    }
  }

  if (input.mood) {
    for (const slug of MOOD_INTERESTS[input.mood] ?? []) {
      slugBoost(slug, weights, 3);
    }
  }

  if (input.ieumCode?.startsWith("A")) {
    slugBoost("exercise", weights, 1);
    slugBoost("hiking", weights, 1);
  }
  if (input.ieumCode?.startsWith("P")) {
    slugBoost("reading", weights, 1);
    slugBoost("coffee", weights, 1);
  }
  if (input.ieumCode?.includes("C")) {
    slugBoost("volunteer", weights, 1);
    slugBoost("food", weights, 1);
  }

  const region = input.region?.split(" ").pop();

  const scored = BROWSE_CATALOG.map((activity) => {
    let score = weights.get(activity.interestSlug) ?? 0;
    if (region && activity.region === region) score += 2;
    if (activity.isPopular) score += 1;
    if (activity.beginnerFriendly) score += 0.5;
    return { activity, score };
  });

  scored.sort((a, b) => b.score - a.score || b.activity.reviewCount - a.activity.reviewCount);

  const top = scored.filter((s) => s.score > 0).slice(0, limit);
  const source =
    top.length >= limit
      ? top
      : [...top, ...scored.filter((s) => !top.includes(s))].slice(0, limit);

  return source.map(({ activity }) => ({
    ...activity,
    personalReason: buildReason(activity, input.dnaTitle, input.mood),
  }));
}

export function parseDailyAnswer(raw: string | null): {
  answer: string | null;
  mood: string | null;
} {
  if (!raw) return { answer: null, mood: null };
  try {
    const parsed = JSON.parse(raw) as { a?: string; m?: string };
    if (parsed.a) {
      return { answer: parsed.a, mood: parsed.m ?? null };
    }
  } catch {
    /* legacy plain answer */
  }
  return { answer: raw, mood: null };
}
