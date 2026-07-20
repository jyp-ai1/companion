import { DemoShell } from "@/components/demo/DemoShell";
import { DemoDisclaimer } from "@/components/demo/DemoBanner";
import { Card } from "@/components/ui/Card";
import { DEMO_ACTIVITIES } from "@/lib/demo/experience-data";

export default function DemoActivityPage() {
  return (
    <DemoShell title="Activity">
      <h1 className="mb-6 text-2xl font-bold">나의 활동</h1>

      <h2 className="mb-3 text-lg font-bold">예정</h2>
      <div className="mb-8 flex flex-col gap-3">
        {DEMO_ACTIVITIES.upcoming.map((a) => (
          <Card key={a.id} className="border-brand-200">
            <span className="rounded-full bg-brand-50 px-3 py-1 text-sm text-brand-700">
              {a.category}
            </span>
            <p className="mt-2 text-xl font-semibold">{a.title}</p>
            <p className="mt-1 text-gray-600">📍 {a.location}</p>
          </Card>
        ))}
      </div>

      <h2 className="mb-3 text-lg font-bold">완료</h2>
      <div className="flex flex-col gap-3">
        {DEMO_ACTIVITIES.completed.map((a) => (
          <Card key={a.id}>
            <span className="rounded-full bg-gray-100 px-3 py-1 text-sm">완료</span>
            <p className="mt-2 text-xl font-semibold">{a.title}</p>
            <p className="mt-2 text-brand-700">{a.note}</p>
          </Card>
        ))}
      </div>

      <DemoDisclaimer className="mt-8" />
    </DemoShell>
  );
}
