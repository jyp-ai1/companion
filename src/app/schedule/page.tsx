import { Suspense } from "react";
import { AppShell } from "@/components/AppShell";
import { ScheduleTabs } from "@/components/feed/ActivityTabs";
import { FeedCardCompact } from "@/components/feed/FeedCard";
import { Card } from "@/components/ui/Card";
import { meetupToFeedItem } from "@/lib/ieum/feed";
import { getUserDiscoveryContext } from "@/lib/ieum/user-context";
import type { Meetup } from "@/lib/types";

function filterByRange(meetups: Meetup[], range: string): Meetup[] {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrowStart = new Date(todayStart);
  tomorrowStart.setDate(tomorrowStart.getDate() + 1);
  const weekEnd = new Date(todayStart);
  weekEnd.setDate(weekEnd.getDate() + 7);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  return meetups.filter((m) => {
    if (!m.scheduled_at) return false;
    const d = new Date(m.scheduled_at);
    if (range === "today") {
      return d >= todayStart && d < tomorrowStart;
    }
    if (range === "tomorrow") {
      const dayAfter = new Date(tomorrowStart);
      dayAfter.setDate(dayAfter.getDate() + 1);
      return d >= tomorrowStart && d < dayAfter;
    }
    if (range === "week") {
      return d >= todayStart && d < weekEnd;
    }
    if (range === "month") {
      return d >= todayStart && d <= monthEnd;
    }
    return true;
  });
}

async function ScheduleContent({ range }: { range: string }) {
  const ctx = await getUserDiscoveryContext();
  if (!ctx) return null;

  const filtered = filterByRange(ctx.meetups, range);
  const myScheduled = ctx.upcoming.filter((p) => {
    if (!p.meetups?.scheduled_at) return false;
    const ids = new Set(filtered.map((m) => m.id));
    return ids.has(p.meetups.id);
  });

  return (
    <>
      {myScheduled.length > 0 && (
        <>
          <h2 className="mb-4 text-lg font-bold">내 참여 일정</h2>
          <div className="mb-8 flex flex-col gap-3">
            {myScheduled.map((p) =>
              p.meetups ? (
                <FeedCardCompact
                  key={p.id}
                  item={meetupToFeedItem(
                    p.meetups,
                    ctx.counts[p.meetups.id] ?? 0,
                    ctx.scores[p.meetups.id],
                  )}
                />
              ) : null,
            )}
          </div>
        </>
      )}

      <h2 className="mb-4 text-lg font-bold">전체 일정</h2>
      <div className="flex flex-col gap-3">
        {filtered.length === 0 ? (
          <Card>
            <p className="text-gray-600">해당 기간에 열리는 활동이 없습니다.</p>
          </Card>
        ) : (
          filtered.map((m) => (
            <FeedCardCompact
              key={m.id}
              item={meetupToFeedItem(m, ctx.counts[m.id] ?? 0, ctx.scores[m.id])}
            />
          ))
        )}
      </div>
    </>
  );
}

export default async function SchedulePage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>;
}) {
  const { range = "today" } = await searchParams;

  return (
    <AppShell title="일정">
      <h1 className="mb-6">일정</h1>
      <Suspense fallback={<p className="text-gray-600">불러오는 중...</p>}>
        <ScheduleTabs />
        <ScheduleContent range={range} />
      </Suspense>
    </AppShell>
  );
}
