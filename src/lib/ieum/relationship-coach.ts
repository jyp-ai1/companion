import { getInterestLabel } from "@/lib/ieum/interests";
import { maskName, type TogetherConnection } from "@/lib/ieum/relationships";
import { CATEGORY_LABELS } from "@/lib/types";
import type { MeetupCategory } from "@/lib/types";

export type RelationshipCoachMessage = {
  headline: string;
  body: string;
  peerName: string;
  peerId: string;
  ctaLabel: string;
  ctaHref: string;
  tone: "reconnect" | "deepen" | "welcome";
};

function daysSince(dateStr: string | null): number {
  if (!dateStr) return 999;
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
}

export function buildRelationshipCoach(
  connections: TogetherConnection[],
  myName: string,
  activityDrop: boolean,
  againYesPeerIds: string[] = [],
): RelationshipCoachMessage | null {
  if (connections.length === 0) {
    return {
      headline: "AI Relationship Coach",
      body: `${myName}님, 첫 활동을 함께하면 Life Graph가 시작됩니다. Discover에서 관심사가 맞는 이웃을 만나보세요.`,
      peerName: "",
      peerId: "",
      ctaLabel: "Discover",
      ctaHref: "/recommend",
      tone: "welcome",
    };
  }

  const sortedByGap = [...connections].sort(
    (a, b) => daysSince(b.last_met_at) - daysSince(a.last_met_at),
  );

  const againMatch = connections.find((c) => againYesPeerIds.includes(c.peer_id));
  if (againMatch) {
    const name = maskName(againMatch.display_name);
    return {
      headline: "AI Relationship Coach",
      body: `${name}님과 다시 함께하고 싶다고 남겨 주셨어요. 이번 주 가볍게 만나보실래요?`,
      peerName: name,
      peerId: againMatch.peer_id,
      ctaLabel: "다시 함께하기",
      ctaHref: `/together/${againMatch.peer_id}`,
      tone: "deepen",
    };
  }

  const reconnect = sortedByGap.find((c) => daysSince(c.last_met_at) >= 21);
  const regular = connections.find((c) => c.meet_count >= 2);

  if (activityDrop) {
    return {
      headline: "AI Relationship Coach",
      body: "요즘 활동이 조금 줄었어요. 이번 주 가벼운 산책은 어떠세요?",
      peerName: "",
      peerId: "",
      ctaLabel: "활동 찾기",
      ctaHref: "/home",
      tone: "reconnect",
    };
  }

  if (reconnect) {
    const name = maskName(reconnect.display_name);
    const cat = reconnect.last_category
      ? CATEGORY_LABELS[reconnect.last_category]
      : "산책";
    return {
      headline: "AI Relationship Coach",
      body: `최근 ${name}님과 한 달 동안 만나지 않았습니다. 이번 주 같이 ${cat}해보세요.`,
      peerName: name,
      peerId: reconnect.peer_id,
      ctaLabel: "다시 만나기",
      ctaHref: `/together/${reconnect.peer_id}`,
      tone: "reconnect",
    };
  }

  if (regular) {
    const name = maskName(regular.display_name);
    return {
      headline: "AI Relationship Coach",
      body: `${myName}님, 새로운 사람도 좋지만 최근 자주 만났던 ${name}님과 브런치를 추천드립니다.`,
      peerName: name,
      peerId: regular.peer_id,
      ctaLabel: "함께하기",
      ctaHref: `/together/${regular.peer_id}`,
      tone: "deepen",
    };
  }

  const top = connections[0];
  const name = maskName(top.display_name);
  return {
    headline: "AI Relationship Coach",
    body: `${name}님과의 관계가 시작되었습니다. 두 번째 활동을 함께하면 더 가까워집니다.`,
    peerName: name,
    peerId: top.peer_id,
    ctaLabel: "관계 보기",
    ctaHref: `/together/${top.peer_id}`,
    tone: "deepen",
  };
}

export function suggestReconnectActivity(category: MeetupCategory | null): string {
  if (!category) return "산책";
  if (category === "cafe") return "브런치";
  if (category === "walking") return "산책";
  if (category === "culture") return "영화";
  return CATEGORY_LABELS[category] ?? "활동";
}
