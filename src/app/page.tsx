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
import { SHELL_HEADER, SHELL_HEADER_INNER } from "@/lib/layout";

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

const NAV_LINKS = [
  { href: "/demo/home", label: "둘러보기" },
  { href: "/welcome", label: "시작하기" },
  { href: "/login", label: "로그인" },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <header className={SHELL_HEADER}>
        <div className={SHELL_HEADER_INNER}>
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🌿</span>
            <span className="text-xl font-bold text-black">이음</span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full px-4 py-2 text-[15px] font-medium text-[#212121] hover:bg-neutral-100"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <Link
            href="/login"
            className="rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800"
          >
            로그인
          </Link>
        </div>
      </header>

      <section className="relative overflow-hidden bg-[#fff7f7] px-4 py-14 md:px-6 md:py-20 lg:px-8 lg:py-24">
        <div className="mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="animate-fade-in-up text-center lg:text-left">
            <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-accent-600 md:text-base">
              관심사로 이어지는 동행
            </p>
            <h1 className="mb-6 whitespace-pre-line">
              오늘도{"\n"}
              <span className="text-black">누군가와 함께</span>라면{"\n"}
              더 좋은 하루가 됩니다.
            </h1>
            <p className="mx-auto mb-8 max-w-xl text-lg leading-relaxed text-warm-gray lg:mx-0">
              추천부터가 아니라, 둘러보며 발견하는 서비스.
              <br className="hidden sm:block" />
              관심사 → 활동 → 사람 → 함께하기.
            </p>
            <div className="flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
              <Button href="/welcome" size="lg">
                시작하기
              </Button>
              <Button href="/demo/home" variant="outline" size="lg">
                먼저 둘러보기
              </Button>
            </div>
            <ActionChips actions={LANDING_ACTIONS.slice(0, 3)} />
          </div>

          <div className="animate-fade-in-up flex justify-center lg:justify-end">
            <DeviceMockup screen="today" />
          </div>
        </div>
      </section>

      <section className="px-4 py-16 md:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto w-full max-w-7xl">
          <h2 className="mb-4 text-center">이런 일이 생깁니다</h2>
          <p className="mb-12 text-center text-lg text-warm-gray">
            설명이 아니라, 하루의 흐름을 보여드려요.
          </p>
          <div className="grid gap-10 md:grid-cols-3">
            <div className="flex flex-col items-center">
              <DeviceMockup screen="today" />
              <p className="mt-4 text-center font-medium">오늘 둘러볼 거리</p>
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

      <section className="bg-white px-4 py-16 md:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-5xl">
          <div className="grid gap-4 md:grid-cols-3">
            {moments.map((m) => (
              <Card
                key={m.title}
                className="flex flex-col items-center text-center transition-shadow hover:shadow-md md:items-start md:text-left"
              >
                <span className="text-5xl">{m.emoji}</span>
                <h3 className="mb-1 mt-4">{m.title}</h3>
                <p className="text-warm-gray">{m.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-black px-4 py-16 text-white md:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto w-full max-w-3xl text-center">
          <h2 className="mb-4 whitespace-pre-line text-white">
            여기 한번{"\n"}써보고 싶다.
          </h2>
          <p className="mb-8 text-lg text-neutral-300">
            30초면 첫 동행을 둘러볼 수 있어요.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button
              href="/welcome"
              variant="secondary"
              size="lg"
              className="bg-white text-black hover:bg-neutral-100"
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

      <footer className="border-t border-neutral-200 bg-white px-4 py-8 md:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-7xl text-center text-sm text-warm-gray">
          <p>© 2026 이음 — 관심사로 이어지는 동행</p>
        </div>
      </footer>
    </div>
  );
}
