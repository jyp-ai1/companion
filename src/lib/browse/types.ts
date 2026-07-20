export type BrowseDifficulty = "easy" | "normal" | "active";

export type BrowseFilter = {
  category?: string;
  region?: string;
  when?: "today" | "week" | "all";
  sort?: "popular" | "near" | "ai" | "new";
  price?: "free" | "paid" | "all";
  beginner?: boolean;
  q?: string;
};

export type BrowseActivity = {
  id: string;
  title: string;
  description: string;
  interestSlug: string;
  region: string;
  locationName: string;
  scheduledAt: string;
  durationMinutes: number;
  participantCount: number;
  maxParticipants: number;
  reviewCount: number;
  difficulty: BrowseDifficulty;
  supplies: string[];
  hostLabel: string;
  hostBadge: string;
  aiReason?: string;
  isNew: boolean;
  isPopular: boolean;
  isFree: boolean;
  beginnerFriendly: boolean;
  emoji: string;
  reviewSnippet?: string;
  reviewAuthor?: string;
};

export const BROWSE_TABS = [
  { slug: "all", label: "전체" },
  { slug: "walk", label: "걷기" },
  { slug: "coffee", label: "커피" },
  { slug: "movie", label: "영화" },
  { slug: "exercise", label: "운동" },
  { slug: "culture", label: "문화" },
  { slug: "photo", label: "사진" },
  { slug: "travel", label: "여행" },
  { slug: "volunteer", label: "봉사" },
  { slug: "reading", label: "독서" },
  { slug: "craft", label: "공예" },
  { slug: "food", label: "맛집" },
  { slug: "other", label: "기타" },
] as const;

export const BROWSE_REGIONS = [
  "하남",
  "미사",
  "강동",
  "송파",
  "남양주",
  "성남",
  "광주",
] as const;
