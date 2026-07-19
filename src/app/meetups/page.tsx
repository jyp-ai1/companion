import { Header } from "@/components/Header";
import { createClient } from "@/lib/supabase/server";
import type { Meetup } from "@/lib/types";
import { MeetupCard } from "@/components/meetup/MeetupCard";

async function getParticipantCount(meetupId: string) {
  const supabase = await createClient();
  const { data } = await supabase.rpc("get_meetup_participant_count", {
    meetup_uuid: meetupId,
  });
  return (data as number) ?? 0;
}

export default async function MeetupsPage() {
  const supabase = await createClient();
  const { data: meetups } = await supabase
    .from("meetups")
    .select("*")
    .eq("is_active", true)
    .order("scheduled_at", { ascending: true });

  const list = (meetups as Meetup[]) ?? [];
  const counts = await Promise.all(list.map((m) => getParticipantCount(m.id)));

  return (
    <div className="flex flex-1 flex-col">
      <Header />
      <main className="mx-auto w-full max-w-lg px-6 py-10">
        <h1 className="mb-2">지역 모임</h1>
        <p className="mb-8 text-gray-600">함께할 활동을 찾아보세요.</p>
        <div className="flex flex-col gap-4">
          {list.length === 0 ? (
            <p className="text-gray-600">등록된 모임이 없습니다.</p>
          ) : (
            list.map((m, i) => (
              <MeetupCard
                key={m.id}
                meetup={m}
                participantCount={counts[i]}
              />
            ))
          )}
        </div>
      </main>
    </div>
  );
}
