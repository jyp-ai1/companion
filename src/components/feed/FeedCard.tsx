import Link from "next/link";
import type { FeedItem } from "@/lib/ieum/feed";
import { Card } from "@/components/ui/Card";

export function FeedCard({ item }: { item: FeedItem }) {
  return (
    <Card className="overflow-hidden border-brand-100 p-0">
      <div className="border-b border-brand-50 bg-gradient-to-r from-brand-50 to-white px-5 py-4">
        <div className="flex items-start gap-3">
          <span className="text-3xl">{item.icon}</span>
          <div className="flex-1">
            <p className="text-lg font-bold">{item.activityTitle}</p>
            <p className="mt-1 text-gray-600">{item.meetupTitle}</p>
          </div>
        </div>
      </div>
      <div className="px-5 py-4">
        <p className="text-gray-700">
          📅 {item.timeLabel}
          {item.location && ` · 📍 ${item.location}`}
        </p>
        <p className="mt-2 text-gray-600">
          👥 참여 {item.participantCount}명
          {item.score ? (
            <span className="ml-2 rounded-full bg-brand-50 px-2 py-0.5 text-sm font-semibold text-brand-700">
              {item.score}% 추천
            </span>
          ) : null}
        </p>
        <Link
          href={`/meetups/${item.meetupId}`}
          className="mt-4 inline-flex min-h-[52px] w-full items-center justify-center rounded-2xl bg-brand-600 text-lg font-semibold text-white hover:bg-brand-700"
        >
          참여하기
        </Link>
      </div>
    </Card>
  );
}

export function FeedCardCompact({ item }: { item: FeedItem }) {
  return (
    <Link href={`/meetups/${item.meetupId}`}>
      <Card className="flex items-center gap-4 hover:border-brand-300">
        <span className="text-3xl">{item.icon}</span>
        <div className="flex-1">
          <p className="font-semibold">{item.activityTitle}</p>
          <p className="text-sm text-gray-600">
            {item.timeLabel} · {item.participantCount}명
          </p>
        </div>
        <span className="text-brand-600">→</span>
      </Card>
    </Link>
  );
}
