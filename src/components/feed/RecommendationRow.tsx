import Link from "next/link";
import { INTEREST_TO_CATEGORY } from "@/lib/ieum/interests";
import type { ScoredMeetup } from "@/lib/ieum/recommend";
import { CATEGORY_LABELS } from "@/lib/types";
import { Card } from "@/components/ui/Card";

const CATEGORY_ICONS: Record<string, string> = {
  walking: "🌿",
  hiking: "⛰️",
  travel: "🚌",
  cafe: "☕",
  culture: "🎭",
  reading: "📚",
  exercise: "🏃",
  health: "💪",
  social: "🤝",
  class: "🎓",
  writing: "✍️",
  other: "✨",
};

export function RecommendationRow({ item }: { item: ScoredMeetup }) {
  const icon = CATEGORY_ICONS[item.meetup.category] ?? "✨";
  return (
    <Link href={`/meetups/${item.meetup.id}`}>
      <Card className="flex items-center gap-4 hover:border-brand-300">
        <span className="text-3xl">{icon}</span>
        <div className="flex-1">
          <p className="font-semibold">
            {CATEGORY_LABELS[item.meetup.category]} · {item.meetup.title}
          </p>
          <ul className="mt-1 text-sm text-gray-500">
            {item.reasons.slice(0, 2).map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-brand-700">{item.scorePercent}%</p>
          <p className="text-xs text-gray-500">추천</p>
        </div>
      </Card>
    </Link>
  );
}

export function CategoryRecommendRow({
  category,
  label,
  icon,
  score,
}: {
  category: string;
  label: string;
  icon: string;
  score: number;
}) {
  return (
    <Link href={`/meetups?category=${INTEREST_TO_CATEGORY[category] ?? category}`}>
      <Card className="flex items-center gap-4 hover:border-brand-300">
        <span className="text-3xl">{icon}</span>
        <div className="flex-1">
          <p className="font-semibold">{label}</p>
          <p className="text-sm text-gray-500">관련 모임 보기</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-brand-700">{score}%</p>
        </div>
      </Card>
    </Link>
  );
}
