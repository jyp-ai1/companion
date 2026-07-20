import { createClient } from "@/lib/supabase/server";
import { buildRelationshipCoach } from "@/lib/ieum/relationship-coach";
import {
  buildRelationshipTimeline,
  inferRelationshipStatus,
  maskName,
  type TogetherConnection,
} from "@/lib/ieum/relationships";
import { buildSocialHealthReport } from "@/lib/ieum/social-health";
import type { MeetupCategory } from "@/lib/types";

type ConnectionRow = {
  peer_id: string;
  display_name: string | null;
  age_group: string | null;
  meet_count: number;
  first_met_at: string | null;
  last_met_at: string | null;
  last_activity: string | null;
  last_category: MeetupCategory | null;
};

export async function getTogetherContext() {
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

  const { data: connRaw, error: connError } = await supabase.rpc("get_together_connections");
  const connections: TogetherConnection[] = (connError ? [] : (connRaw ?? [])).map(
    (r: ConnectionRow) => ({
      ...r,
      meet_count: Number(r.meet_count),
      status: inferRelationshipStatus(Number(r.meet_count)),
    }),
  );

  const { data: monthRaw } = await supabase.rpc("get_together_monthly_stats");
  const month = monthRaw?.[0] as
    | { people_count: number; activity_count: number; new_people: number }
    | undefined;

  const { data: interestRows } = await supabase
    .from("user_interests")
    .select("interest_slug")
    .eq("user_id", user.id);

  const { data: parts } = await supabase
    .from("participations")
    .select("created_at, status")
    .eq("user_id", user.id)
    .in("status", ["confirmed", "completed"]);

  const now = new Date();
  const thisMonth = (parts ?? []).filter((p) => {
    const d = new Date(p.created_at);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonth = (parts ?? []).filter((p) => {
    const d = new Date(p.created_at);
    return d.getMonth() === lastMonthDate.getMonth() && d.getFullYear() === lastMonthDate.getFullYear();
  }).length;

  const completedCount = (parts ?? []).filter((p) => p.status === "completed").length;
  const activityDrop = thisMonth < lastMonth && lastMonth > 0;

  let againYesPeerIds: string[] = [];
  try {
    const { data: againRows } = await supabase
      .from("again_together")
      .select("peer_user_id")
      .eq("user_id", user.id)
      .eq("choice", "yes");
    againYesPeerIds = (againRows ?? []).map((r) => r.peer_user_id as string);
  } catch {
    againYesPeerIds = [];
  }

  const socialHealth = buildSocialHealthReport({
    monthlyActivities: Number(month?.activity_count ?? thisMonth),
    lastMonthActivities: lastMonth,
    peopleTogether: Number(month?.people_count ?? connections.length),
    newConnections: Number(month?.new_people ?? 0),
    streakWeeks: Math.min(4, completedCount),
    interestCount: interestRows?.length ?? 0,
    completedTotal: completedCount,
  });

  const coach = buildRelationshipCoach(
    connections,
    profile?.display_name ?? "회원",
    activityDrop,
    againYesPeerIds,
  );

  const topConnections = connections.slice(0, 5);
  const frequent = [...connections].sort((a, b) => b.meet_count - a.meet_count).slice(0, 5);

  const { data: recentParts } = await supabase
    .from("participations")
    .select("*, meetups(title, category, scheduled_at)")
    .eq("user_id", user.id)
    .in("status", ["confirmed", "completed"])
    .order("created_at", { ascending: false })
    .limit(5);

  return {
    user,
    profile,
    connections,
    topConnections,
    frequent,
    monthlyPeople: Number(month?.people_count ?? connections.length),
    monthlyNewFriends: Number(month?.new_people ?? 0),
    regularCount: connections.filter((c) => c.status === "regular" || c.status === "friend").length,
    socialHealth,
    coach,
    recentActivities: recentParts ?? [],
  };
}

export async function getRelationshipDetail(peerId: string) {
  const supabase = await createClient();
  const ctx = await getTogetherContext();
  if (!ctx) return null;

  const connection = ctx.connections.find((c) => c.peer_id === peerId);
  if (!connection) return null;

  const { data: timelineRaw } = await supabase.rpc("get_relationship_timeline", {
    peer_uuid: peerId,
  });

  const activities = (timelineRaw ?? []) as {
    meetup_id: string;
    title: string;
    category: MeetupCategory;
    activity_at: string;
  }[];

  const timeline = buildRelationshipTimeline(connection, activities);

  return {
    ...ctx,
    connection,
    timeline,
    peerName: maskName(connection.display_name),
  };
}
