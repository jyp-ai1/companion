import { getInterestEmoji, getInterestLabel, INTEREST_TO_CATEGORY } from "@/lib/ieum/interests";
import { generateMeetupWhy } from "@/lib/ieum/ai-summary";
import type { ScoredMeetup } from "@/lib/ieum/recommend";
import type { SimilarPerson } from "@/lib/ieum/similarity";
import type { Meetup, UserProfile } from "@/lib/types";
import { CATEGORY_LABELS } from "@/lib/types";

export type TodayCard = {
  id: string;
  type: "weather" | "empathy" | "weekly";
  icon: string;
  title: string;
  body: string;
  stat?: string;
  ctaLabel: string;
  ctaHref: string;
  reasons: string[];
};

export type AIFeedItem = {
  id: string;
  type:
    | "new_person"
    | "popular_interest"
    | "weekly_activity"
    | "new_activity"
    | "new_meetup"
    | "discovery";
  icon: string;
  headline: string;
  body: string;
  badge?: string;
  href: string;
  reasons?: string[];
};

function getWeatherHint(): { temp: number; label: string; walkGood: boolean } {
  const month = new Date().getMonth() + 1;
  const hour = new Date().getHours();
  const temp = month >= 5 && month <= 9 ? 26 : month >= 11 || month <= 2 ? 4 : 18;
  const walkGood = temp >= 10 && temp <= 30 && hour >= 8 && hour <= 18;
  return {
    temp,
    label: walkGood ? "산책하기 좋은 날입니다." : "실내 활동을 추천드립니다.",
    walkGood,
  };
}

function countPeersForInterest(
  similarPeople: SimilarPerson[],
  slug: string,
): number {
  return similarPeople.filter((p) => p.interest_slugs.includes(slug)).length;
}

export function buildTodayForYou(input: {
  profile: UserProfile | null;
  myInterests: string[];
  similarPeople: SimilarPerson[];
  peerActivities: { slug: string; label: string; emoji: string; count: number }[];
  topMeetup: ScoredMeetup | null;
}): TodayCard[] {
  const { profile, myInterests, similarPeople, peerActivities, topMeetup } = input;
  const weather = getWeatherHint();
  const walkSlug = myInterests.includes("walk") ? "walk" : myInterests[0] ?? "walk";
  const walkPeers = countPeersForInterest(similarPeople, walkSlug) || similarPeople.length;
  const coffeeSlug = myInterests.includes("coffee") ? "coffee" : peerActivities[0]?.slug ?? "coffee";
  const coffeeActivity = peerActivities.find((a) => a.slug === coffeeSlug) ?? peerActivities[0];
  const weeklyTop = peerActivities[0];

  const cards: TodayCard[] = [
    {
      id: "today-weather",
      type: "weather",
      icon: weather.walkGood ? "🚶" : "🌤",
      title: "오늘의 활동",
      body: weather.label,
      stat: `🌤 ${weather.temp}° · 비슷한 분 ${walkPeers}명이 ${getInterestLabel(walkSlug)} 활동`,
      ctaLabel: "같이 걸어보기",
      ctaHref: `/meetups?category=${INTEREST_TO_CATEGORY[walkSlug] ?? "walking"}`,
      reasons: [
        `✓ ${getInterestLabel(walkSlug)} 관심사`,
        weather.walkGood ? "✓ 오늘 날씨 적합" : "✓ 실내 대안 추천",
        `✓ 비슷한 이웃 ${walkPeers}명`,
        "✓ 거리·시간 적합",
      ],
    },
    {
      id: "today-empathy",
      type: "empathy",
      icon: "☕",
      title: "오늘의 공감",
      body: `${getInterestLabel(coffeeSlug)}를 좋아하는 분들이 오늘 가장 많이 참여한 활동입니다.`,
      stat: coffeeActivity ? `${coffeeActivity.count}명 참여` : undefined,
      ctaLabel: "활동 둘러보기",
      ctaHref: `/meetups?category=${coffeeSlug}`,
      reasons: [
        `✓ ${getInterestLabel(coffeeSlug)} 공통 관심`,
        "✓ 오늘 인기 활동",
        "✓ 비슷한 사람들 참여",
      ],
    },
    {
      id: "today-weekly",
      type: "weekly",
      icon: weeklyTop?.emoji ?? "🎬",
      title: "이번 주",
      body: "당신과 비슷한 사람들이 예약한 활동",
      stat: weeklyTop ? `${weeklyTop.label} · ${weeklyTop.count}명` : undefined,
      ctaLabel: "보러 가기",
      ctaHref: weeklyTop
        ? `/meetups?category=${INTEREST_TO_CATEGORY[weeklyTop.slug] ?? weeklyTop.slug}`
        : "/recommend",
      reasons: [
        "✓ 비슷한 관심사 그룹",
        "✓ 이번 주 인기",
        profile?.region ? "✓ 우리 동네" : "✓ 추천 활동",
      ],
    },
  ];

  if (topMeetup) {
    cards[0].reasons.push(
      `✓ ${CATEGORY_LABELS[topMeetup.meetup.category]} 모임 연결`,
    );
  }

  return cards;
}

