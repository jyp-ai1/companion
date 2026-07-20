"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import {
  markExperienceGuideSeen,
  startDemoMode,
} from "@/app/actions/experience";
import { DeviceMockup, type MockupScreen } from "@/components/emotional/DeviceMockup";
import { DemoDisclaimer } from "@/components/demo/DemoBanner";
import { Button } from "@/components/ui/Button";
import { EXPERIENCE_SCREENS, DEMO_STATS } from "@/lib/demo/experience-data";

const MOCKUP_BY_STEP: MockupScreen[] = ["today", "today", "invite", "memory"];

export function ExperienceGuide() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isReplay = searchParams.get("replay") === "1";
  const [step, setStep] = useState(0);
  const [pending, startTransition] = useTransition();

  const screen = EXPERIENCE_SCREENS[step];
  const isLast = step === EXPERIENCE_SCREENS.length - 1;

  function skip() {
    startTransition(async () => {
      await markExperienceGuideSeen();
      router.push(isReplay ? "/my/profile" : "/");
    });
  }

  function next() {
    if (!isLast) setStep((s) => s + 1);
  }

  function finishSignup() {
    startTransition(async () => {
      await markExperienceGuideSeen();
      router.push("/signup");
    });
  }

  function finishDemo() {
    startTransition(async () => {
      await startDemoMode();
    });
  }

  return (
    <div className="flex min-h-full flex-col bg-gradient-to-b from-brand-50 via-accent-50/20 to-white">
      <header className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🌿</span>
          <span className="font-bold text-brand-700">이음</span>
        </div>
        {!isLast && (
          <button
            type="button"
            onClick={skip}
            disabled={pending}
            className="min-h-[48px] px-2 text-sm text-warm-gray underline"
          >
            건너뛰기
          </button>
        )}
      </header>

      <div className="mx-auto flex w-full max-w-md flex-1 flex-col px-6 pb-10 pt-4">
        <div className="mb-6 flex justify-center gap-2">
          {EXPERIENCE_SCREENS.map((s, i) => (
            <span
              key={s.id}
              className={`h-2.5 w-2.5 rounded-full transition-colors ${
                i === step ? "bg-brand-600" : "bg-brand-200"
              }`}
            />
          ))}
        </div>

        <h1
          key={`title-${step}`}
          className="animate-slide-in whitespace-pre-line text-center text-2xl font-bold leading-snug"
        >
          {screen.title}
        </h1>

        <div key={`mockup-${step}`} className="animate-slide-in my-8">
          <DeviceMockup screen={MOCKUP_BY_STEP[step]} />
        </div>

        {step === 0 && (
          <p className="mb-4 text-center text-lg text-brand-800">
            오늘 {DEMO_STATS.walkingToday.region}에서{" "}
            <span className="font-bold">{DEMO_STATS.walkingToday.count}명</span>이
            함께 걷고 있습니다.
          </p>
        )}

        {step === 3 && (
          <p className="mb-4 text-center text-lg text-brand-800">
            이번 주 새로운 인연{" "}
            <span className="font-bold">{DEMO_STATS.newConnections.count}건</span>
          </p>
        )}

        <p
          key={`desc-${step}`}
          className="animate-fade-in-up whitespace-pre-line text-center text-lg leading-relaxed text-warm-gray"
        >
          {screen.description}
        </p>

        <DemoDisclaimer className="mt-6" />

        <div className="mt-auto pt-10">
          {!isLast ? (
            <Button onClick={next} className="w-full" size="lg">
              다음
            </Button>
          ) : (
            <div className="flex flex-col gap-3">
              <Button onClick={finishSignup} disabled={pending} size="lg" className="w-full">
                시작하기
              </Button>
              <Button
                onClick={finishDemo}
                disabled={pending}
                variant="outline"
                size="lg"
                className="w-full"
              >
                먼저 둘러보기
              </Button>
              {isReplay && (
                <Link
                  href="/my/profile"
                  className="text-center text-sm text-warm-gray underline"
                >
                  프로필로 돌아가기
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
