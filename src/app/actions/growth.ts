"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { generateFriendInviteMessage, generateInvitationMessage } from "@/lib/ieum/growth";
import type { GrowthEventType } from "@/lib/ieum/growth";

function randomCode() {
  return Math.random().toString(36).slice(2, 10);
}

export async function completeReferralSignup(code: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "로그인 필요" };

  try {
    const { data: link } = await supabase
      .from("invite_links")
      .select("use_count")
      .eq("code", code)
      .maybeSingle();

    if (link) {
      await supabase
        .from("invite_links")
        .update({ use_count: (link.use_count ?? 0) + 1 })
        .eq("code", code);
    }

    await logGrowthEvent("referral_signup", { code, user_id: user.id });
    await logGrowthEvent("viral_loop_complete", {
      code,
      loop: "Invitation → New User",
    });
  } catch {
    /* optional until migration */
  }

  return { ok: true };
}

export async function logGrowthEvent(
  eventType: GrowthEventType,
  metadata: Record<string, unknown> = {},
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  try {
    await supabase.from("growth_events").insert({
      user_id: user?.id ?? null,
      event_type: eventType,
      metadata,
    });
  } catch {
    /* optional until migration */
  }
}

export async function createTogetherRequest(input: {
  interestSlug: string;
  locationName: string;
  startsAt: string;
  durationMinutes: number;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "로그인 필요" };

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("region, display_name")
    .eq("id", user.id)
    .single();

  const message = generateInvitationMessage(
    input.interestSlug,
    input.durationMinutes,
    input.locationName,
  );

  const title = `${activityTitle(input.interestSlug)} · 같이 하실 분 찾습니다`;

  const { data, error } = await supabase
    .from("open_activities")
    .insert({
      creator_id: user.id,
      title,
      location_name: input.locationName,
      region: profile?.region,
      interest_slug: input.interestSlug,
      starts_at: input.startsAt,
      duration_minutes: input.durationMinutes,
      max_participants: 4,
      invitation_message: message,
      is_anonymous: true,
    })
    .select("id")
    .single();

  if (error) return { error: "생성 실패" };

  await logGrowthEvent("invite_created", {
    open_activity_id: data.id,
    interest: input.interestSlug,
  });

  revalidatePath("/home");
  revalidatePath("/invite");
  return { ok: true, id: data.id, message };
}

function activityTitle(slug: string): string {
  const map: Record<string, string> = {
    walk: "30분 걷기",
    coffee: "커피 한 잔",
    movie: "영화 보기",
    culture: "문화 나누기",
  };
  return map[slug] ?? "함께하기";
}

export async function createFriendInviteLink(interestSlug: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "로그인 필요" };

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("display_name")
    .eq("id", user.id)
    .single();

  const message = generateFriendInviteMessage(
    interestSlug,
    profile?.display_name ?? "이웃",
  );
  const code = randomCode();

  const { data, error } = await supabase
    .from("invite_links")
    .insert({
      code,
      inviter_id: user.id,
      interest_slug: interestSlug,
      message,
    })
    .select("code")
    .single();

  if (error) return { error: "링크 생성 실패" };

  await logGrowthEvent("invite_shared", { code, interest: interestSlug });

  const base =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://companion-two-sepia.vercel.app";
  return { ok: true, url: `${base}/invite/${data.code}`, message };
}

export async function joinTogetherRequest(activityId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "로그인 필요" };

  const { error } = await supabase.from("open_activity_participants").upsert({
    open_activity_id: activityId,
    user_id: user.id,
  });

  if (error) return { error: "참여 실패" };

  await logGrowthEvent("invite_accepted", { open_activity_id: activityId });
  await logGrowthEvent("activity_join", { open_activity_id: activityId });

  revalidatePath("/home");
  return { ok: true };
}

export async function consentProfileReveal(peerUserId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "로그인 필요" };

  const { data: existing } = await supabase
    .from("profile_reveals")
    .select("*")
    .or(
      `and(user_id.eq.${user.id},peer_user_id.eq.${peerUserId}),and(user_id.eq.${peerUserId},peer_user_id.eq.${user.id})`,
    )
    .maybeSingle();

  if (existing) {
    const isUserRow = existing.user_id === user.id;
    await supabase
      .from("profile_reveals")
      .update(
        isUserRow
          ? { user_consented: true, revealed_at: new Date().toISOString() }
          : { peer_consented: true, revealed_at: new Date().toISOString() },
      )
      .eq("user_id", existing.user_id)
      .eq("peer_user_id", existing.peer_user_id);
  } else {
    await supabase.from("profile_reveals").insert({
      user_id: user.id,
      peer_user_id: peerUserId,
      user_consented: true,
    });
  }

  await logGrowthEvent("profile_reveal", { peer_user_id: peerUserId });
  revalidatePath("/together");
  revalidatePath("/people");
  revalidatePath(`/people/${peerUserId}`);
  return { ok: true };
}
