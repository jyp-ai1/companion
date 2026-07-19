import type { Meetup, MeetupCategory } from "@/lib/types";

export function rankMeetups(
  meetups: Meetup[],
  categories: MeetupCategory[],
  region: string | null,
  limit = 5,
): Meetup[] {
  const regionKey = region?.replace(/\s/g, "") ?? "";

  const scored = meetups.map((m) => {
    let score = 0;
    const catIdx = categories.indexOf(m.category);
    if (catIdx >= 0) score += 100 - catIdx * 10;

    const meetupRegion = m.region.replace(/\s/g, "");
    if (regionKey && meetupRegion.includes(regionKey)) score += 50;
    else if (regionKey && regionKey.includes(meetupRegion.split(" ").pop() ?? ""))
      score += 30;

    if (m.scheduled_at) {
      const days = (new Date(m.scheduled_at).getTime() - Date.now()) / 86400000;
      if (days >= 0 && days <= 14) score += 20;
    }

    return { meetup: m, score };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.meetup);
}