export function buildAIFeed(input: {
  similarPeople: SimilarPerson[];
  newUsersToday: number;
  peerActivities: { slug: string; label: string; emoji: string; count: number }[];
  newMeetups: Meetup[];
  suggestedInterests: { slug: string; label: string; emoji: string }[];
  topMeetup: ScoredMeetup | null;
  myInterests: string[];
}): AIFeedItem[] {
  const items: AIFeedItem[] = [];
  const topPerson = input.similarPeople[0];

  if (topPerson) {
    items.push({
      id: `feed-person-${topPerson.id}`,
      type: "new_person",
      icon: "✨",
      headline: "오늘의 발견",
      body: `새로운 이웃 · 공통점 ${topPerson.similarity}%`,
      badge: `${topPerson.sharedInterests.length}개 공통 관심사`,
      href: `/people/${topPerson.id}`,
      reasons: topPerson.sharedInterests
        .slice(0, 3)
        .map((s) => `✓ ${getInterestLabel(s)}`),
    });
  }

  if (input.newUsersToday > 0) {
    items.push({
      id: "feed-new-users",
      type: "discovery",
      icon: "👋",
      headline: "오늘",
      body: `같은 관심사를 가진 새로운 분 ${input.newUsersToday}명이 가입했습니다.`,
      href: "/people",
    });
  }

  const hotInterest = input.peerActivities[0];
  if (hotInterest) {
    items.push({
      id: `feed-hot-${hotInterest.slug}`,
      type: "popular_interest",
      icon: hotInterest.emoji,
      headline: "오늘 인기 관심사",
      body: `${hotInterest.label} · ${hotInterest.count}명이 관심`,
      href: `/meetups?category=${hotInterest.slug}`,
      reasons: ["✓ 비슷한 이웃들 참여", "✓ 오늘 트렌드"],
    });
  }

  if (hotInterest) {
    items.push({
      id: `feed-weekly-${hotInterest.slug}`,
      type: "weekly_activity",
      icon: "📅",
      headline: "이번 주",
      body: `${hotInterest.label} 좋아하는 분들이 많이 모였습니다.`,
      href: `/meetups?category=${INTEREST_TO_CATEGORY[hotInterest.slug] ?? hotInterest.slug}`,
    });
  }

  if (input.newMeetups[0]) {
    const m = input.newMeetups[0];
    items.push({
      id: `feed-meetup-${m.id}`,
      type: "new_meetup",
      icon: "🆕",
      headline: "새로운 활동",
      body: m.title,
      href: `/meetups/${m.id}`,
      reasons: ["✓ 방금 등록됨", "✓ 관심사 연결"],
    });
  }

  if (input.suggestedInterests[0]) {
    const s = input.suggestedInterests[0];
    items.push({
      id: `feed-interest-${s.slug}`,
      type: "new_activity",
      icon: s.emoji,
      headline: "새로운 관심사",
      body: `${s.label} — 아직 탐색하지 않은 활동`,
      href: "/test",
    });
  }

  if (input.topMeetup) {
    items.push({
      id: `feed-why-${input.topMeetup.meetup.id}`,
      type: "new_meetup",
      icon: "💡",
      headline: "Why?",
      body: generateMeetupWhy(
        input.topMeetup.meetup,
        input.topMeetup.reasons,
        input.myInterests,
      ),
      href: `/meetups/${input.topMeetup.meetup.id}`,
      reasons: input.topMeetup.reasons,
    });
  }

  return items;
}

export function buildActivityProposals(input: {
  myInterests: string[];
  similarPeople: SimilarPerson[];
}): { interestSlug: string; label: string; emoji: string; count: number; title: string }[] {
  const counts: Record<string, number> = {};
  for (const slug of input.myInterests) {
    counts[slug] = input.similarPeople.filter((p) =>
      p.interest_slugs.includes(slug),
    ).length;
  }
  for (const p of input.similarPeople) {
    for (const slug of p.interest_slugs) {
      counts[slug] = (counts[slug] ?? 0) + 1;
    }
  }

  return Object.entries(counts)
    .filter(([, c]) => c >= 3)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([slug, count]) => ({
      interestSlug: slug,
      label: getInterestLabel(slug),
      emoji: getInterestEmoji(slug),
      count,
      title: `${getInterestLabel(slug)} 함께하기`,
    }));
}
