"use client";

import { useState, useTransition } from "react";
import { COPY } from "@/lib/copy";
import {
  AGAIN_OPTIONS,
  SATISFACTION_OPTIONS,
  type AgainChoice,
  type Satisfaction,
} from "@/lib/ieum/trust";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export type CoParticipant = {
  userId: string;
  label: string;
};

export function ActivityReviewForm({
  onSubmit,
  peers,
}: {
  peers: CoParticipant[];
  onSubmit: (data: {
    satisfaction: Satisfaction;
    comment: string;
    peerChoices: { peerUserId: string; choice: AgainChoice }[];
  }) => Promise<{ error?: string; ok?: boolean }>;
}) {
  const [pending, startTransition] = useTransition();
  const [step, setStep] = useState<"review" | "again">("review");
  const [satisfaction, setSatisfaction] = useState<Satisfaction | null>(null);
  const [comment, setComment] = useState("");
  const [choices, setChoices] = useState<Record<string, AgainChoice>>({});
  const [error, setError] = useState("");

  function submitReview() {
    if (!satisfaction) return;
    if (peers.length === 0) {
      startTransition(async () => {
        const res = await onSubmit({ satisfaction, comment, peerChoices: [] });
        if (res.error) setError(res.error);
      });
      return;
    }
    setStep("again");
  }

  function submitAgain() {
    if (!satisfaction) return;
    const missing = peers.some((p) => !choices[p.userId]);
    if (missing) {
      setError("함께한 분마다 선택해 주세요.");
      return;
    }

    startTransition(async () => {
      const res = await onSubmit({
        satisfaction,
        comment,
        peerChoices: peers.map((p) => ({
          peerUserId: p.userId,
          choice: choices[p.userId],
        })),
      });
      if (res.error) setError(res.error);
    });
  }

  if (step === "review") {
    return (
      <div className="flex flex-col gap-8">
        <div>
          <p className="mb-4 text-lg font-medium">{COPY.reviewTitle}</p>
          <div className="flex flex-col gap-3">
            {SATISFACTION_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setSatisfaction(opt.value)}
                className={`min-h-[56px] rounded-2xl border-2 px-4 text-left text-lg font-medium ${
                  satisfaction === opt.value
                    ? "border-brand-600 bg-brand-50"
                    : "border-brand-100"
                }`}
              >
                {opt.emoji} {opt.label}
              </button>
            ))}
          </div>
        </div>

        <Input
          label={COPY.reviewCommentLabel}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder={COPY.reviewCommentPlaceholder}
        />

        {error && <p className="text-red-600">{error}</p>}

        <Button
          onClick={submitReview}
          disabled={pending || !satisfaction}
          className="w-full"
        >
          {peers.length > 0 ? "다음" : pending ? "저장 중..." : "후기 남기기"}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <p className="text-lg font-medium">{COPY.againTitle}</p>
      {peers.map((peer) => (
        <div key={peer.userId}>
          <p className="mb-3 font-medium">{peer.label}</p>
          <div className="flex flex-col gap-2">
            {AGAIN_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() =>
                  setChoices((prev) => ({ ...prev, [peer.userId]: opt.value }))
                }
                className={`min-h-[52px] rounded-2xl border-2 px-4 text-lg font-medium ${
                  choices[peer.userId] === opt.value
                    ? "border-brand-600 bg-brand-50"
                    : "border-brand-100"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      ))}

      {error && <p className="text-red-600">{error}</p>}

      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={() => setStep("review")}
          disabled={pending}
          className="flex-1"
        >
          이전
        </Button>
        <Button onClick={submitAgain} disabled={pending} className="flex-1">
          {pending ? "저장 중..." : "완료"}
        </Button>
      </div>
    </div>
  );
}
