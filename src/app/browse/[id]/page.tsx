import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { ActivityCard } from "@/components/browse/ActivityCard";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  getActivityById,
  getSimilarActivities,
} from "@/lib/browse/catalog";
import { getInterestLabel } from "@/lib/ieum/interests";

const DIFFICULTY_LABEL = {
  easy: "쉬움 · 초보 환영",
  normal: "보통",
  active: "활동적",
};

export default async function BrowseActivityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const activity = getActivityById(id);
  if (!activity) notFound();

  const similar = getSimilarActivities(activity, 4);
  const when = new Date(activity.scheduledAt).toLocaleString("ko-KR", {
    month: "long",
    day: "numeric",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <AppShell title="활동">
      <Link href="/browse" className="mb-4 inline-block text-brand-600">
        ← 둘러보기
      </Link>

      <div className="lg:grid lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
        <div>
          <div className="mb-6 flex h-48 items-center justify-center rounded-3xl bg-gradient-to-br from-brand-100 to-accent-50 text-7xl md:h-56 lg:h-72">
            {activity.emoji}
          </div>

          <h1 className="text-2xl font-bold md:text-3xl">{activity.title}</h1>
          <p className="mt-2 text-lg text-warm-gray">{activity.description}</p>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full bg-brand-50 px-3 py-1 text-sm">
              {getInterestLabel(activity.interestSlug)}
            </span>
            {activity.isFree && (
              <span className="rounded-full bg-brand-50 px-3 py-1 text-sm">무료</span>
            )}
            {activity.beginnerFriendly && (
              <span className="rounded-full bg-accent-50 px-3 py-1 text-sm text-accent-600">
                초보 환영
              </span>
            )}
          </div>

          {activity.reviewSnippet && (
            <Card className="mt-6">
              <p className="font-semibold">후기</p>
              <p className="mt-3 text-gray-700">&ldquo;{activity.reviewSnippet}&rdquo;</p>
              <p className="mt-2 text-sm text-warm-gray">
                {activity.reviewAuthor} · 후기 {activity.reviewCount}개
              </p>
            </Card>
          )}

          <Card className="mt-4">
            <p className="font-semibold">함께한 순간</p>
            <div className="mt-3 grid grid-cols-3 gap-2 md:grid-cols-4">
              {[activity.emoji, "🌿", "☀️"].map((e, i) => (
                <div
                  key={i}
                  className="flex aspect-square items-center justify-center rounded-xl bg-brand-50 text-3xl"
                >
                  {e}
                </div>
              ))}
            </div>
            <p className="mt-2 text-xs text-gray-400">예시 사진</p>
          </Card>
        </div>

        <div className="mt-8 lg:mt-0">
          <Card>
            <ul className="space-y-3 text-base md:text-lg">
              <li>📅 {when}</li>
              <li>
                📍 {activity.locationName} · {activity.region}
              </li>
              <li>
                ⏱ {activity.durationMinutes}분 · {DIFFICULTY_LABEL[activity.difficulty]}
              </li>
              <li>
                👥 참여 {activity.participantCount}/{activity.maxParticipants}명
              </li>
              <li>💬 후기 {activity.reviewCount}개</li>
            </ul>
          </Card>

          {activity.aiReason && (
            <Card className="mt-4 bg-brand-50">
              <p className="text-sm font-medium text-brand-600">✨ AI 추천 이유</p>
              <p className="mt-2">{activity.aiReason}</p>
            </Card>
          )}

          <Card className="mt-4">
            <p className="font-semibold">준비물</p>
            <p className="mt-2 text-warm-gray">{activity.supplies.join(" · ")}</p>
          </Card>

          <Card className="mt-4">
            <p className="font-semibold">함께할 호스트</p>
            <p className="mt-2">{activity.hostLabel}</p>
            <p className="mt-1 text-brand-700">{activity.hostBadge}</p>
          </Card>

          <Card className="mt-4">
            <p className="font-semibold">같이 참여할 사람</p>
            <p className="mt-2 text-warm-gray">
              {activity.participantCount}명이 참여 중 · {activity.hostBadge}
            </p>
            <Button href="/people" variant="outline" size="md" className="mt-4 w-full">
              동행 찾기
            </Button>
          </Card>

          <div className="mt-6 flex flex-col gap-3">
            <Button href="/invite" className="w-full">
              함께하기 신청
            </Button>
            <Button href="/people" variant="outline" className="w-full">
              같이할 사람 찾기
            </Button>
          </div>
        </div>
      </div>

      <h2 className="mb-4 mt-12 text-lg font-bold">비슷한 활동</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {similar.map((a) => (
          <ActivityCard key={a.id} activity={a} compact />
        ))}
      </div>

      <p className="mt-8 text-center text-xs text-gray-400">예시 활동 데이터</p>
    </AppShell>
  );
}
