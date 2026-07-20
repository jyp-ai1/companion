import { INTEREST_TAGS } from "@/lib/ieum/interests";
import type { BrowseActivity, BrowseFilter } from "@/lib/browse/types";
import { BROWSE_REGIONS } from "@/lib/browse/types";

const TITLE_PARTS: Record<string, string[]> = {
  walk: ["호수공원 산책", "동네 한 바퀴", "30분 걷기", "저녁 산책", "아침 걷기"],
  coffee: ["브런치", "커피 한 잔", "카페 수다", "디저트 타임", "오후 커피"],
  movie: ["영화 보기", "독립영화", "클래식 영화", "영화 후 수다", "극장 나들이"],
  reading: ["독서 모임", "책 이야기", "에세이 나눔", "도서관 함께", "한 권 읽기"],
  travel: ["근교 나들이", "버스 여행", "동네 탐방", "공원 피크닉", "가볍게 나들이"],
  photo: ["사진 산책", "풍경 담기", "출사", "스마트폰 사진", "공원 촬영"],
  exercise: ["가벼운 운동", "스트레칭", "건강 체조", "공원 운동", "걷기 운동"],
  craft: ["공예 체험", "도자기", "손뜨개", "만들기", "공방 체험"],
  culture: ["전시 관람", "문화 나들이", "박물관", "공연 보기", "문화 산책"],
  food: ["맛집 탐방", "점심 함께", "동네 맛집", "시장 구경", "맛집 산책"],
  music: ["음악 감상", "노래방", "악기 이야기", "클래식", "합창"],
  garden: ["원예 체험", "화분 가꾸기", "텃밭", "식물 나눔", "공원 정원"],
  volunteer: ["봉사 함께", "지역 봉사", "환경 정화", "나눔 활동", "봉사 산책"],
  hiking: ["등산", "초보 등산", "둘레길", "숲길 걷기", "가벼운 등산"],
  pet: ["반려견 산책", "펫 카페", "강아지 산책", "반려동물 교류", "공원 산책"],
  health: ["건강 대화", "건강 체조", "명상 산책", "건강 관리", "웰니스"],
  cooking: ["요리 함께", "홈쿡", "레시피 나눔", "요리 체험", "간단 요리"],
  writing: ["글쓰기", "일기 나눔", "에세이", "기록하기", "글 모임"],
  nature: ["자연 산책", "숲 체험", "생태 공원", "자연 관찰", "공원 힐링"],
  family: ["가족 나들이", "세대 교류", "손주 산책", "가족 대화", "동행"],
  dance: ["댄스", "라인댄스", "가벼운 춤", "리듬 운동", "춤 배우기"],
  golf: ["스크린 골프", "골프 이야기", "퍼팅", "골프 입문", "연습"],
  fishing: ["낚시", "저수지", "낚시 이야기", "가벼운 낚시", "힐링 낚시"],
  exhibition: ["전시회", "미술관", "갤러리", "전시 산책", "작품 감상"],
};

const SUPPLIES = ["편한 신발", "물병", "가벼운 외투", "마음만 준비", "스마트폰"];
const HOST_BADGES = ["🌱 첫걸음", "🌿 꾸준한 동행", "🌳 믿음직한 이웃", "💬 따뜻한 후기"];
const AI_REASONS = [
  "걷기를 좋아하신다면 잘 맞아요",
  "커피 관심사가 비슷해요",
  "오늘 날씨에 딱 맞는 활동이에요",
  "가볍게 시작하기 좋아요",
  "비슷한 연령대가 많이 참여해요",
];

const REVIEW_SNIPPETS = [
  "편안하게 대화 나눴어요",
  "처음인데 부담 없었어요",
  "다음에 또 하고 싶어요",
  "좋은 분을 만났어요",
  "오늘 하루가 따뜻해졌어요",
];

function pick<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length];
}

function generateCatalog(): BrowseActivity[] {
  const items: BrowseActivity[] = [];
  let n = 0;

  for (const tag of INTEREST_TAGS) {
    const parts = TITLE_PARTS[tag.slug] ?? ["함께하기", "동행", "가볍게", "오늘", "초보 환영"];
    for (let i = 0; i < 17; i++) {
      const region = pick([...BROWSE_REGIONS], n + i);
      const part = pick(parts, n);
      const dayOffset = (n % 14) - 2;
      const date = new Date();
      date.setDate(date.getDate() + dayOffset);
      date.setHours(10 + (n % 8), (n % 4) * 15, 0, 0);

      items.push({
        id: `browse-${tag.slug}-${i}`,
        title: `${region} ${part}`,
        description: `${tag.label} 좋아하는 분들과 부담 없이 함께하는 활동입니다. 처음이어도 괜찮아요.`,
        interestSlug: tag.slug,
        region,
        locationName: `${region} ${pick(["공원", "카페", "문화센터", "호수공원", "도서관"], n)}`,
        scheduledAt: date.toISOString(),
        durationMinutes: 30 + (n % 4) * 15,
        participantCount: 1 + (n % 6),
        maxParticipants: 4 + (n % 3),
        reviewCount: 3 + (n % 28),
        difficulty: n % 5 === 0 ? "active" : n % 3 === 0 ? "normal" : "easy",
        supplies: [pick(SUPPLIES, n), pick(SUPPLIES, n + 1)],
        hostLabel: `${pick(["60대", "50대", "55대"], n)} · ${region}`,
        hostBadge: pick(HOST_BADGES, n),
        aiReason: pick(AI_REASONS, n),
        isNew: dayOffset >= 0 && dayOffset <= 2,
        isPopular: n % 7 === 0,
        isFree: n % 4 !== 0,
        beginnerFriendly: n % 2 === 0,
        emoji: tag.emoji,
        reviewSnippet: pick(REVIEW_SNIPPETS, n),
        reviewAuthor: pick(["익명 동행", "이웃", "함께한 분"], n),
      });
      n++;
    }
  }

  return items;
}

