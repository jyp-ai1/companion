"use client";

import { useState, useTransition } from "react";
import { submitDailyCheckIn } from "@/app/actions/habit";
import { Card } from "@/components/ui/Card";
import type { DailyQuestion } from "@/lib/ieum/habit-engine";
import { DAILY_MOODS } from "@/lib/ieum/habit-engine";

export function DailyCheckInCard({
  question,
  savedAnswer,
  savedMood,
  dnaTitle,
}: {
  question: DailyQuestion;
  savedAnswer: string | null;
  savedMood: string | null;
  dnaTitle: string | null;
}) {
  const [pending, startTransition] = useTransition();
  const [answer, setAnswer] = useState(savedAnswer);
  const [mood, setMood] = useState(savedMood);
  const [draftAnswer, setDraftAnswer] = useState<string | null>(savedAnswer);

  function submit(a: string, m: string) {
    startTransition(async () => {
      await submitDailyCheckIn(question.key, a, m);
      setAnswer(a);
      setMood(m);
    });
  }

  if (answer && mood) {
    return (
      <Card className="border-brand-200 bg-brand-50">
        <p className="text-sm font-medium text-brand-600">오늘의 체크인 ✓</p>
        <p className="mt-2 text-gray-700">
          {dnaTitle ? `${dnaTitle} · ` : ""}오늘 답변을 바탕으로 추천을 준비했어요.
        </p>
        <p className="mt-1 text-sm text-warm-gray">내일 새로운 질문이 열립니다.</p>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-brand-200">
      <p className="text-sm font-medium text-brand-600">오늘의 질문 · 기분</p>
      <p className="mt-3 text-xl font-bold">{question.text}</p>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {question.options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            disabled={pending}
            onClick={() => setDraftAnswer(opt.value)}
            className={`min-h-[72px] rounded-2xl border-2 px-3 py-3 text-left transition-colors ${
              draftAnswer === opt.value
                ? "border-brand-600 bg-brand-50"
                : "border-brand-100 bg-white hover:border-brand-400 hover:bg-brand-50"
            }`}
          >
            <span className="text-xl">{opt.emoji}</span>
            <span className="mt-1 block text-sm font-medium">{opt.label}</span>
          </button>
        ))}
      </div>

      <p className="mt-6 text-base font-semibold">오늘 기분은 어떤가요?</p>
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {DAILY_MOODS.map((m) => (
          <button
            key={m.value}
            type="button"
            disabled={pending || !draftAnswer}
            onClick={() => draftAnswer && submit(draftAnswer, m.value)}
            className="min-h-[56px] rounded-2xl border-2 border-brand-100 bg-white px-2 py-2 text-sm font-medium hover:border-brand-500 hover:bg-brand-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <span className="mr-1">{m.emoji}</span>
            {m.label}
          </button>
        ))}
      </div>
      {!draftAnswer && (
        <p className="mt-3 text-sm text-warm-gray">질문에 답한 뒤 기분을 선택해 주세요.</p>
      )}
    </Card>
  );
}
