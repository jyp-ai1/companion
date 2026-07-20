import { Suspense } from "react";
import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { ActivityTabs } from "@/components/feed/ActivityTabs";
import { DemoEmptyActivity } from "@/components/demo/DemoEmptyFallback";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { CATEGORY_LABELS } from "@/lib/types";
import { INTEREST_CATEGORIES } from "@/lib/ieum/daily";
import { getUserDiscoveryContext } from "@/lib/ieum/user-context";

async function ActivityContent({ tab }: { tab: string }) {
  const ctx = await getUserDiscoveryContext();
  if (!ctx) return null;

  const { upcoming, completed, badges, activityLevel, activityGraph } = ctx;

  if (tab === "upcoming") {
    return (
      <div className="flex flex-col gap-4">
        {!upcoming.length ? (
          <>
            <DemoEmptyActivity />
            <Button href="/recommend" className="mt-4">
              활동 둘러보기
            </Button>
          </>
        ) : (
          upcoming.map((p) => {
            const m = p.meetups;
            if (!m) return null;
            return (
              <Card key={p.id}>
                <span className="rounded-full bg-brand-50 px-3 py-1 text-sm text-brand-700">
                  {CATEGORY_LABELS[m.category]}
                </span>
                <h3 className="mt-2 text-xl font-semibold">{m.title}</h3>
                <Link href={`/meetups/${m.id}`} className="mt-4 inline-block text-brand-600 underline">
                  상세 보기
                </Link>
              </Card>
            );
          })
        )}
      </div>
    );
  }

  if (tab === "completed") {
    return (
      <div className="flex flex-col gap-4">
        {!completed.length ? (
          <Card className="text-center">
            <p className="text-gray-600">완료한 활동이 없습니다.</p>
          </Card>
        ) : (
          completed.map((p) => {
            const m = p.meetups;
            if (!m) return null;
            return (
              <Card key={p.id}>
                <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700">
                  완료
                </span>
                <h3 className="mt-2 text-xl font-semibold">{m.title}</h3>
                <Link
                  href={`/meetups/${m.id}/review`}
                  className="mt-4 inline-block text-brand-600 underline"
                >
                  후기 남기기
                </Link>
              </Card>
            );
          })
        )}
      </div>
    );
  }

  if (tab === "badges") {
    return (
      <div className="flex flex-col gap-6">
        <Card className="bg-brand-50">
          <p className="text-sm text-gray-600">활동 레벨</p>
          <p className="mt-2 text-2xl font-bold">
            {activityLevel.emoji} {activityLevel.title}
          </p>
          <p className="mt-1 text-sm text-gray-600">
            다음: {activityLevel.nextTitle} ({activityLevel.totalParticipations}회 참여)
          </p>
          <ProgressBar current={activityLevel.progress} total={100} />
        </Card>
        <div className="grid grid-cols-2 gap-3">
          {badges.map((b) => (
            <Card
              key={b.id}
              className={b.earned ? "border-brand-200 bg-white" : "opacity-50"}
            >
              <p className="text-3xl">{b.emoji}</p>
              <p className="mt-2 font-semibold">{b.title}</p>
              <p className="text-sm text-gray-500">{b.description}</p>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (tab === "interests") {
    return (
      <div className="flex flex-col gap-4">
        <Card>
          <p className="mb-4 font-medium">나의 Activity Graph</p>
          {activityGraph.length === 0 ? (
            <p className="text-gray-600">참여하면 관심사가 쌓입니다.</p>
          ) : (
            <ul className="space-y-2">
              {activityGraph.map((a) => (
                <li key={a.category} className="flex justify-between">
                  <span>{a.label}</span>
                  <span className="font-semibold">{a.count}회</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
        <div className="flex flex-wrap gap-2">
          {INTEREST_CATEGORIES.map(({ key, label, icon }) => (
            <Link
              key={key}
              href={`/meetups?category=${key}`}
              className="rounded-2xl border-2 border-brand-100 px-4 py-3 font-medium hover:border-brand-500"
            >
              {icon} {label}
            </Link>
          ))}
        </div>
      </div>
    );
  }

  return (
    <Card className="text-center">
      <p className="font-medium">친구</p>
      <p className="mt-2 text-sm text-gray-500">Coming Soon</p>
    </Card>
  );
}

export default async function MyActivityPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab = "upcoming" } = await searchParams;

  return (
    <AppShell title="내 활동">
      <h1 className="mb-6">내 활동</h1>
      <Suspense fallback={<p className="text-gray-600">불러오는 중...</p>}>
        <ActivityTabs />
        <ActivityContent tab={tab} />
      </Suspense>
    </AppShell>
  );
}
