import { DemoShell } from "@/components/demo/DemoShell";
import { DemoDisclaimer } from "@/components/demo/DemoBanner";
import { Card } from "@/components/ui/Card";
import { DEMO_DISCOVER, DEMO_STATS } from "@/lib/demo/experience-data";

export default function DemoDiscoverPage() {
  return (
    <DemoShell title="Discover">
      <h1 className="mb-2 text-2xl font-bold">오늘의 추천</h1>
      <p className="mb-6 text-gray-600">
        오늘 가장 잘 맞는 활동을 추천해 드립니다.
      </p>

      <Card className="mb-6 bg-brand-50">
        <p className="text-sm text-gray-600">{DEMO_STATS.coffeeThisWeek.label}</p>
        <p className="text-2xl font-bold text-brand-700">
          {DEMO_STATS.coffeeThisWeek.count}명
        </p>
      </Card>

      <div className="flex flex-col gap-4">
        {DEMO_DISCOVER.map((item) => (
          <Card key={item.title} className="border-brand-200">
            <div className="flex items-center gap-4">
              <span className="text-4xl">{item.emoji}</span>
              <div>
                <p className="font-bold">{item.title}</p>
                <p className="text-sm text-brand-700">함께할 사람 {item.people}명</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <DemoDisclaimer className="mt-8" />
    </DemoShell>
  );
}
