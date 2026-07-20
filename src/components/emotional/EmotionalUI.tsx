import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function DailyMessageCard({ message }: { message: string }) {
  return (
    <div className="animate-fade-in-up mb-6 rounded-2xl border border-brand-200 bg-gradient-to-br from-brand-50 via-white to-accent-50 p-5 shadow-sm">
      <p className="text-sm font-medium text-brand-600">🌿 오늘의 한마디</p>
      <p className="mt-3 whitespace-pre-line text-lg leading-relaxed text-gray-800">
        {message}
      </p>
    </div>
  );
}

export function EmptyState({
  emoji,
  title,
  description,
  ctaLabel,
  ctaHref,
  secondary,
}: {
  emoji: string;
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  secondary?: React.ReactNode;
}) {
  return (
    <div className="animate-fade-in-up rounded-2xl border border-dashed border-brand-200 bg-gradient-to-b from-brand-50/40 to-white p-6 text-center">
      <span className="text-5xl">{emoji}</span>
      <p className="mt-4 text-xl font-bold text-gray-800">{title}</p>
      <p className="mt-3 text-lg leading-relaxed text-gray-600">{description}</p>
      <Button href={ctaHref} className="mt-6 w-full">
        {ctaLabel}
      </Button>
      {secondary}
    </div>
  );
}

export function ActionChips({
  actions,
}: {
  actions: readonly { emoji: string; label: string }[];
}) {
  return (
    <div className="mt-8 flex flex-wrap justify-center gap-3">
      {actions.map((a) => (
        <span
          key={a.label}
          className="inline-flex min-h-[48px] items-center gap-2 rounded-2xl border border-brand-100 bg-white px-4 py-2 text-base font-medium text-gray-800 shadow-sm"
        >
          <span className="text-xl">{a.emoji}</span>
          {a.label}
        </span>
      ))}
    </div>
  );
}
