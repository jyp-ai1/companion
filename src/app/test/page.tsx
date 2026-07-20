"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { completeIeumTest } from "@/app/actions/onboarding";
import { calculateTypeCode } from "@/lib/ieum/scoring";
import { generateIeumCode } from "@/lib/ieum/dna";
import { INTEREST_TAGS } from "@/lib/ieum/interests";
import type { Question } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";

type Phase = "interests" | "questions" | "generating";

const GENERATING_STEPS = [
  "모든 설정을 확인하고 있어요…",
  "관심사를 정리하고 있어요…",
  "나의 이음 코드를 생성하고 있어요…",
  "맞춤 추천을 준비하고 있어요…",
];

export default function TestPage() {
  const [phase, setPhase] = useState<Phase>("interests");
  const [selectedInterests, setSelectedInterests] = useState<Set<string>>(new Set());
  const [questions, setQuestions] = useState<Question[]>([]);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Map<number, "A" | "B">>(new Map());
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [generatingStep, setGeneratingStep] = useState(0);
  const [previewCode, setPreviewCode] = useState<{ title: string; code: string } | null>(
    null,
  );

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("questions")
      .select("*")
      .order("sort_order")
      .then(({ data }) => {
        setQuestions(data ?? []);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (phase !== "generating") return;
    const interval = setInterval(() => {
      setGeneratingStep((s) => (s + 1) % GENERATING_STEPS.length);
    }, 1200);
    return () => clearInterval(interval);
  }, [phase]);

  function toggleInterest(slug: string) {
    const next = new Set(selectedInterests);
    if (next.has(slug)) next.delete(slug);
    else if (next.size < 8) next.add(slug);
    setSelectedInterests(next);
  }

  const current = questions[step];

  async function finishTest(finalAnswers: Map<number, "A" | "B">) {
    setError("");
    setSubmitting(true);
    setPhase("generating");

    const interestList = Array.from(selectedInterests);
    const answerList = Array.from(finalAnswers.entries()).map(([question_id, selected_option]) => ({
      question_id,
      selected_option,
    }));

    const score = calculateTypeCode(questions, answerList);
    const dna = generateIeumCode(interestList, score);
    setPreviewCode({ title: dna.dna_title, code: dna.ieum_code });

    await new Promise((r) => setTimeout(r, 2800));

    const result = await completeIeumTest({
      interestSlugs: interestList,
      answers: answerList,
    });

    if (result.error) {
      setPhase("questions");
      setSubmitting(false);
      setError(result.error);
      return;
    }

    window.location.href = "/test/result";
  }

  async function selectOption(option: "A" | "B") {
    if (!current) return;
    const next = new Map(answers);
    next.set(current.id, option);
    setAnswers(next);

    if (step < questions.length - 1) {
      setStep(step + 1);
      return;
    }

    await finishTest(next);
  }

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-gray-600">불러오는 중...</p>
      </div>
    );
  }

  if (phase === "generating") {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-16">
        <div className="mx-auto w-full max-w-md text-center">
          <div className="animate-fade-in-up text-6xl">🧬</div>
          <h1 className="mt-8 text-2xl font-bold">거의 다 됐어요</h1>
          <p className="mt-3 text-lg text-warm-gray">{GENERATING_STEPS[generatingStep]}</p>
          {previewCode && (
            <Card className="mt-8 border-brand-200 bg-brand-50">
              <p className="text-sm text-brand-600">나의 이음 코드</p>
              <p className="mt-2 text-xl font-bold">{previewCode.title}</p>
              <p className="mt-1 font-mono text-brand-700">{previewCode.code}</p>
            </Card>
          )}
          <div className="mx-auto mt-8 h-2 w-48 overflow-hidden rounded-full bg-brand-100">
            <div className="h-full animate-pulse rounded-full bg-brand-600" style={{ width: "70%" }} />
          </div>
        </div>
      </div>
    );
  }

  if (phase === "interests") {
    return (
      <div className="flex flex-1 flex-col px-6 py-8">
        <div className="mx-auto w-full max-w-3xl">
          <ProgressBar current={2} total={3} label="가입 단계" />
          <h1 className="mt-8 text-2xl font-bold">나를 표현하는 관심사</h1>
          <p className="mt-2 text-gray-600">
            3~8개를 선택해 주세요. 이음 코드의 기반이 됩니다.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {INTEREST_TAGS.map(({ slug, label, emoji }) => {
              const selected = selectedInterests.has(slug);
              return (
                <button
                  key={slug}
                  type="button"
                  onClick={() => toggleInterest(slug)}
                  className={`min-h-[64px] rounded-2xl border-2 px-3 py-3 text-left font-medium transition-colors ${
                    selected
                      ? "border-brand-600 bg-brand-50 text-brand-800"
                      : "border-brand-100 hover:border-brand-300"
                  }`}
                >
                  <span className="text-xl">{emoji}</span>
                  <span className="mt-1 block">{label}</span>
                </button>
              );
            })}
          </div>
          {error && (
            <p className="mt-4 rounded-xl bg-red-50 p-3 text-red-700">{error}</p>
          )}
          <Button
            className="mt-8 w-full"
            disabled={selectedInterests.size < 3}
            onClick={() => {
              setError("");
              setPhase("questions");
            }}
          >
            다음 — 생활 질문 ({selectedInterests.size}개 선택)
          </Button>
        </div>
      </div>
    );
  }

  if (!current) {
    return (
      <div className="flex flex-1 items-center justify-center px-6">
        <Card className="text-center">
          <p>질문을 불러올 수 없습니다.</p>
          <p className="mt-2 text-sm text-gray-500">
            Supabase에 questions 시드 데이터가 있는지 확인해 주세요.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col px-6 py-8">
      <div className="mx-auto w-full max-w-md">
        <ProgressBar current={3} total={3} label="가입 단계" />
        <div className="mt-4">
          <ProgressBar
            current={step + 1}
            total={questions.length}
            label="이음 코드"
          />
        </div>
        <Card className="mt-8">
          <h1 className="mb-8 text-center leading-snug">{current.question}</h1>
          <div className="flex flex-col gap-4">
            <button
              type="button"
              disabled={submitting}
              onClick={() => selectOption("A")}
              className="min-h-[72px] rounded-2xl border-2 border-brand-100 bg-white px-5 py-4 text-left text-lg font-medium transition-colors hover:border-brand-500 hover:bg-brand-50"
            >
              {current.option_a}
            </button>
            <button
              type="button"
              disabled={submitting}
              onClick={() => selectOption("B")}
              className="min-h-[72px] rounded-2xl border-2 border-brand-100 bg-white px-5 py-4 text-left text-lg font-medium transition-colors hover:border-brand-500 hover:bg-brand-50"
            >
              {current.option_b}
            </button>
          </div>
          {error && (
            <p className="mt-4 rounded-xl bg-red-50 p-3 text-red-700">{error}</p>
          )}
          {step > 0 && (
            <Button variant="outline" className="mt-6 w-full" onClick={() => setStep(step - 1)}>
              ← 이전
            </Button>
          )}
          <Button
            variant="outline"
            className="mt-3 w-full"
            onClick={() => {
              setPhase("interests");
              setStep(0);
              setError("");
            }}
          >
            관심사 다시 선택
          </Button>
        </Card>
      </div>
    </div>
  );
}
