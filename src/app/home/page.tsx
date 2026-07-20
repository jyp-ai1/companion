import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { OpenActivityCard, TodayHabitCard } from "@/components/habit/TodayHabitCard";
import { Button } from "@/components/ui/Button";
import { COPY } from "@/lib/copy";
import { getHabitContext } from "@/lib/ieum/habit-context";

export default async function HomePage() {
  const habit = await getHabitContext();
  if (!habit) return null;

  const { profile, cardType, question, micro, questionAnswered, microAnswered, openActivities, topOpen } =
    habit;

  return (
    <AppShell>
      <div className="mb-6">
        <p className="text-sm font-medium text-brand-600">{COPY.brand}</p>
        <h1 className="mt-1 text-2xl font-bold">
          {profile?.display_name ?? "회원"}님, {COPY.tagline}
        </h1>
      </div>

      {!profile?.test_completed_at && (
        <div className="mb-6 rounded-2xl border border-brand-200 bg-brand-50 p-4">
          <p className="font-medium">3분만에 이음 코드를 만들어 주세요</p>
          <Button href="/test" size="md" className="mt-3">
            시작하기
          </Button>
        </div>
      )}

      <section>
        <p className="mb-3 text-sm text-gray-500">오늘 카드 · 하나만</p>
        <TodayHabitCard
          cardType={cardType}
          question={question}
          micro={micro}
          questionAnswered={questionAnswered}
          microAnswered={microAnswered}
          topOpen={topOpen}
        />
      </section>

      {openActivities.length > 1 && cardType !== "open" && (
        <section className="mt-10">
          <h2 className="mb-4 text-lg font-bold">{COPY.openActivity}</h2>
          <div className="flex flex-col gap-4">
            {openActivities.slice(0, 2).map((a) => (
              <OpenActivityCard
                key={a.id}
                activity={a}
                invitationMessage={a.invitation_message}
              />
            ))}
          </div>
        </section>
      )}

      <section className="mt-10">
        <Button href="/invite" className="w-full">
          {COPY.togetherRequest} 만들기
        </Button>
        <p className="mt-2 text-center text-xs text-gray-500">{COPY.anonymousNote}</p>
      </section>

      <nav className="mt-12 grid grid-cols-3 gap-3">
        <Link
          href="/recommend"
          className="rounded-2xl bg-brand-50 py-4 text-center font-medium text-brand-800"
        >
          ✨ Discover
        </Link>
        <Link
          href="/together"
          className="rounded-2xl bg-brand-50 py-4 text-center font-medium text-brand-800"
        >
          ❤️ Together
        </Link>
        <Link
          href="/my"
          className="rounded-2xl bg-brand-50 py-4 text-center font-medium text-brand-800"
        >
          📅 Activity
        </Link>
      </nav>

      <p className="mt-8 text-center text-xs text-gray-400">
        푸시 알림(설계): 아침·오후·저녁 오늘의 이음 한 줄
      </p>
    </AppShell>
  );
}
