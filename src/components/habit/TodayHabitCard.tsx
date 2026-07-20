"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import {
  submitDailyQuestion,
  submitMicroAction,
} from "@/app/actions/habit";
import { joinTogetherRequest } from "@/app/actions/growth";
import { SafeMeetGuide } from "@/components/trust/SafeMeetGuide";
import type { DailyQuestion, MicroAction, OpenActivityItem } from "@/lib/ieum/habit-engine";
import { formatOpenTime, getInterestEmoji, COPY } from "@/lib/ieum/habit-engine";
import { Card } from "@/components/ui/Card";

export function DailyQuestionCard({
  question,
  answered,
}: {
  question: DailyQuestion;
  answered: string | null;
}) {
  const [pending, startTransition] = useTransition();
  const [done, setDone] = useState(answered);

  function pick(value: string) {
    startTransition(async () => {
      await submitDailyQuestion(question.key, value);
      setDone(value);
    });
  }

  if (done) {
    return (
      <Card className="border-brand-200 bg-brand-50 text-center">
        <p className="text-sm text-brand-600">오늘의 질문 ✓</p>
        <p className="mt-2 text-gray-700">내일 새로운 질문이 열립니다.</p>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-brand-200">
      <p className="text-sm font-medium text-brand-600">오늘의 질문 · 5초</p>
      <p className="mt-3 text-xl font-bold">{question.text}</p>
      <div className="mt-6 grid grid-cols-2 gap-3">
        {question.options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            disabled={pending}
            onClick={() => pick(opt.value)}
            className="min-h-[64px] rounded-2xl border-2 border-brand-100 bg-white px-3 py-3 text-left font-medium hover:border-brand-500 hover:bg-brand-50"
          >
            <span className="text-xl">{opt.emoji}</span>
            <span className="mt-1 block">{opt.label}</span>
          </button>
        ))}
      </div>
    </Card>
  );
}

export function MicroActionCard({
  micro,
  answered,
}: {
  micro: MicroAction;
  answered: string | null;
}) {
  const [pending, startTransition] = useTransition();
  const [done, setDone] = useState(answered);

  function respond(response: "yes" | "later") {
    startTransition(async () => {
      await submitMicroAction(micro.key, response);
      setDone(response);
    });
  }

  if (done === "yes") {
    return (
      <Card className="border-brand-200 bg-brand-50 text-center">
        <p className="text-3xl">🌿</p>
        <p className="mt-3 font-semibold">좋아요! 오늘 함께할 이웃을 찾아볼게요.</p>
      </Card>
    );
  }
  if (done === "later") {
    return (
      <Card className="text-center">
        <p className="text-gray-600">괜찮아요. 내일 다시 물어볼게요 😊</p>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-brand-200">
      <p className="text-sm font-medium text-brand-600">Micro Action · 5초</p>
      <p className="mt-3 text-xl font-bold">{micro.title}</p>
      <p className="mt-2 text-gray-700">{micro.body}</p>
      <div className="mt-6 flex flex-col gap-3">
        <button
          type="button"
          disabled={pending}
          onClick={() => respond("yes")}
          className="min-h-[56px] rounded-2xl bg-brand-600 text-lg font-semibold text-white hover:bg-brand-700"
        >
          {COPY.joinYes}
        </button>
        <button
          type="button"
          disabled={pending}
          onClick={() => respond("later")}
          className="min-h-[52px] rounded-2xl border-2 border-brand-100 font-medium hover:bg-brand-50"
        >
          {COPY.joinLater}
        </button>
      </div>
    </Card>
  );
}

export function OpenActivityCard({
  activity,
  invitationMessage,
}: {
  activity: OpenActivityItem;
  invitationMessage?: string | null;
}) {
  const [pending, startTransition] = useTransition();
  const [joined, setJoined] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  function join() {
    startTransition(async () => {
      await joinTogetherRequest(activity.id);
      setJoined(true);
      setShowGuide(true);
    });
  }

  const ended =
    new Date(activity.starts_at).getTime() +
      activity.duration_minutes * 60000 <
    Date.now();

  const emoji = activity.interest_slug
    ? getInterestEmoji(activity.interest_slug)
    : "🌿";

  return (
    <Card className="border-2 border-brand-200">
      <p className="text-sm font-medium text-brand-600">Open Activity · 즉석 · Anonymous</p>
      {invitationMessage && (
        <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-gray-700">
          {invitationMessage}
        </p>
      )}
      <div className="mt-3 flex items-start gap-3">
        <span className="text-4xl">{emoji}</span>
        <div>
          <p className="text-lg font-bold">{activity.title}</p>
          <p className="mt-1 text-gray-600">
            {formatOpenTime(activity.starts_at)} · {activity.location_name}
          </p>
          <p className="text-gray-600">
            {activity.duration_minutes}분 · 참여 {activity.participant_count}명
          </p>
        </div>
      </div>
      {joined ? (
        <>
          {showGuide && <SafeMeetGuide onDismiss={() => setShowGuide(false)} />}
          <p className="mt-4 rounded-xl bg-brand-50 p-3 text-center font-medium text-brand-800">
            함께하기로 등록했어요 🎉
          </p>
          {ended && (
            <Link
              href={`/activities/${activity.id}/review`}
              className="mt-3 block min-h-[52px] rounded-2xl border-2 border-brand-600 bg-white text-center text-lg font-semibold leading-[52px] text-brand-700"
            >
              활동 후기 남기기
            </Link>
          )}
        </>
      ) : (
        <button
          type="button"
          disabled={pending}
          onClick={join}
          className="mt-4 min-h-[52px] w-full rounded-2xl bg-brand-600 text-lg font-semibold text-white hover:bg-brand-700"
        >
          {COPY.joinPrompt}
        </button>
      )}
    </Card>
  );
}

export function TodayHabitCard({
  cardType,
  question,
  micro,
  questionAnswered,
  microAnswered,
  topOpen,
}: {
  cardType: "question" | "micro" | "open";
  question: DailyQuestion;
  micro: MicroAction;
  questionAnswered: string | null;
  microAnswered: string | null;
  topOpen: OpenActivityItem | null;
}) {
  if (cardType === "open" && topOpen) {
    return <OpenActivityCard activity={topOpen} invitationMessage={topOpen.invitation_message} />;
  }
  if (cardType === "micro") {
    return <MicroActionCard micro={micro} answered={microAnswered} />;
  }
  return <DailyQuestionCard question={question} answered={questionAnswered} />;
}
