import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const features = [
  {
    emoji: "🌿",
    title: "함께하기 요청",
    description: "예약·채팅 없이, 오늘 같이 걸을 사람을 찾아요.",
  },
  {
    emoji: "🔒",
    title: "Anonymous First",
    description: "이름 대신 연령·지역·관심사만. 활동 후 상호 동의 시 공개.",
  },
  {
    emoji: "💌",
    title: "AI 초대 문구",
    description: "부담 없는 초대 문구를 자동으로 만들어 드립니다.",
  },
];

const steps = [
  { num: "1", text: "관심사로 이음 코드 (3분)" },
  { num: "2", text: "함께하기 요청 만들기" },
  { num: "3", text: "함께한 뒤 프로필 공개" },
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
            관심사로 이어지는 동행
          </p>
          <h1 className="mb-6 text-foreground">
            오늘,
            <br />
            <span className="text-brand-600">함께할 사람</span>을 찾아요
          </h1>
          <p className="mx-auto mb-10 max-w-xl text-xl text-gray-600">
            이름보다 관심사. 예약보다 초대.
            <br className="hidden sm:block" />
            30초면 오늘의 동행을 시작할 수 있어요.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button href="/signup" size="lg">
              시작하기
            </Button>
            <Button href="/demo/home" variant="outline" size="lg">
              먼저 둘러보기
            </Button>
            <Button href="#how-it-works" variant="outline" size="lg">
              어떻게 작동하나요?
            </Button>
          </div>
          <p className="mt-6 text-base text-gray-500">
            가입부터 첫 동행까지 약 3분 · 부담 없는 Anonymous First
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
          <h2 className="mb-4">나의 이음 코드는?</h2>
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
            혼자 들어왔다가, 함께 나갑니다.
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
