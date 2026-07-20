import { EmptyState } from "@/components/emotional/EmotionalUI";
import { DemoDisclaimer } from "@/components/demo/DemoBanner";
import { Card } from "@/components/ui/Card";
import { DEMO_TODAY_CARD, DEMO_TOGETHER } from "@/lib/demo/experience-data";

export function DemoEmptyActivity() {
  return (
    <div>
      <EmptyState
        emoji="🚶"
        title="아직 첫 동행이 시작되지 않았어요"
        description="오늘 30분 산책부터 시작해 볼까요?"
        ctaLabel="오늘 함께 걸어보실래요?"
        ctaHref="/recommend"
        secondary={
          <Card className="mt-4 border-brand-100 bg-white text-left">
            <p className="text-xs text-brand-600">이런 일이 생깁니다</p>
            <p className="mt-1 font-bold">{DEMO_TODAY_CARD.title}</p>
            <p className="text-sm text-brand-700">{DEMO_TODAY_CARD.subtitle}</p>
          </Card>
        }
      />
      <DemoDisclaimer className="mt-3" />
    </div>
  );
}

export function DemoEmptyTogether() {
  return (
    <div>
      <EmptyState
        emoji="🌿"
        title="아직 함께한 기록이 없어요"
        description="첫 만남 후, 여기에 따뜻한 추억이 쌓입니다."
        ctaLabel="함께할 사람 찾기"
        ctaHref="/recommend"
        secondary={
          <Card className="mt-4 border-brand-100 bg-white text-left">
            <p className="font-semibold">{DEMO_TOGETHER[0].label}</p>
            <p className="mt-1 text-sm text-warm-gray">
              {DEMO_TOGETHER[0].lastActivity} · 새로운 사람을 만났어요
            </p>
          </Card>
        }
      />
      <DemoDisclaimer className="mt-3" />
    </div>
  );
}

export function DemoEmptyPeople() {
  return (
    <EmptyState
      emoji="😊"
      title="아직 비슷한 이웃을 찾고 있어요"
      description="3분이면 나와 맞는 관심사를 알려드릴게요."
      ctaLabel="이음 코드 만들기"
      ctaHref="/test"
    />
  );
}
