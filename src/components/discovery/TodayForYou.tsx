import Link from "next/link";
import type { TodayCard } from "@/lib/ieum/discovery-engine";
import { Card } from "@/components/ui/Card";
import { WhyReasons } from "@/components/discovery/WhyReasons";

export function TodayForYouSection({ cards }: { cards: TodayCard[] }) {
  return (
    <section className="mt-6">
      <p className="text-sm font-medium text-brand-600">오늘의 이음</p>
      <h2 className="mt-1 text-2xl font-bold">오늘, 당신에게 추천드립니다</h2>
      <div className="mt-6 flex flex-col gap-4">
        {cards.map((card) => (
          <Card
            key={card.id}
            className="overflow-hidden border-brand-200 bg-gradient-to-br from-white to-brand-50/40 p-0"
          >
            <div className="px-5 py-4">
              <div className="flex items-start gap-3">
                <span className="text-4xl">{card.icon}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-brand-600">{card.title}</p>
                  <p className="mt-1 text-lg font-semibold">{card.body}</p>
                  {card.stat && (
                    <p className="mt-2 text-gray-600">{card.stat}</p>
                  )}
                </div>
              </div>
              <WhyReasons reasons={card.reasons} className="mt-4" />
              <Link
                href={card.ctaHref}
                className="mt-4 inline-flex min-h-[52px] w-full items-center justify-center rounded-2xl bg-brand-600 text-lg font-semibold text-white hover:bg-brand-700"
              >
                {card.ctaLabel}
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
