import {
  DEMO_INVITE_CARD,
  DEMO_MEMORY,
  DEMO_TODAY_CARD,
} from "@/lib/demo/experience-data";
import { Card } from "@/components/ui/Card";

export function IllustrationDiscover() {
  return (
    <div className="flex justify-center gap-4 py-4">
      <div className="flex flex-col items-center rounded-3xl bg-green-50 px-6 py-5">
        <span className="text-5xl">🚶‍♀️🚶‍♂️</span>
        <p className="mt-2 text-sm text-green-800">공원 산책</p>
      </div>
      <div className="flex flex-col items-center rounded-3xl bg-amber-50 px-6 py-5">
        <span className="text-5xl">☕😊</span>
        <p className="mt-2 text-sm text-amber-900">카페</p>
      </div>
    </div>
  );
}

export function IllustrationRecommend() {
  return (
    <Card className="mx-auto max-w-sm border-2 border-brand-200 bg-white">
      <p className="text-sm font-medium text-brand-600">오늘</p>
      <p className="mt-2 text-xl font-bold">{DEMO_TODAY_CARD.title}</p>
      <p className="mt-1 text-brand-700">{DEMO_TODAY_CARD.subtitle}</p>
      <p className="mt-3 text-sm text-gray-600">
        📍 {DEMO_TODAY_CARD.location} · {DEMO_TODAY_CARD.time}
      </p>
    </Card>
  );
}

export function IllustrationInvite() {
  return (
    <Card className="mx-auto max-w-sm border-2 border-brand-200">
      <p className="text-sm text-gray-600">오늘</p>
      <p className="mt-2 text-xl font-bold">{DEMO_INVITE_CARD.title}</p>
      <p className="mt-3 rounded-xl bg-brand-50 p-4 text-lg font-medium text-brand-800">
        {DEMO_INVITE_CARD.prompt}
      </p>
      <p className="mt-3 text-sm text-gray-500">{DEMO_INVITE_CARD.anonymous}</p>
    </Card>
  );
}

export function IllustrationMemory() {
  return (
    <Card className="mx-auto max-w-sm border-2 border-brand-200 bg-gradient-to-br from-brand-50 to-amber-50">
      <div className="flex gap-3">
        <span className="text-4xl">📸</span>
        <div>
          <p className="font-semibold">{DEMO_MEMORY.activity}</p>
          <p className="mt-2 text-sm text-gray-700">
            새로운 인연 {DEMO_MEMORY.newPeople}명 · 함께한 시간{" "}
            {DEMO_MEMORY.durationMinutes}분
          </p>
          <p className="mt-2 text-brand-700">{DEMO_MEMORY.note}</p>
        </div>
      </div>
    </Card>
  );
}

export function ExperienceIllustration({
  type,
}: {
  type: "discover" | "recommend" | "invite" | "memory";
}) {
  switch (type) {
    case "discover":
      return <IllustrationDiscover />;
    case "recommend":
      return <IllustrationRecommend />;
    case "invite":
      return <IllustrationInvite />;
    case "memory":
      return <IllustrationMemory />;
  }
}
