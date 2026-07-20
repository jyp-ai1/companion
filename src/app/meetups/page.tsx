import { AppShell } from "@/components/AppShell";
import { createClient } from "@/lib/supabase/server";
import type { Meetup, MeetupCategory } from "@/lib/types";
import { MeetupCard } from "@/components/meetup/MeetupCard";
import { INTEREST_TAGS, INTEREST_TO_CATEGORY } from "@/lib/ieum/interests";
import { CATEGORY_LABELS } from "@/lib/types";
import Link from "next/link";

async function getParticipantCount(meetupId: string) {
  const supabase = await createClient();
  const { data } = await supabase.rpc("get_meetup_participant_count", {
    meetup_uuid: meetupId,
  });
  return (data as number) ?? 0;
}

function resolveCategory(category?: string): MeetupCategory | null {
  if (!category) return null;
  if (category in CATEGORY_LABELS) return category as MeetupCategory;
  return INTEREST_TO_CATEGORY[category] ?? null;
}

export default async function MeetupsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category: rawCategory } = await searchParams;
  const category = resolveCategory(rawCategory ?? undefined);
  const supabase = await createClient();
  let query = supabase
    .from("meetups")
    .select("*")
    .eq("is_active", true)
    .order("scheduled_at", { ascending: true });

  if (category) {
    query = query.eq("category", category);
  }

  const { data: meetups } = await query;
  const list = (meetups as Meetup[]) ?? [];
  const counts = await Promise.all(list.map((m) => getParticipantCount(m.id)));

  return (
    <AppShell title="활동">
      <h1 className="mb-2">함께하기</h1>
      <p className="mb-6 text-gray-600">관심사별로 가볍게 시작해 보세요.</p>
      <div className="mb-6 flex flex-wrap gap-2">
        <Link
          href="/meetups"
          className={`rounded-full px-4 py-2 text-sm font-medium ${
            !rawCategory ? "bg-brand-600 text-white" : "bg-brand-50 text-brand-700"
          }`}
        >
          전체
        </Link>
        {INTEREST_TAGS.slice(0, 10).map(({ slug, label, emoji }) => (
          <Link
            key={slug}
            href={`/meetups?category=${slug}`}
            className={`rounded-full px-4 py-2 text-sm font-medium ${
              rawCategory === slug ? "bg-brand-600 text-white" : "bg-brand-50 text-brand-700"
            }`}
          >
            {emoji} {label}
          </Link>
        ))}
      </div>
      <div className="flex flex-col gap-4">
        {list.length === 0 ? (
          <p className="text-gray-600">등록된 활동이 없습니다.</p>
        ) : (
          list.map((m, i) => (
            <MeetupCard key={m.id} meetup={m} participantCount={counts[i]} />
          ))
        )}
      </div>
    </AppShell>
  );
}
