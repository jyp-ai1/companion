import { DemoShell } from "@/components/demo/DemoShell";
import { DemoDisclaimer } from "@/components/demo/DemoBanner";
import { Card } from "@/components/ui/Card";
import { DEMO_TOGETHER } from "@/lib/demo/experience-data";

export default function DemoTogetherPage() {
  return (
    <DemoShell title="Together">
      <h1 className="mb-2 text-2xl font-bold">함께한 사람</h1>
      <p className="mb-6 text-gray-600">새로운 사람을 만났어요.</p>

      <div className="mb-6 grid grid-cols-3 gap-3">
        <Card className="text-center">
          <p className="text-2xl font-bold text-brand-700">2</p>
          <p className="mt-1 text-xs text-gray-600">이번 달 함께한 사람</p>
        </Card>
        <Card className="text-center">
          <p className="text-2xl font-bold text-brand-700">1</p>
          <p className="mt-1 text-xs text-gray-600">새로운 인연</p>
        </Card>
        <Card className="text-center">
          <p className="text-2xl font-bold text-brand-700">1</p>
          <p className="mt-1 text-xs text-gray-600">자주 함께하는 사람</p>
        </Card>
      </div>

      <h2 className="mb-4 text-lg font-bold">가장 많이 만난 사람</h2>
      <div className="flex flex-col gap-3">
        {DEMO_TOGETHER.map((c) => (
          <Card key={c.id}>
            <p className="font-semibold">{c.label}</p>
            <p className="mt-1 text-sm text-gray-600">
              {c.lastActivity} · {c.meetCount}번 함께
            </p>
          </Card>
        ))}
      </div>

      <DemoDisclaimer className="mt-8" />
    </DemoShell>
  );
}
