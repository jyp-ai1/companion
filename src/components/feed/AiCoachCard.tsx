import type { CoachMessage } from "@/lib/ieum/coach";
import { Card } from "@/components/ui/Card";
import Link from "next/link";

export function AiCoachCard({ coach }: { coach: CoachMessage }) {
  return (
    <Card className="border-brand-200 bg-gradient-to-br from-brand-50 via-white to-brand-50/50">
      <p className="text-sm font-medium text-brand-600">{coach.headline}</p>
      <p className="mt-2 text-lg font-bold">{coach.greeting}</p>
      <p className="mt-3 text-gray-700">{coach.body}</p>
      <p className="mt-2 font-semibold text-brand-800">{coach.suggestion}</p>
      <ul className="mt-4 space-y-1 text-sm text-gray-600">
        {coach.reasons.map((r) => (
          <li key={r}>{r}</li>
        ))}
      </ul>
      {coach.category && (
        <Link
          href={`/meetups?category=${coach.category}`}
          className="mt-4 inline-flex min-h-[48px] items-center rounded-xl bg-brand-600 px-5 font-semibold text-white hover:bg-brand-700"
        >
          추천 활동 보기
        </Link>
      )}
    </Card>
  );
}
