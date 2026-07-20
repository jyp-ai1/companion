import Link from "next/link";
import type { BrowseActivity } from "@/lib/browse/types";
import { getInterestLabel } from "@/lib/ieum/interests";
import { Card } from "@/components/ui/Card";

function formatWhen(iso: string) {
  const d = new Date(iso);
  const today = new Date();
  if (d.toDateString() === today.toDateString()) return "오늘";
  return d.toLocaleDateString("ko-KR", { month: "short", day: "numeric", weekday: "short" });
}

export function ActivityCard({
  activity,
  compact,
  showAiReason,
}: {
  activity: BrowseActivity;
  compact?: boolean;
  showAiReason?: boolean;
}) {
  return (
    <Link href={`/browse/${activity.id}`}>
      <Card
        className={`transition-all hover:border-brand-300 hover:shadow-md ${
          compact ? "p-4" : ""
        }`}
      >
        <div className="flex gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-3xl">
            {activity.emoji}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap gap-2">
              {activity.isPopular && (
                <span className="rounded-full bg-accent-100 px-2 py-0.5 text-xs font-medium text-accent-600">
                  🔥 인기
                </span>
              )}
              {activity.isNew && (
                <span className="rounded-full bg-brand-100 px-2 py-0.5 text-xs font-medium text-brand-700">
                  NEW
                </span>
              )}
              {activity.beginnerFriendly && (
                <span className="rounded-full bg-brand-50 px-2 py-0.5 text-xs text-brand-700">
                  초보 환영
                </span>
              )}
            </div>
            <p className="mt-1 truncate text-lg font-bold">{activity.title}</p>
            <p className="mt-1 text-sm text-warm-gray">
              {formatWhen(activity.scheduledAt)} · {activity.locationName} ·{" "}
              {activity.durationMinutes}분
            </p>
            <p className="mt-1 text-sm text-brand-700">
              {getInterestLabel(activity.interestSlug)} · 참여 {activity.participantCount}명 · 후기{" "}
              {activity.reviewCount}개
            </p>
            {showAiReason && activity.aiReason && (
              <p className="mt-2 text-sm text-brand-600">✨ {activity.aiReason}</p>
            )}
            <p className="mt-1 text-xs text-gray-400">{activity.hostBadge}</p>
          </div>
        </div>
      </Card>
    </Link>
  );
}

export function ActivityCardHorizontal({ activity }: { activity: BrowseActivity }) {
  return (
    <Link href={`/browse/${activity.id}`} className="block w-[280px] shrink-0">
      <Card className="h-full border-brand-200 bg-gradient-to-br from-white to-brand-50/40">
        <div className="flex h-24 items-center justify-center rounded-xl bg-brand-50 text-5xl">
          {activity.emoji}
        </div>
        <p className="mt-3 font-bold">{activity.title}</p>
        <p className="mt-1 text-sm text-warm-gray">
          {activity.region} · {activity.durationMinutes}분
        </p>
        <p className="mt-2 text-sm text-brand-700">후기 {activity.reviewCount}개</p>
      </Card>
    </Link>
  );
}

export function InterestChip({
  slug,
  label,
  emoji,
  href,
}: {
  slug: string;
  label: string;
  emoji: string;
  href?: string;
}) {
  const content = (
    <span className="flex min-h-[72px] min-w-[72px] shrink-0 flex-col items-center justify-center rounded-2xl border border-brand-100 bg-white px-3 py-2 shadow-sm transition-colors hover:border-brand-300 hover:bg-brand-50">
      <span className="text-2xl">{emoji}</span>
      <span className="mt-1 text-sm font-medium">{label}</span>
    </span>
  );
  if (href) return <Link href={href}>{content}</Link>;
  return content;
}
