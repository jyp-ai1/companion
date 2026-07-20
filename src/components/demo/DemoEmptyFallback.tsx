import { Card } from "@/components/ui/Card";
import { DemoDisclaimer } from "@/components/demo/DemoBanner";
import {
  DEMO_TODAY_CARD,
  DEMO_TOGETHER,
} from "@/lib/demo/experience-data";

export function DemoEmptyActivity() {
  return (
    <div>
      <Card className="border-dashed border-brand-200 bg-brand-50/30">
        <p className="text-sm text-gray-600">아직 예정된 활동이 없어요.</p>
        <p className="mt-2 font-medium">이런 일이 생깁니다 ↓</p>
        <div className="mt-4 rounded-xl border border-brand-200 bg-white p-4">
          <p className="text-sm text-brand-600">오늘</p>
          <p className="font-bold">{DEMO_TODAY_CARD.title}</p>
          <p className="text-sm text-brand-700">{DEMO_TODAY_CARD.subtitle}</p>
        </div>
      </Card>
      <DemoDisclaimer className="mt-3" />
    </div>
  );
}

export function DemoEmptyTogether() {
  return (
    <div>
      <Card className="border-dashed border-brand-200 bg-brand-50/30 text-center">
        <p className="text-gray-600">아직 함께한 기록이 없어요.</p>
        <p className="mt-2 font-medium">이런 일이 생깁니다 ↓</p>
        <div className="mt-4 rounded-xl border border-brand-200 bg-white p-4 text-left">
          <p className="font-semibold">{DEMO_TOGETHER[0].label}</p>
          <p className="mt-1 text-sm text-gray-600">
            {DEMO_TOGETHER[0].lastActivity} · 새로운 사람을 만났어요
          </p>
        </div>
      </Card>
      <DemoDisclaimer className="mt-3" />
    </div>
  );
}
