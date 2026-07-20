"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { AgainChoice, ReportReason, Satisfaction } from "@/lib/ieum/trust";
import { satisfactionToRating } from "@/lib/ieum/trust";

export async function markSafeGuideSeen() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  try {
    await supabase
      .from("user_profiles")
      .update({ safe_guide_seen_at: new Date().toISOString() })
      .eq("id", user.id);
  } catch {
    /* optional until migration */
  }
}

export async function submitMeetupReview(input: {
  meetupId: string;
  satisfaction: Satisfaction;
  comment: string;
  peerChoices: { peerUserId: string; choice: AgainChoice }[];
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "로그인 필요" };

  const { error } = await supabase.from("reviews").upsert(
    {
      user_id: user.id,
      meetup_id: input.meetupId,
      satisfaction: input.satisfaction,
      rating: satisfactionToRating(input.satisfaction),
      comment: input.comment.trim() || null,
      retry_intention: input.peerChoices.some((p) => p.choice === "yes"),
    },
    { onConflict: "user_id,meetup_id" },
  );

  if (error) return { error: "후기 저장 실패" };

  for (const peer of input.peerChoices) {
    try {
      await supabase.from("again_together").upsert(
        {
          user_id: user.id,
          peer_user_id: peer.peerUserId,
          source_type: "meetup",
          source_id: input.meetupId,
          choice: peer.choice,
        },
        { onConflict: "user_id,peer_user_id,source_type,source_id" },
      );
    } catch {
      /* optional until migration */
    }
  }

  await supabase
    .from("participations")
    .update({
      status: "completed",
      satisfaction: satisfactionToRating(input.satisfaction),
    })
    .eq("user_id", user.id)
    .eq("meetup_id", input.meetupId);

  revalidatePath("/my");
  revalidatePath("/together");
  revalidatePath("/my/profile");
  return { ok: true };
}

export async function submitOpenActivityReview(input: {
  activityId: string;
  satisfaction: Satisfaction;
  comment: string;
  peerChoices: { peerUserId: string; choice: AgainChoice }[];
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "로그인 필요" };

  try {
    const { error } = await supabase.from("open_activity_reviews").upsert(
      {
        user_id: user.id,
        open_activity_id: input.activityId,
        satisfaction: input.satisfaction,
        comment: input.comment.trim() || null,
      },
      { onConflict: "user_id,open_activity_id" },
    );
    if (error) return { error: "후기 저장 실패" };

    for (const peer of input.peerChoices) {
      await supabase.from("again_together").upsert(
        {
          user_id: user.id,
          peer_user_id: peer.peerUserId,
          source_type: "open_activity",
          source_id: input.activityId,
          choice: peer.choice,
        },
        { onConflict: "user_id,peer_user_id,source_type,source_id" },
      );
    }

    revalidatePath("/home");
    revalidatePath("/my");
    revalidatePath("/together");
    return { ok: true };
  } catch {
    return { error: "후기 기능 준비 중입니다" };
  }
}

export async function reportUser(input: {
  reportedUserId: string;
  reason: ReportReason;
  detail?: string;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "로그인 필요" };
  if (user.id === input.reportedUserId) return { error: "본인은 신고할 수 없습니다" };

  try {
    const { error } = await supabase.from("user_reports").insert({
      reporter_id: user.id,
      reported_user_id: input.reportedUserId,
      reason: input.reason,
      detail: input.detail?.trim() || null,
    });
    if (error) return { error: "신고 접수 실패" };
    return { ok: true };
  } catch {
    return { error: "신고 기능 준비 중입니다" };
  }
}

export async function blockUser(blockedUserId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "로그인 필요" };
  if (user.id === blockedUserId) return { error: "본인은 차단할 수 없습니다" };

  try {
    const { error } = await supabase.from("user_blocks").upsert({
      blocker_id: user.id,
      blocked_user_id: blockedUserId,
    });
    if (error) return { error: "차단 실패" };

    revalidatePath("/people");
    revalidatePath("/together");
    revalidatePath("/recommend");
    return { ok: true };
  } catch {
    return { error: "차단 기능 준비 중입니다" };
  }
}

export async function unblockUser(blockedUserId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "로그인 필요" };

  try {
    await supabase
      .from("user_blocks")
      .delete()
      .eq("blocker_id", user.id)
      .eq("blocked_user_id", blockedUserId);
    revalidatePath("/people");
    return { ok: true };
  } catch {
    return { error: "차단 해제 실패" };
  }
}
