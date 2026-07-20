import Link from "next/link";
import type { RelationshipCoachMessage } from "@/lib/ieum/relationship-coach";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export function RelationshipCoachCard({ coach }: { coach: RelationshipCoachMessage }) {
  return (
    <Card className="border-brand-200 bg-gradient-to-br from-brand-50 to-white">
      <p className="text-sm font-medium text-brand-600">{coach.headline}</p>
      <p className="mt-3 leading-relaxed text-gray-800">{coach.body}</p>
      <Button href={coach.ctaHref} size="md" className="mt-4">
        {coach.ctaLabel}
      </Button>
    </Card>
  );
}

export function SocialHealthCard({
  score,
  delta,
  labels,
}: {
  score: number;
  delta: number;
  labels: { label: string; value: number; trend: "up" | "flat" | "down" }[];
}) {
  return (
    <Card className="border-brand-200">
      <p className="text-sm text-gray-600">활동 리포트</p>
      <div className="mt-2 flex items-end gap-2">
        <p className="text-4xl font-bold text-brand-700">{score}</p>
        <p className="mb-1 text-sm text-gray-600">관계 활력</p>
        {delta !== 0 && (
          <span
            className={`mb-1 ml-auto text-sm font-semibold ${
              delta > 0 ? "text-green-600" : "text-gray-500"
            }`}
          >
            {delta > 0 ? "↑" : "→"} {Math.abs(delta)}
          </span>
        )}
      </div>
      <p className="mt-1 text-xs text-gray-500">평가가 아닌 나의 활동 기록입니다</p>
      <div className="mt-6 grid grid-cols-2 gap-3">
        {labels.map((l) => (
          <div key={l.label} className="rounded-xl bg-brand-50/60 px-3 py-2">
            <p className="text-xs text-gray-600">{l.label}</p>
            <p className="font-semibold">
              {l.value}
              {l.trend === "up" && <span className="ml-1 text-green-600">↑</span>}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}

export function ConnectionRow({
  name,
  meetCount,
  lastActivity,
  href,
}: {
  name: string;
  meetCount: number;
  lastActivity: string | null;
  href: string;
}) {
  return (
    <Link href={href}>
      <Card className="flex items-center justify-between hover:border-brand-300">
        <div>
          <p className="font-semibold">{name}</p>
          <p className="text-sm text-gray-600">
            {meetCount}회 함께
            {lastActivity && ` · ${lastActivity}`}
          </p>
        </div>
        <span className="text-brand-600">→</span>
      </Card>
    </Link>
  );
}

export function RelationshipTimelineView({
  steps,
}: {
  steps: { id: string; label: string; emoji: string; dateLabel: string }[];
}) {
  return (
    <div className="relative pl-8">
      <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-brand-200" />
      {steps.map((step, i) => (
        <div key={step.id} className="relative mb-6 last:mb-0">
          <span className="absolute -left-5 flex h-8 w-8 items-center justify-center rounded-full bg-white text-lg ring-2 ring-brand-200">
            {step.emoji}
          </span>
          <div className="ml-4">
            <p className="font-semibold">{step.label}</p>
            <p className="text-sm text-gray-500">{step.dateLabel}</p>
            {i < steps.length - 1 && (
              <p className="mt-1 text-xs text-brand-500">↓</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
