import Link from "next/link";
import { Header } from "@/components/Header";
import { createClient } from "@/lib/supabase/server";
import { MeetupActions, MeetupDetailInfo } from "@/components/meetup/MeetupActions";
import { Card } from "@/components/ui/Card";
import type { Meetup } from "@/lib/types";

export default async function MeetupDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: meetup } = await supabase
    .from("meetups")
    .select("*")
    .eq("id", id)
    .single();

  if (!meetup) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p>모임을 찾을 수 없습니다.</p>
      </div>
    );
  }

  const m = meetup as Meetup;

  const { data: count } = await supabase.rpc("get_meetup_participant_count", {
    meetup_uuid: id,
  });
  const participantCount = (count as number) ?? 0;

  const { data: participants } = await supabase.rpc("get_meetup_participants", {
    meetup_uuid: id,
  });

  let isJoined = false;
  let hasReview = false;
  if (user) {
    const { data: part } = await supabase
      .from("participations")
      .select("status")
      .eq("user_id", user.id)
      .eq("meetup_id", id)
      .maybeSingle();
    isJoined = part?.status === "confirmed" || part?.status === "completed";

    const { data: review } = await supabase
      .from("reviews")
      .select("id")
      .eq("user_id", user.id)
      .eq("meetup_id", id)
      .maybeSingle();
    hasReview = !!review;
  }

  const isFull = participantCount >= m.max_participants;
  const canReview =
    m.scheduled_at &&
    new Date(m.scheduled_at) < new Date();

  return (
    <div className="flex flex-1 flex-col">
      <Header />
      <main className="mx-auto w-full max-w-lg px-6 py-10">
        <Link href="/meetups" className="mb-6 inline-block text-brand-600">
          ← 모임 목록
        </Link>
        <Card>
          <MeetupDetailInfo
            meetup={m}
            participantCount={participantCount}
            participants={(participants as { display_name: string | null; age_group: string | null }[]) ?? []}
          />
          <div className="mt-8">
            <MeetupActions
              meetupId={id}
              meetup={m}
              participantCount={participantCount}
              isJoined={isJoined}
              isFull={isFull && !isJoined}
              canReview={!!canReview}
              hasReview={hasReview}
            />
          </div>
        </Card>
      </main>
    </div>
  );
}
