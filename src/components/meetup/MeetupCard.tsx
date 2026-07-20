import Link from "next/link";
import type { Meetup } from "@/lib/types";
import { CATEGORY_LABELS } from "@/lib/types";
import { Card } from "@/components/ui/Card";

interface MeetupCardProps {
  meetup: Meetup;
  participantCount?: number;
  href?: string;
  showJoin?: boolean;
}

export function MeetupCard({
  meetup,
  participantCount = 0,
  href,
  showJoin = true,
}: MeetupCardProps) {
  const link = href ?? `/meetups/${meetup.id}`;
  const dateStr = meetup.scheduled_at
    ? new Date(meetup.scheduled_at).toLocaleDateString("ko-KR", {
        month: "long",
        day: "numeric",
        weekday: "short",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "일정 미정";

  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <span className="rounded-full bg-brand-50 px-3 py-1 text-sm font-medium text-brand-700">
            {CATEGORY_LABELS[meetup.category]}
          </span>
          <h3 className="mt-2 text-xl font-semibold">{meetup.title}</h3>
        </div>
      </div>
      <p className="text-gray-600">
        📅 {dateStr}
        {meetup.location_name && ` · 📍 ${meetup.location_name}`}
      </p>
      <p className="text-gray-600">
        👥 {participantCount}/{meetup.max_participants}명
      </p>
      {showJoin && (
        <Link
          href={link}
          className="mt-2 inline-flex min-h-[52px] items-center justify-center rounded-2xl bg-brand-600 px-6 text-lg font-semibold text-white hover:bg-brand-700"
        >
          함께하기
        </Link>
      )}
    </Card>
  );
}
