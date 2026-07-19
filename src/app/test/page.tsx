"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { calculateTypeCode } from "@/lib/ieum/scoring";
import type { Question } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";

export default function TestPage() {
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

    for (const a of answerList) {
      await supabase.from("answers").upsert({
        user_id: user.id,
        question_id: a.question_id,
        selected_option: a.selected_option,
      });
    }

    await supabase
      .from("user_profiles")
      .update({
        type_code: score.type_code,
        activity_score: score.activity_score,
        relationship_score: score.relationship_score,
        interest_score: score.interest_score,
        participation_score: score.participation_score,
        test_completed_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    window.location.href = "/test/result";
  }

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-gray-600">질문 불러오는 중...</p>
      </div>
    );
  }

  if (!current) {
    return (
      <div className="flex flex-1 items-center justify-center px-6">
        <Card className="text-center">
          <p>질문을 불러올 수 없습니다.</p>
          <p className="mt-2 text-sm text-gray-500">
            Supabase에 questions 테이블 seed가 필요합니다.
          </p>
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
            label="이음 타입"
          />
        </div>
        <Card className="mt-8">
          <h1 className="mb-8 text-center leading-snug">{current.question}</h1>
          <div className="flex flex-col gap-4">
            <button
              type="button"
              disabled={submitting}
              onClick={() => selectOption("A")}
              className="min-h-[72px] rounded-2xl border-2 border-brand-100 bg-white px-5 py-4 text-left text-lg font-medium transition-colors hover:border-brand-500 hover:bg-brand-50 active:bg-brand-100"
            >
              {current.option_a}
            </button>
            <button
              type="button"
              disabled={submitting}
              onClick={() => selectOption("B")}
              className="min-h-[72px] rounded-2xl border-2 border-brand-100 bg-white px-5 py-4 text-left text-lg font-medium transition-colors hover:border-brand-500 hover:bg-brand-50 active:bg-brand-100"
            >
              {current.option_b}
            </button>
          </div>
          {step > 0 && (
            <Button
              variant="outline"
              className="mt-6 w-full"
              onClick={() => setStep(step - 1)}
            >
              ← 이전
            </Button>
          )}
        </Card>
      </div>
    </div>
  );
}
