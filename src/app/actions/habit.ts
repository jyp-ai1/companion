"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

async function logRecommendationEvent(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  event: { event_type: string; item_type: string; item_id: string; metadata?: object },
) {
  try {
    await supabase.from("recommendation_events").insert({
      user_id: userId,
      ...event,
    });
  } catch {
    /* table may not exist before migration */
  }
}

export async function recordDailyCheckin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  try {
    await supabase.from("habit_checkins").upsert({
      user_id: user.id,
      checkin_date: new Date().toISOString().slice(0, 10),
    });
  } catch {
    /* habit tables optional until migration */
  }
}

export async function submitDailyCheckIn(
  questionKey: string,
  answer: string,
  mood: string,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "로그인 필요" };

  const payload = JSON.stringify({ a: answer, m: mood });

  const { error } = await supabase.from("daily_question_responses").upsert({
    user_id: user.id,
    question_key: questionKey,
    answer: payload,
    response_date: new Date().toISOString().slice(0, 10),
  });

  await logRecommendationEvent(supabase, user.id, {
    event_type: "click",
    item_type: "feed",
    item_id: `daily_checkin:${answer}:${mood}`,
    metadata: { question_key: questionKey, answer, mood },
  });

  revalidatePath("/home");
  return error ? { error: "저장 실패" } : { ok: true };
}

export async function submitDailyQuestion(questionKey: string, answer: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "로그인 필요" };

  const { error } = await supabase.from("daily_question_responses").upsert({
    user_id: user.id,
    question_key: questionKey,
    answer,
    response_date: new Date().toISOString().slice(0, 10),
  });

  await logRecommendationEvent(supabase, user.id, {
    event_type: "click",
    item_type: "feed",
    item_id: `daily_question:${answer}`,
    metadata: { question_key: questionKey },
  });

  revalidatePath("/home");
  return error ? { error: "저장 실패" } : { ok: true };
}

export async function submitMicroAction(actionKey: string, response: "yes" | "later") {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "로그인 필요" };

  await supabase.from("micro_action_responses").upsert({
    user_id: user.id,
    action_key: actionKey,
    response,
    response_date: new Date().toISOString().slice(0, 10),
  });

  await logRecommendationEvent(supabase, user.id, {
    event_type: response === "yes" ? "click" : "dismiss",
    item_type: "activity",
    item_id: actionKey,
  });

  revalidatePath("/home");
  return { ok: true };
}

export async function joinOpenActivity(activityId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "로그인 필요" };

  const { error } = await supabase.from("open_activity_participants").upsert({
    open_activity_id: activityId,
    user_id: user.id,
  });

  await logRecommendationEvent(supabase, user.id, {
    event_type: "join",
    item_type: "activity",
    item_id: activityId,
  });

  revalidatePath("/home");
  return error ? { error: "참여 실패" } : { ok: true };
}
