import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const features = [
  {
    emoji: "🌿",
    title: "이음 타입 테스트",
    description: "12개의 간단한 질문으로 나의 생활 유형을 알아보세요.",
  },
  {
    emoji: "🤝",
    title: "맞춤 모임 추천",
    description: "내 유형에 맞는 활동과 모임을 바로 추천해 드립니다.",
  },
  {
    emoji: "💬",
    title: "함께하는 친구",
    description: "비슷한 관심사를 가진 사람들과 자연스럽게 연결됩니다.",
  },
];

const steps = [
  { num: "1", text: "회원가입 (1분)" },
  { num: "2", text: "이음 타입 테스트 (2분)" },
  { num: "3", text: "추천 모임 참여" },
];

export default function Home() {
  return (
    <div className="flex flex-col flex-1">
      {/* Header */}
      <header className="border-b border-brand-100 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌿</span>
            <span className="text-xl font-bold text-brand-700">이음</span>
          </div>
          <span className="rounded-full bg-brand-50 px-3 py-1 text-sm font-medium text-brand-700">
            MVP
          </span>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-b from-brand-50 to-background px-6 py-16 md:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 text-lg font-medium text-brand-600">
            Age-Tech AI 플랫폼
          </p>
          <h1 className="mb-6 text-foreground">
            나와 잘 맞는
            <br />
            <span className="text-brand-600">활동과 친구</span> 찾기
          </h1>
          <p className="mx-auto mb-10 max-w-xl text-xl text-gray-600">
            12개의 간단한 질문으로 나의 생활 유형을 알아보고,
            <br className="hidden sm:block" />
            맞춤 모임을 추천받으세요.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button href="/signup" size="lg">
              시작하기
            </Button>
            <Button href="#how-it-works" variant="outline" size="lg">
              어떻게 작동하나요?
            </Button>
          </div>
          <p className="mt-6 text-base text-gray-500">
            가입부터 결과까지 약 3분 · 50~75세를 위한 서비스
          </p>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-10 text-center">3분이면 충분합니다</h2>
          <div className="flex flex-col gap-6 sm:flex-row sm:justify-center">
            {steps.map((step) => (
              <div key={step.num} className="flex items-center gap-4 sm:flex-col sm:text-center">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brand-600 text-xl font-bold text-white">
                  {step.num}
                </div>
                <p className="text-lg font-medium">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-10 text-center">이음이 특별한 이유</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.title} className="text-center">
                <div className="mb-4 text-4xl">{feature.emoji}</div>
                <h3 className="mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Type preview */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4">나의 이음 타입은?</h2>
          <p className="mb-8 text-gray-600">
            4가지 생활 축으로 16가지 유형을 분석합니다
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { emoji: "🌿", name: "활력 동행형", code: "A-C-H-R" },
              { emoji: "☕", name: "따뜻한 이야기형", code: "P-C-L-F" },
              { emoji: "📚", name: "조용한 성장형", code: "P-S-L-R" },
              { emoji: "🚶", name: "건강 루틴형", code: "A-S-H-R" },
            ].map((type) => (
              <Card key={type.code} className="flex items-center gap-4 text-left">
                <span className="text-3xl">{type.emoji}</span>
                <div>
                  <p className="font-semibold">{type.name}</p>
                  <p className="text-sm text-gray-500">{type.code}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-600 px-6 py-16 text-white">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-4 text-white">지금 바로 시작해 보세요</h2>
          <p className="mb-8 text-lg text-brand-100">
            나에게 맞는 활동과 친구가 기다리고 있습니다.
          </p>
          <Button
            href="/signup"
            variant="secondary"
            size="lg"
            className="bg-white text-brand-700 hover:bg-brand-50"
          >
            무료로 시작하기
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-brand-100 bg-white px-6 py-8">
        <div className="mx-auto max-w-5xl text-center text-sm text-gray-500">
          <p>© 2026 이음 (Companion) · Age-Tech AI Platform</p>
          <p className="mt-1">
            <Link href="/login" className="underline">
              로그인
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
