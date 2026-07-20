import { createClient } from "@/lib/supabase/server";
import { recordDailyCheckin } from "@/app/actions/habit";
import {
  buildOpenActivityTitle,
  getTodayCardType,
  getTodayMicroAction,
  getTodayQuestion,
  type OpenActivityItem,
} from "@/lib/ieum/habit-engine";

export async function getHabitContext() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  await recordDailyCheckin();

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { data: interests } = await supabase
    .from("user_interests")
    .select("interest_slug")
    .eq("user_id", user.id);

  const topInterest = interests?.[0]?.interest_slug ?? "walk";
  const today = new Date();
  const cardType = getTodayCardType(today);
  const question = getTodayQuestion(today);
  const micro = getTodayMicroAction(topInterest, today);

  const { data: answeredQ } = await supabase
    .from("daily_question_responses")
    .select("answer")
    .eq("user_id", user.id)
    .eq("response_date", today.toISOString().slice(0, 10))
    .maybeSingle();

  const { data: answeredM } = await supabase
    .from("micro_action_responses")
    .select("response")
    .eq("user_id", user.id)
    .eq("action_key", micro.key)
    .eq("response_date", today.toISOString().slice(0, 10))
    .maybeSingle();

  let { data: openList } = await supabase
    .from("open_activities")
    .select("*")
    .eq("status", "open")
    .gte("starts_at", new Date().toISOString())
    .order("starts_at", { ascending: true })
    .limit(5);

  if (!openList?.length && profile?.region) {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const tomorrowStart = new Date(todayStart);
    tomorrowStart.setDate(tomorrowStart.getDate() + 1);

    const { count: todayCount } = await supabase
      .from("open_activities")
      .select("*", { count: "exact", head: true })
      .gte("starts_at", todayStart.toISOString())
      .lt("starts_at", tomorrowStart.toISOString());

    if ((todayCount ?? 0) === 0) {
      const regionPart = profile.region.split(" ").pop() ?? profile.region;
      const startsAt = new Date();
      startsAt.setHours(startsAt.getHours() + 2, 0, 0, 0);
      const seeds = [
        { slug: "walk", title: buildOpenActivityTitle("walk", `${regionPart} 근처`) },
        { slug: "coffee", title: buildOpenActivityTitle("coffee", "동네 카페") },
      ];
      for (let i = 0; i < seeds.length; i++) {
        const t = new Date(startsAt);
        t.setHours(t.getHours() + i * 2);
        await supabase.from("open_activities").insert({
          creator_id: user.id,
          title: seeds[i].title,
          location_name: regionPart,
          region: profile.region,
          interest_slug: seeds[i].slug,
          starts_at: t.toISOString(),
          duration_minutes: 30,
          max_participants: 6,
        });
      }
    }

    const { data: refreshed } = await supabase
      .from("open_activities")
      .select("*")
      .eq("status", "open")
      .gte("starts_at", new Date().toISOString())
      .order("starts_at", { ascending: true })
      .limit(5);
    openList = refreshed;
  }

  const openActivities: OpenActivityItem[] = [];
  for (const o of openList ?? []) {
    const { data: cnt } = await supabase.rpc("get_open_activity_participant_count", {
      activity_uuid: o.id,
    });
    openActivities.push({
      id: o.id,
      title: o.title,
      location_name: o.location_name,
      starts_at: o.starts_at,
      duration_minutes: o.duration_minutes,
      interest_slug: o.interest_slug,
      participant_count: (cnt as number) ?? 0,
      max_participants: o.max_participants,
      invitation_message: o.invitation_message ?? null,
    });
  }

  return {
    profile,
    cardType,
    question,
    micro,
    questionAnswered: answeredQ?.answer ?? null,
    microAnswered: answeredM?.response ?? null,
    openActivities,
    topOpen: openActivities[0] ?? null,
  };
}