export const BROWSE_CATALOG: BrowseActivity[] = generateCatalog();

export function getActivityById(id: string): BrowseActivity | undefined {
  return BROWSE_CATALOG.find((a) => a.id === id);
}

export function filterActivities(
  catalog: BrowseActivity[],
  filter: BrowseFilter,
): BrowseActivity[] {
  let list = [...catalog];

  if (filter.category && filter.category !== "all") {
    if (filter.category === "other") {
      const main = new Set(["walk", "coffee", "movie", "exercise", "culture", "photo", "travel", "volunteer", "reading", "craft", "food"]);
      list = list.filter((a) => !main.has(a.interestSlug));
    } else {
      list = list.filter((a) => a.interestSlug === filter.category);
    }
  }

  if (filter.region) {
    list = list.filter((a) => a.region.includes(filter.region!));
  }

  if (filter.q) {
    const q = filter.q.toLowerCase();
    list = list.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.region.includes(q) ||
        a.locationName.includes(q),
    );
  }

  if (filter.price === "free") {
    list = list.filter((a) => a.isFree);
  } else if (filter.price === "paid") {
    list = list.filter((a) => !a.isFree);
  }

  if (filter.beginner) {
    list = list.filter((a) => a.beginnerFriendly);
  }

  const now = new Date();
  if (filter.when === "today") {
    list = list.filter((a) => {
      const d = new Date(a.scheduledAt);
      return d.toDateString() === now.toDateString();
    });
  } else if (filter.when === "week") {
    const weekEnd = new Date(now);
    weekEnd.setDate(weekEnd.getDate() + 7);
    list = list.filter((a) => {
      const d = new Date(a.scheduledAt);
      return d >= now && d <= weekEnd;
    });
  }

  switch (filter.sort) {
    case "popular":
      list.sort((a, b) => b.participantCount + b.reviewCount - (a.participantCount + a.reviewCount));
      break;
    case "new":
      list.sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime());
      break;
    case "near":
      list.sort((a, b) => a.region.localeCompare(b.region));
      break;
    case "ai":
    default:
      list.sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0));
      break;
  }

  return list;
}

export function paginateActivities(list: BrowseActivity[], page: number, pageSize = 12) {
  const start = page * pageSize;
  return {
    items: list.slice(start, start + pageSize),
    hasMore: start + pageSize < list.length,
    total: list.length,
  };
}

export function getPopularToday(limit = 8) {
  return BROWSE_CATALOG.filter((a) => a.isPopular)
    .slice(0, limit)
    .concat(BROWSE_CATALOG.slice(0, limit))
    .slice(0, limit);
}

export function getNewTogether(limit = 6) {
  return BROWSE_CATALOG.filter((a) => a.isNew).slice(0, limit);
}

export function getWeeklyPicks(limit = 6) {
  return BROWSE_CATALOG.filter((_, i) => i % 11 === 0).slice(0, limit);
}

export function getRegionalPicks(region?: string, limit = 4) {
  const r = region ?? "하남";
  return BROWSE_CATALOG.filter((a) => a.region === r).slice(0, limit);
}

export function getPopularReviews(limit = 4) {
  return BROWSE_CATALOG.filter((a) => a.reviewCount >= 10)
    .sort((a, b) => b.reviewCount - a.reviewCount)
    .slice(0, limit);
}

export function getSimilarActivities(activity: BrowseActivity, limit = 4) {
  return BROWSE_CATALOG.filter(
    (a) => a.interestSlug === activity.interestSlug && a.id !== activity.id,
  ).slice(0, limit);
}

export function getMostViewedThisWeek(limit = 6) {
  return [...BROWSE_CATALOG]
    .sort((a, b) => b.reviewCount + b.participantCount - (a.reviewCount + a.participantCount))
    .slice(0, limit);
}

export type NewMember = {
  id: string;
  name: string;
  region: string;
  interest: string;
  emoji: string;
};

const NEW_MEMBERS: NewMember[] = [
  { id: "m1", name: "정**", region: "하남", interest: "걷기", emoji: "🚶" },
  { id: "m2", name: "김**", region: "미사", interest: "카페", emoji: "☕" },
  { id: "m3", name: "이**", region: "강동", interest: "독서", emoji: "📚" },
  { id: "m4", name: "박**", region: "송파", interest: "사진", emoji: "📷" },
  { id: "m5", name: "최**", region: "남양주", interest: "봉사", emoji: "🙏" },
];

export function getNewMembersToday(limit = 5) {
  return NEW_MEMBERS.slice(0, limit);
}

export function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "좋은 아침입니다";
  if (h < 18) return "좋은 오후입니다";
  return "좋은 저녁입니다";
}
