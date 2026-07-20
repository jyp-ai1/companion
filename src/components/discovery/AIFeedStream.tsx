import Link from "next/link";
import type { AIFeedItem } from "@/lib/ieum/discovery-engine";
import { Card } from "@/components/ui/Card";
import { WhyReasons } from "@/components/discovery/WhyReasons";

export function AIFeedStream({ items }: { items: AIFeedItem[] }) {
  return (
    <section className="mt-10">
      <h2 className="mb-4 text-xl font-bold">AI Feed</h2>
      <p className="mb-6 text-sm text-gray-600">
        추천이 피드입니다. 매일 새로운 발견이 업데이트됩니다.
      </p>
      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <Link key={item.id} href={item.href}>
            <Card className="hover:border-brand-300">
              <div className="flex items-start gap-3">
                <span className="text-2xl">{item.icon}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-brand-600">{item.headline}</p>
                  <p className="mt-1 font-semibold">{item.body}</p>
                  {item.badge && (
                    <span className="mt-2 inline-block rounded-full bg-brand-50 px-3 py-1 text-sm text-brand-700">
                      {item.badge}
                    </span>
                  )}
                  {item.reasons && item.reasons.length > 0 && (
                    <WhyReasons reasons={item.reasons} className="mt-3" compact />
                  )}
                </div>
                <span className="text-brand-500">→</span>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
