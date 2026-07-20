import { createClient } from "@/lib/supabase/server";
import { rankMeetups, scoreMeetupsForRecommend } from "@/lib/ieum/recommend";
import {
  buildActivityGraph,
  buildDynamicType,
  buildSocialImpactStats,
} from "@/lib/ieum/insights";
import { getActivityLevel, getBadges } from "@/lib/ieum/gamification";
import { getAiCoachMessage } from "@/lib/ieum/coach";
import {
  getInterestEmoji,
  getInterestLabel,
  interestsToCategories,
  INTEREST_TAGS,
} from "@/lib/ieum/interests";
import {
  getPeerPopularActivities,
  rankSimilarPeople,
  type MatchProfile,
} from "@/lib/ieum/similarity";
import { calculateCompatibility } from "@/lib/ieum/compatibility";
import {
  buildAIFeed,
  buildActivityProposals,
  buildTodayForYou,
} from "@/lib/ieum/discovery-engine";
import type { Meetup, MeetupCategory, TypeDefinition, UserProfile } from "@/lib/types";

type ParticipationRow = {
  id: string;
  status: string;
  created_at: string;
  meetups: Meetup | null;
};

export async function getUserDiscoveryContext() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { data: myInterestRows } = await supabase
    .from("user_interests")
    .select("interest_slug")
    .eq("user_id", user.id);

  const myInterests = myInterestRows?.map((r) => r.interest_slug) ?? [];

  const { data: peersRaw, error: peersError } = await supabase.rpc("get_matchable_profiles");
  const peers = peersError ? [] : ((peersRaw ?? []) as MatchProfile[]);

  const { data: similarCountRaw, error: countError } = await supabase.rpc(
    "count_similar_users",
    { min_shared: 1 },
  );
  const similarCount = countError
    ? peers.length
    : ((similarCountRaw as number) ?? peers.length);

  const { data: newTodayRaw } = await supabase.rpc("count_new_users_today");
  const newUsersToday = (newTodayRaw as number) ?? 0;

  const similarPeople = rankSimilarPeople(
    myInterests,
    {
      activity_score: Number(profile?.activity_score ?? 0.5),
      relationship_score: Number(profile?.relationship_score ?? 0.5),
      region: profile?.region ?? null,
    },
    peers,
    20,
  );

  const myProfileForCompat = {
    activity_score: Number(profile?.activity_score ?? 0.5),
    relationship_score: Number(profile?.relationship_score ?? 0.5),
    participation_score: Number(profile?.participation_score ?? 0.5),
    region: profile?.region ?? null,
  };

  const similarWithCompat = similarPeople.map((p) => ({
    ...p,
    compatibility: calculateCompatibility(myInterests, myProfileForCompat, p),
  }));

  const peerActivities = getPeerPopularActivities(similarPeople, {});

  const { data: allMeetups } = await supabase
    .from("meetups")
    .select("*")
    .eq("is_active", true)
    .order("scheduled_at", { ascending: true });

  const meetups = (allMeetups as Meetup[]) ?? [];

  const { data: parts } = await supabase
    .from("participations")
    .select("*, meetups(*)")
    .eq("user_id", user.id)
    .in("status", ["confirmed", "completed"])
    .order("created_at", { ascending: false });

  const participations = (parts ?? []) as ParticipationRow[];

  const { data: reviews } = await supabase
    .from("reviews")
    .select("rating, met_new_people, created_at")
    .eq("user_id", user.id);

  let typeDef: TypeDefinition | null = null;
  let categories: MeetupCategory[] = interestsToCategories(myInterests);

  if (profile?.type_code) {
    const { data: td } = await supabase
      .from("type_definitions")
      .select("*")
      .eq("type_code", profile.type_code)
      .single();
    typeDef = td as TypeDefinition | null;

    if (categories.length === 0) {
      const { data: rules } = await supabase
        .from("type_category_rules")
        .select("category")
        .eq("type_code", profile.type_code)
        .order("priority");
      categories = (rules?.map((r) => r.category) ?? []) as MeetupCategory[];
    }
  }

  const categoryCounts: Record<string, number> = {};
  for (const p of participations) {
    if (p.status === "completed" && p.meetups?.category) {
      categoryCounts[p.meetups.category] = (categoryCounts[p.meetups.category] ?? 0) + 1;
    }
  }

  const completedCount = participations.filter((p) => p.status === "completed").length;
  const dynamicType = buildDynamicType(
    profile?.ieum_code ?? profile?.type_code ?? null,
    profile?.dna_title ?? typeDef?.title ?? null,
    typeDef?.emoji ?? "🌿",
    categoryCounts,
    completedCount,
  );

  const evolvedCategories =
    categories.length > 0 ? categories : dynamicType.topCategories;

  const scoredMeetups = scoreMeetupsForRecommend(
    meetups,
    evolvedCategories,
    profile?.region ?? null,
  );

  const rankedMeetups = rankMeetups(meetups, evolvedCategories, profile?.region ?? null, 10);
  const counts: Record<string, number> = {};
  const scores: Record<string, number> = {};

  await Promise.all(
    meetups.map(async (m) => {
      const { data } = await supabase.rpc("get_meetup_participant_count", {
        meetup_uuid: m.id,
      });
      counts[m.id] = (data as number) ?? 0;
    }),
  );

  for (const s of scoredMeetups) {
    scores[s.meetup.id] = s.scorePercent;
  }

  const regionMeetups = meetups
    .filter(
      (m) =>
        profile?.region &&
        m.region.includes(profile.region.split(" ").pop() ?? ""),
    )
    .slice(0, 5);

  const popularMeetups = [...meetups]
    .sort(
      (a, b) =>
        (counts[b.id] ?? 0) - (counts[a.id] ?? 0) ||
        new Date(a.scheduled_at ?? 0).getTime() - new Date(b.scheduled_at ?? 0).getTime(),
    )
    .slice(0, 5);

  const newMeetups = [...meetups].reverse().slice(0, 5);

  const todayMeetups = meetups.filter((m) => {
    if (!m.scheduled_at) return false;
    const d = new Date(m.scheduled_at);
    const now = new Date();
    return (
      d.getFullYear() === now.getFullYear() &&
      d.getMonth() === now.getMonth() &&
      d.getDate() === now.getDate()
    );
  });

  const activityGraph = buildActivityGraph(categoryCounts);
  const activityLevel = getActivityLevel(completedCount);
  const badges = getBadges({
    completedCount,
    categoryCounts,
    streakWeeks: Math.min(completedCount, 4),
    metNewPeople: reviews?.filter((r) => r.met_new_people).length ?? 0,
  });

  const coach = getAiCoachMessage(
    profile?.display_name ?? "회원",
    dynamicType,
    evolvedCategories[0] ?? null,
    activityGraph.length >= 2 ? activityGraph[activityGraph.length - 1]?.category ?? null : null,
  );

  const suggestedInterests = INTEREST_TAGS.filter(
    (t) => !myInterests.includes(t.slug),
  ).slice(0, 4);

  const upcoming = participations.filter((p) => p.status === "confirmed");
  const completed = participations.filter((p) => p.status === "completed");

  const topMeetup = scoredMeetups[0] ?? null;
  const todayForYou = buildTodayForYou({
    profile: profile as UserProfile | null,
    myInterests,
    similarPeople,
    peerActivities,
    topMeetup,
  });
  const aiFeed = buildAIFeed({
    similarPeople,
    newUsersToday,
    peerActivities,
    newMeetups,
    suggestedInterests,
    topMeetup,
    myInterests,
  });
  const activityProposals = buildActivityProposals({
    myInterests,
    similarPeople,
  });

  return {
    user,
    profile: profile as UserProfile | null,
    myInterests,
    myInterestLabels: myInterests.map((s) => ({
      slug: s,
      label: getInterestLabel(s),
      emoji: getInterestEmoji(s),
    })),
    similarPeople,
    similarWithCompat,
    similarCount,
    newUsersToday,
    peerActivities,
    typeDef,
    categories: evolvedCategories,
    evolvedCategories,
    meetups,
    rankedMeetups,
    scoredMeetups,
    counts,
    scores,
    regionMeetups,
    popularMeetups,
    newMeetups,
    todayMeetups,
    participations,
    upcoming,
    completed,
    reviews: reviews ?? [],
    dynamicType,
    activityGraph,
    activityLevel,
    badges,
    coach,
    suggestedInterests,
    socialImpact: buildSocialImpactStats(participations, reviews ?? []),
    ieumCode: profile?.ieum_code ?? null,
    dnaTitle: profile?.dna_title ?? dynamicType.evolvedTitle,
    todayForYou,
    aiFeed,
    activityProposals,
    topMeetup,
  };
}
