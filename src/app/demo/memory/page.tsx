import Link from "next/link";
import { DemoShell } from "@/components/demo/DemoShell";
import { DemoDisclaimer } from "@/components/demo/DemoBanner";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { DEMO_MEMORY, DEMO_STATS } from "@/lib/demo/experience-data";

export default function DemoMemoryPage() {
  return (
    <DemoShell title="Memory">
      <h1 className="mb-2 text-2xl font-bold">오늘의 추억</h1>
      <p className="mb-6 text-gray-600">당신의 하루가 추억으로 남습니다.</p>

      <Card className="border-2 border-brand-200 bg-gradient-to-br from-brand-50 via-white to-amber-50">
        <div className="flex items-start gap-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white text-4xl shadow-sm">
            📸
          </div>
          <div>
            <p className="text-sm text-brand-600">{DEMO_MEMORY.date}</p>
            <p className="mt-1 text-xl font-bold">{DEMO_MEMORY.activity}</p>
            <p className="mt-3 text-gray-700">
              새로운 인연{" "}
              <span className="font-bold text-brand-700">{DEMO_MEMORY.newPeople}명</span>
            </p>
            <p className="text-gray-700">
              함께한 시간{" "}
              <span className="font-bold">{DEMO_MEMORY.durationMinutes}분</span>
            </p>
            <p className="mt-3 text-brand-800">{DEMO_MEMORY.note}</p>
          </div>
        </div>
      </Card>

      <Card className="mt-6 text-center">
        <p className="text-gray-600">{DEMO_STATS.newConnections.label}</p>
        <p className="text-3xl font-bold text-brand-700">
          {DEMO_STATS.newConnections.count}건
        </p>
      </Card>

      <Button href="/signup" size="lg" className="mt-8 w-full">
        나도 시작하기
      </Button>

      <Link
        href="/welcome?replay=1"
        className="mt-4 block text-center text-sm text-gray-500 underline"
      >
        이용 가이드 다시 보기
      </Link>

      <DemoDisclaimer className="mt-6" />
    </DemoShell>
  );
}
