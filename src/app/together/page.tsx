import { AppShell } from "@/components/AppShell";
import {
  ConnectionRow,
  RelationshipCoachCard,
  SocialHealthCard,
} from "@/components/together/TogetherCards";
import { DemoEmptyTogether } from "@/components/demo/DemoEmptyFallback";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { getTogetherContext } from "@/lib/ieum/together-context";
import { maskName } from "@/lib/ieum/relationships";
import { CATEGORY_LABELS } from "@/lib/types";

export default async function TogetherPage() {
  const ctx = await getTogetherContext();
  if (!ctx) return null;

  const {
    connections,
    frequent,
    monthlyPeople,
    monthlyNewFriends,
    regularCount,
    socialHealth,
    coach,
    recentActivities,
  } = ctx;

  return (
    <AppShell title="Together">
      <h1 className="mb-2 text-2xl font-bold">Together</h1>
      <p className="mb-6 text-gray-600">
        함께하면 더 즐거운 관계 — Connection Graph
      </p>

      {coach && <RelationshipCoachCard coach={coach} />}

      <div className="mt-8 grid grid-cols-3 gap-3">
        <Card className="text-center">
          <p className="text-2xl font-bold text-brand-700">{monthlyPeople}</p>
          <p className="mt-1 text-xs text-gray-600">이번 달 함께한 사람</p>
        </Card>
        <Card className="text-center">
          <p className="text-2xl font-bold text-brand-700">{monthlyNewFriends}</p>
          <p className="mt-1 text-xs text-gray-600">새로운 친구</p>
        </Card>
        <Card className="text-center">
          <p className="text-2xl font-bold text-brand-700">{regularCount}</p>
          <p className="mt-1 text-xs text-gray-600">자주 함께하는 사람</p>
        </Card>
      </div>

      <div className="mt-8">
        <SocialHealthCard
          score={socialHealth.score}
          delta={socialHealth.delta}
          labels={socialHealth.labels}
        />
      </div>

      <h2 className="mb-4 mt-10 text-lg font-bold">가장 많이 만난 사람</h2>
      {frequent.length === 0 ? (
        <>
          <DemoEmptyTogether />
          <Button href="/recommend" className="mt-4">
            활동 둘러보기
          </Button>
        </>
      ) : (
        <div className="flex flex-col gap-3">
          {frequent.map((c) => (
            <ConnectionRow
              key={c.peer_id}
              name={maskName(c.display_name)}
              meetCount={c.meet_count}
              lastActivity={c.last_activity}
              href={`/together/${c.peer_id}`}
            />
          ))}
        </div>
      )}

      <h2 className="mb-4 mt-10 text-lg font-bold">최근 함께한 활동</h2>
      <div className="flex flex-col gap-3">
        {recentActivities.length === 0 ? (
          <Card><p className="text-gray-600">활동 기록이 없습니다.</p></Card>
        ) : (
          recentActivities.map((p) => {
            const m = p.meetups as {
              title: string;
              category: keyof typeof CATEGORY_LABELS;
            } | null;
            return (
              <Card key={p.id}>
                <p className="font-medium">{m?.title ?? "활동"}</p>
                <p className="text-sm text-gray-600">
                  {m?.category ? CATEGORY_LABELS[m.category] : ""}
                </p>
              </Card>
            );
          })
        )}
      </div>

      <h2 className="mb-4 mt-10 text-lg font-bold">다시 만나기 추천</h2>
      {connections.length === 0 ? (
        <Card className="bg-brand-50">
          <p className="text-gray-700">
            첫 활동 후 AI가 관계를 추천해 드립니다.
          </p>
        </Card>
      ) : (
        <Card className="bg-brand-50">
          <p className="text-gray-700">{coach?.body}</p>
          {coach?.peerId && (
            <Button href={coach.ctaHref} variant="outline" size="md" className="mt-4">
              {coach.ctaLabel}
            </Button>
          )}
        </Card>
      )}
    </AppShell>
  );
}
