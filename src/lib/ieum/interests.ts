import type { MeetupCategory } from "@/lib/types";

export type InterestTag = {
  slug: string;
  label: string;
  emoji: string;
};

export const INTEREST_TAGS: InterestTag[] = [
  { slug: "coffee", label: "커피", emoji: "☕" },
  { slug: "walk", label: "걷기", emoji: "🚶" },
  { slug: "travel", label: "여행", emoji: "🚌" },
  { slug: "pet", label: "반려동물", emoji: "🐾" },
  { slug: "movie", label: "영화", emoji: "🎬" },
  { slug: "photo", label: "사진", emoji: "📷" },
  { slug: "health", label: "건강", emoji: "💪" },
  { slug: "volunteer", label: "봉사", emoji: "🤝" },
  { slug: "music", label: "음악", emoji: "🎵" },
  { slug: "exhibition", label: "전시", emoji: "🎨" },
  { slug: "food", label: "맛집", emoji: "🍽" },
  { slug: "reading", label: "독서", emoji: "📚" },
  { slug: "hiking", label: "등산", emoji: "⛰️" },
  { slug: "garden", label: "원예", emoji: "🌱" },
  { slug: "cooking", label: "요리", emoji: "🍳" },
  { slug: "dance", label: "댄스", emoji: "💃" },
  { slug: "golf", label: "골프", emoji: "⛳" },
  { slug: "fishing", label: "낚시", emoji: "🎣" },
  { slug: "craft", label: "공예", emoji: "🧵" },
  { slug: "nature", label: "자연", emoji: "🌿" },
  { slug: "family", label: "가족", emoji: "👨‍👩‍👧" },
  { slug: "exercise", label: "운동", emoji: "🏃" },
  { slug: "culture", label: "문화", emoji: "🎭" },
  { slug: "writing", label: "글쓰기", emoji: "✍️" },
];

export const INTEREST_TO_CATEGORY: Record<string, MeetupCategory> = {
  coffee: "cafe",
  walk: "walking",
  travel: "travel",
  movie: "culture",
  photo: "culture",
  health: "health",
  volunteer: "social",
  music: "culture",
  exhibition: "culture",
  food: "cafe",
  reading: "reading",
  hiking: "hiking",
  garden: "health",
  cooking: "social",
  dance: "exercise",
  golf: "exercise",
  fishing: "social",
  craft: "class",
  nature: "walking",
  family: "social",
  exercise: "exercise",
  culture: "culture",
  writing: "writing",
  pet: "social",
};

export function getInterestLabel(slug: string): string {
  return INTEREST_TAGS.find((t) => t.slug === slug)?.label ?? slug;
}

export function getInterestEmoji(slug: string): string {
  return INTEREST_TAGS.find((t) => t.slug === slug)?.emoji ?? "✨";
}

export function interestsToCategories(slugs: string[]): MeetupCategory[] {
  const cats = slugs.map((s) => INTEREST_TO_CATEGORY[s]).filter(Boolean);
  return [...new Set(cats)];
}
