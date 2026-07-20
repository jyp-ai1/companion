import { notFound } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { RelationshipTimelineView } from "@/components/together/TogetherCards";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { suggestReconnectActivity } from "@/lib/ieum/relationship-coach";
import { getRelationshipDetail } from "@/lib/ieum/together-context";
import { CATEGORY_LABELS } from "@/lib/types";

export default async function TogetherDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const detail = await getRelationshipDetail(id);
  if (!detail) notFound();

  const { connection, timeline, peerName } = detail;
  const suggest = suggestReconnectActivity(connection.last_category);

  return (
    <AppShell title="관계">
      <Card className="mb-6 bg-brand-50">
        <p className="text-sm text-gray-600">함께한 이웃</p>
        <p className="mt-2 text-2xl font-bold">{peerName}</p>
        <p className="mt-2 text-gray-600">
          {connection.meet_count}회 함께 ·{" "}
          {connection.status === "friend"
            ? "친구"
            : connection.status === "regular"
              ? "자주 만나는 이웃"
              : "처음 만난 이웃"}
        </p>
      </Card>

      <h2 className="mb-6 text-lg font-bold">Relationship Journey</h2>
      <RelationshipTimelineView steps={timeline} />

      <Card className="mt-10 border-dashed border-brand-300">
        <p className="font-medium">AI Relationship Coach</p>
        <p className="mt-2 text-gray-700">
          {peerName}님과 다음 활동으로 {suggest}을 추천드립니다.
        </p>
        <Button
          href={`/meetups?category=${connection.last_category ?? "walking"}`}
          className="mt-4"
          size="md"
        >
          {suggest} 함께하기
        </Button>
      </Card>
    </AppShell>
  );
}
