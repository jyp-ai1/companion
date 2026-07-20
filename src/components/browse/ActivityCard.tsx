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
    <Link href={`/browse/${activity.id}`} className="group block h-full">
      <Card
        className={`flex h-full flex-col overflow-hidden p-0 transition-all group-hover:border-brand-300 group-hover:shadow-md`}
      >
        <div className="flex h-36 items-center justify-center bg-gradient-to-br from-brand-50 to-accent-50/40 text-5xl md:h-40">
          {activity.emoji}
        </div>
        <div className={`flex flex-1 flex-col ${compact ? "p-4" : "p-5"}`}>
          <div className="flex flex-wrap gap-1.5">
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
          <p className="mt-2 line-clamp-2 text-base font-bold md:text-lg">{activity.title}</p>
          <p className="mt-1 text-sm text-warm-gray">
            {formatWhen(activity.scheduledAt)} · {activity.locationName} · {activity.durationMinutes}
            분
          </p>
          <p className="mt-1 text-sm text-brand-700">
            {getInterestLabel(activity.interestSlug)} · 참여 {activity.participantCount}명 · 후기{" "}
            {activity.reviewCount}개
          </p>
          {showAiReason && activity.aiReason && (
            <p className="mt-2 text-sm text-brand-600">✨ {activity.aiReason}</p>
          )}
          <p className="mt-auto pt-2 text-xs text-gray-400">{activity.hostBadge}</p>
        </div>
      </Card>
    </Link>
  );
}

export function ActivityCardHorizontal({ activity }: { activity: BrowseActivity }) {
  return (
    <Link
      href={`/browse/${activity.id}`}
      className="group block w-[240px] shrink-0 sm:w-[280px] lg:w-full lg:max-w-none"
    >
      <Card className="h-full overflow-hidden border-brand-200 bg-gradient-to-br from-white to-brand-50/40 p-0 transition-all group-hover:border-brand-300 group-hover:shadow-md">
        <div className="flex h-32 items-center justify-center bg-brand-50 text-5xl sm:h-36">
          {activity.emoji}
        </div>
        <div className="p-4">
          <p className="line-clamp-2 font-bold">{activity.title}</p>
          <p className="mt-1 text-sm text-warm-gray">
            {activity.region} · {activity.durationMinutes}분
          </p>
          <p className="mt-2 text-sm text-brand-700">후기 {activity.reviewCount}개</p>
        </div>
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
    <span className="flex min-h-[76px] min-w-[76px] shrink-0 flex-col items-center justify-center rounded-2xl border border-brand-100 bg-white px-3 py-2 shadow-sm transition-colors hover:border-brand-300 hover:bg-brand-50 md:min-h-[84px] md:min-w-[84px]">
      <span className="text-2xl">{emoji}</span>
      <span className="mt-1 text-sm font-medium">{label}</span>
    </span>
  );
  if (href) return <Link href={href}>{content}</Link>;
  return content;
}
