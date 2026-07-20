"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import type { Meetup } from "@/lib/types";
import { CATEGORY_LABELS } from "@/lib/types";

interface MeetupActionsProps {
  meetupId: string;
  meetup: Meetup;
  participantCount: number;
  isJoined: boolean;
  isFull: boolean;
  canReview: boolean;
  hasReview: boolean;
}

export function MeetupActions({
  meetupId,
  meetup,
  participantCount,
  isJoined,
  isFull,
  canReview,
  hasReview,
}: MeetupActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [joined, setJoined] = useState(isJoined);

  async function handleJoin() {
    setLoading(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from("participations").upsert(
      {
        user_id: user.id,
        meetup_id: meetupId,
        status: "confirmed",
      },
      { onConflict: "user_id,meetup_id" },
    );

    if (!error) {
      setJoined(true);
      router.refresh();
    }
    setLoading(false);
  }

  async function handleCancel() {
    setLoading(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from("participations")
      .update({ status: "cancelled" })
      .eq("user_id", user.id)
      .eq("meetup_id", meetupId);

    setJoined(false);
    router.refresh();
    setLoading(false);
  }

  if (joined) {
    return (
      <div className="flex flex-col gap-3">
        <p className="rounded-xl bg-brand-50 p-4 text-center font-medium text-brand-800">
          참여 신청이 완료되었습니다
        </p>
        <Button
          variant="outline"
          className="w-full"
          onClick={handleCancel}
          disabled={loading}
        >
          참여 취소
        </Button>
        {canReview && !hasReview && (
          <Button href={`/meetups/${meetupId}/review`} className="w-full">
            활동 후기 남기기
          </Button>
        )}
      </div>
    );
  }

  return (
    <Button
      className="w-full"
      onClick={handleJoin}
      disabled={loading || isFull}
    >
      {isFull ? "모집 마감" : loading ? "신청 중..." : "참여하기"}
    </Button>
  );
}

export function MeetupDetailInfo({
  meetup,
  participantCount,
  participants,
}: {
  meetup: Meetup;
  participantCount: number;
  participants: { display_name: string | null; age_group: string | null }[];
}) {
  const dateStr = meetup.scheduled_at
    ? new Date(meetup.scheduled_at).toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        weekday: "long",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "일정 미정";

  return (
    <>
      <span className="rounded-full bg-brand-50 px-3 py-1 text-sm font-medium text-brand-700">
        {CATEGORY_LABELS[meetup.category]}
      </span>
      <h1 className="mt-4">{meetup.title}</h1>
      <div className="mt-6 space-y-3 text-lg text-gray-700">
        <p>📅 {dateStr}</p>
        {meetup.location_name && <p>📍 {meetup.location_name}</p>}
        <p>🗺️ {meetup.region}</p>
        <p>
          👥 {participantCount}/{meetup.max_participants}명
        </p>
      </div>
      {meetup.description && (
        <p className="mt-6 text-gray-600 leading-relaxed">{meetup.description}</p>
      )}
      {participants.length > 0 && (
        <div className="mt-6">
          <p className="mb-2 font-medium">참여자</p>
          <p className="text-gray-600">
            {participants
              .map((p) =>
                [p.age_group, p.display_name ? `${p.display_name}님` : null]
                  .filter(Boolean)
                  .join(" · "),
              )
              .join(", ") || "참여자 정보"}
          </p>
        </div>
      )}
    </>
  );
}
