import { getInterestLabel } from "@/lib/ieum/interests";

export type AnonymousProfile = {
  age_group: string | null;
  region_short: string | null;
  interests: string[];
  label: string;
};

export function regionShort(region: string | null): string | null {
  if (!region) return null;
  const parts = region.split(" ");
  return parts.length >= 2 ? parts[parts.length - 1] : region;
}

export function buildAnonymousLabel(
  ageGroup: string | null,
  region: string | null,
  interestSlugs: string[],
): string {
  const parts: string[] = [];
  if (ageGroup) parts.push(ageGroup);
  const r = regionShort(region);
  if (r) parts.push(r);
  if (interestSlugs[0]) {
    parts.push(`${getInterestLabel(interestSlugs[0])} 좋아함`);
  }
  if (interestSlugs[1]) {
    parts.push(`${getInterestLabel(interestSlugs[1])} 좋아함`);
  }
  return parts.join(" · ") || "이웃";
}

export function toAnonymousProfile(input: {
  age_group: string | null;
  region: string | null;
  interest_slugs: string[];
}): AnonymousProfile {
  return {
    age_group: input.age_group,
    region_short: regionShort(input.region),
    interests: input.interest_slugs.slice(0, 4).map(getInterestLabel),
    label: buildAnonymousLabel(input.age_group, input.region, input.interest_slugs),
  };
}

export function isProfileRevealed(
  reveals: { user_consented: boolean; peer_consented: boolean } | null,
): boolean {
  return Boolean(reveals?.user_consented && reveals?.peer_consented);
}
