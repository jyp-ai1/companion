import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  ActionChips,
} from "@/components/emotional/EmotionalUI";
import {
  DeviceMockup,
  LANDING_ACTIONS,
} from "@/components/emotional/DeviceMockup";

const moments = [
  {
    emoji: "🚶",
    title: "같이 걸어요",
    description: "30분 산책으로 시작하는 가벼운 만남",
  },
  {
    emoji: "☕",
    title: "커피 한 잔",
    description: "부담 없이, 익명으로, 천천히",
  },
  {
    emoji: "🌿",
    title: "오늘의 추억",
    description: "함께한 시간이 추억으로 남습니다",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col flex-1">
      <header className="border-b border-brand-100/80 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌿</span>
            <span className="text-xl font-bold text-brand-700">이음</span>
          </div>
          <Link href="/login" className="min-h-[48px] px-3 py-2 text-brand-700 underline">
            로그인
          </Link>
        </div>
      </header>

      {/* Hero — Emotional */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 via-accent-50/30 to-background px-6 py-14 md:py-20">
        <div className="mx-auto grid max-w-5xl items-center gap-12 md:grid-cols-2">
          <div className="animate-fade-in-up text-center md:text-left">
            <p className="mb-4 text-lg font-medium text-brand-600">
              관심사로 이어지는 동행
            </p>
            <h1 className="mb-6 whitespace-pre-line text-foreground">
              오늘도{"\n"}
              <span className="text-brand-600">누군가와 함께</span>라면{"\n"}
              더 좋은 하루가 됩니다.
            </h1>
            <p className="mx-auto mb-8 max-w-lg text-xl leading-relaxed text-warm-gray md:mx-0">
              로그인부터 추천까지가 아니라,
              <br className="hidden sm:block" />
              따뜻한 만남부터 시작합니다.
            </p>
            <div className="flex flex-col items-center gap-3 sm:flex-row md:justify-start">
              <Button href="/welcome" size="lg">
                시작하기
              </Button>
              <Button href="/demo/home" variant="outline" size="lg">
                먼저 둘러보기
              </Button>
            </div>
            <ActionChips actions={LANDING_ACTIONS.slice(0, 3)} />
          </div>

          <div className="animate-fade-in-up flex justify-center md:justify-end">
            <DeviceMockup screen="today" />
          </div>
        </div>
      </section>

      {/* Mockup showcase */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-4 text-center">이런 일이 생깁니다</h2>
          <p className="mb-12 text-center text-lg text-warm-gray">
            설명이 아니라, 하루의 흐름을 보여드려요.
          </p>
          <div className="grid gap-10 md:grid-cols-3">
            <div className="flex flex-col items-center">
              <DeviceMockup screen="today" />
              <p className="mt-4 text-center font-medium">오늘의 추천</p>
            </div>
            <div className="flex flex-col items-center">
              <DeviceMockup screen="invite" />
              <p className="mt-4 text-center font-medium">함께하기</p>
            </div>
            <div className="flex flex-col items-center">
              <DeviceMockup screen="memory" />
              <p className="mt-4 text-center font-medium">오늘의 추억</p>
            </div>
          </div>
        </div>
      </section>

      {/* Moments */}
      <section className="bg-white px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <div className="flex flex-col gap-6">
            {moments.map((m) => (
              <Card
                key={m.title}
                className="flex items-center gap-5 border-brand-100 transition-shadow hover:shadow-md"
              >
                <span className="text-5xl">{m.emoji}</span>
                <div>
                  <h3 className="mb-1">{m.title}</h3>
                  <p className="text-warm-gray">{m.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-brand-600 to-brand-700 px-6 py-16 text-white">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-4 whitespace-pre-line text-white">
            여기 한번{"\n"}써보고 싶다.
          </h2>
          <p className="mb-8 text-lg text-brand-100">
            30초면 첫 동행을 둘러볼 수 있어요.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button
              href="/welcome"
              variant="secondary"
              size="lg"
              className="bg-white text-brand-700 hover:bg-brand-50"
            >
              시작하기
            </Button>
            <Button
              href="/demo/home"
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white/10"
            >
              먼저 둘러보기
            </Button>
          </div>
        </div>
      </section>

      <footer className="border-t border-brand-100 bg-white px-6 py-8">
        <div className="mx-auto max-w-5xl text-center text-sm text-warm-gray">
          <p>© 2026 이음 — 관심사로 이어지는 동행</p>
        </div>
      </footer>
    </div>
  );
}
