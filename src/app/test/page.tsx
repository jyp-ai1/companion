"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { calculateTypeCode } from "@/lib/ieum/scoring";
import { generateIeumCode } from "@/lib/ieum/dna";
import { INTEREST_TAGS } from "@/lib/ieum/interests";
import type { Question } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";

type Phase = "interests" | "questions";

export default function TestPage() {
  const [phase, setPhase] = useState<Phase>("interests");
  const [selectedInterests, setSelectedInterests] = useState<Set<string>>(new Set());
  const [questions, setQuestions] = useState<Question[]>([]);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Map<number, "A" | "B">>(new Map());
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

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

  function toggleInterest(slug: string) {
    const next = new Set(selectedInterests);
    if (next.has(slug)) next.delete(slug);
    else if (next.size < 8) next.add(slug);
    setSelectedInterests(next);
  }

  const current = questions[step];

  async function selectOption(option: "A" | "B") {
    if (!current) return;
    const next = new Map(answers);
    next.set(current.id, option);
    setAnswers(next);

    if (step < questions.length - 1) {
      setStep(step + 1);
      return;
    }

    setSubmitting(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const answerList = Array.from(next.entries()).map(([question_id, selected_option]) => ({
      question_id,
      selected_option,
    }));

    const score = calculateTypeCode(questions, answerList);
    const interestList = Array.from(selectedInterests);
    const dna = generateIeumCode(interestList, score);

    for (const a of answerList) {
      await supabase.from("answers").upsert({
        user_id: user.id,
        question_id: a.question_id,
        selected_option: a.selected_option,
      });
    }

    await supabase.from("user_interests").delete().eq("user_id", user.id);
    if (interestList.length > 0) {
      await supabase.from("user_interests").insert(
        interestList.map((interest_slug) => ({
          user_id: user.id,
          interest_slug,
        })),
      );
    }

    await supabase
      .from("user_profiles")
      .update({
        type_code: score.type_code,
        activity_score: score.activity_score,
        relationship_score: score.relationship_score,
        interest_score: score.interest_score,
        participation_score: score.participation_score,
        ieum_code: dna.ieum_code,
        dna_title: dna.dna_title,
        test_completed_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    window.location.href = "/test/result";
  }

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-gray-600">불러오는 중...</p>
      </div>
    );
  }

  if (phase === "interests") {
    return (
      <div className="flex flex-1 flex-col px-6 py-8">
        <div className="mx-auto w-full max-w-lg">
          <ProgressBar current={2} total={3} label="가입 단계" />
          <h1 className="mt-8 text-2xl font-bold">나를 표현하는 관심사</h1>
          <p className="mt-2 text-gray-600">
            3~8개를 선택해 주세요. 이음 코드의 기반이 됩니다.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
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
          <Button
            className="mt-8 w-full"
            disabled={selectedInterests.size < 3}
            onClick={() => setPhase("questions")}
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
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col px-6 py-8">
      <div className="mx-auto w-full max-w-md">
        <ProgressBar current={2} total={3} label="가입 단계" />
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
            }}
          >
            관심사 다시 선택
          </Button>
        </Card>
      </div>
    </div>
  );
}
