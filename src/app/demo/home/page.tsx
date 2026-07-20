import { DemoShell } from "@/components/demo/DemoShell";
import { DemoDisclaimer } from "@/components/demo/DemoBanner";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  DEMO_STATS,
  DEMO_TODAY_CARD,
  DEMO_INVITE_CARD,
} from "@/lib/demo/experience-data";

export default function DemoHomePage() {
  return (
    <DemoShell>
      <div className="mb-6">
        <p className="text-sm font-medium text-brand-600">오늘의 이음</p>
        <h1 className="mt-1 text-2xl font-bold">오늘, 30초만 함께해요.</h1>
      </div>

      <Card className="mb-4 border-2 border-brand-200 bg-brand-50/40">
        <p className="text-sm text-gray-600">
          오늘 {DEMO_STATS.walkingToday.region}에서{" "}
          <span className="font-bold text-brand-700">
            {DEMO_STATS.walkingToday.count}명
          </span>
          이 함께 걷고 있습니다.
        </p>
      </Card>

      <Card className="border-2 border-brand-200">
        <p className="text-sm font-medium text-brand-600">오늘</p>
        <p className="mt-2 text-xl font-bold">{DEMO_TODAY_CARD.title}</p>
        <p className="text-brand-700">{DEMO_TODAY_CARD.subtitle}</p>
        <p className="mt-2 text-gray-600">
          {DEMO_TODAY_CARD.time} · {DEMO_TODAY_CARD.location}
        </p>
        <Button href="/demo/discover" size="md" className="mt-4 w-full">
          오늘 함께 걸어보실래요?
        </Button>
      </Card>

      <Card className="mt-6">
        <p className="text-sm text-gray-600">오늘</p>
        <p className="mt-2 text-lg font-bold">{DEMO_INVITE_CARD.title}</p>
        <p className="mt-3 rounded-xl bg-brand-50 p-3 font-medium text-brand-800">
          {DEMO_INVITE_CARD.prompt}
        </p>
        <p className="mt-2 text-sm text-gray-500">{DEMO_INVITE_CARD.anonymous}</p>
      </Card>

      <DemoDisclaimer className="mt-8" />
    </DemoShell>
  );
}
