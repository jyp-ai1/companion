import { getInterestLabel, INTEREST_TAGS } from "@/lib/ieum/interests";

export type MatchProfile = {
  id: string;
  display_name: string | null;
  age_group: string | null;
  region: string | null;
  activity_score: number;
  relationship_score: number;
  ieum_code: string | null;
  dna_title: string | null;
  interest_slugs: string[];
  created_at: string;
};

export type SimilarPerson = MatchProfile & {
  similarity: number;
  sharedInterests: string[];
};

function regionOverlap(a: string | null, b: string | null): boolean {
  if (!a || !b) return false;
  if (a === b) return true;
  const aPart = a.split(" ").pop() ?? "";
  const bPart = b.split(" ").pop() ?? "";
  return a.includes(bPart) || b.includes(aPart);
}

export function calculateSimilarity(
  myInterests: string[],
  myProfile: {
    activity_score: number;
    relationship_score: number;
    region: string | null;
  },
  peer: MatchProfile,
): { similarity: number; sharedInterests: string[] } {
  const shared = myInterests.filter((i) => peer.interest_slugs.includes(i));
  const union = new Set([...myInterests, ...peer.interest_slugs]).size;
  const jaccard = union > 0 ? shared.length / union : 0;

  let score = jaccard * 55;
  score += (1 - Math.abs(myProfile.activity_score - Number(peer.activity_score))) * 15;
  score += (1 - Math.abs(myProfile.relationship_score - Number(peer.relationship_score))) * 15;
  if (regionOverlap(myProfile.region, peer.region)) score += 15;

  const similarity = Math.round(Math.min(99, Math.max(62, score + 20)));

  return { similarity, sharedInterests: shared };
}

export function rankSimilarPeople(
  myInterests: string[],
  myProfile: {
    activity_score: number;
    relationship_score: number;
    region: string | null;
  },
  peers: MatchProfile[],
  limit = 20,
): SimilarPerson[] {
  return peers
    .map((peer) => {
      const { similarity, sharedInterests } = calculateSimilarity(
        myInterests,
        myProfile,
        peer,
      );
      return { ...peer, similarity, sharedInterests };
    })
    .filter((p) => p.sharedInterests.length > 0 || p.similarity >= 70)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit);
}

export function getCommonGroundLabels(sharedSlugs: string[]): string[] {
  return sharedSlugs.slice(0, 5).map(getInterestLabel);
}

export function getPeerPopularActivities(
  similarPeople: SimilarPerson[],
  interestToCategory: Record<string, string>,
): { slug: string; label: string; emoji: string; count: number }[] {
  const counts: Record<string, number> = {};
  for (const person of similarPeople) {
    for (const slug of person.interest_slugs) {
      counts[slug] = (counts[slug] ?? 0) + 1;
    }
  }

  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([slug, count]) => {
      const tag = INTEREST_TAGS.find((t) => t.slug === slug);
      return {
        slug,
        label: tag?.label ?? slug,
        emoji: tag?.emoji ?? "✨",
        count,
      };
    });
}
