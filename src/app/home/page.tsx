import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { DailyMessageCard } from "@/components/emotional/EmotionalUI";
import { OpenActivityCard, TodayHabitCard } from "@/components/habit/TodayHabitCard";
import { Button } from "@/components/ui/Button";
import { COPY } from "@/lib/copy";
import { getDailyMessage } from "@/lib/ieum/daily-messages";
import { getHabitContext } from "@/lib/ieum/habit-context";

export default async function HomePage() {
  const habit = await getHabitContext();
  if (!habit) return null;

  const dailyMessage = getDailyMessage();
  const { profile, cardType, question, micro, questionAnswered, microAnswered, openActivities, topOpen } =
    habit;

  return (
    <AppShell>
      <DailyMessageCard message={dailyMessage} />

      <div className="mb-6">
        <p className="text-sm font-medium text-brand-600">🌿 {COPY.brandPromise}</p>
        <h1 className="mt-1 text-2xl font-bold">
          {profile?.display_name ?? "회원"}님, {COPY.tagline}
        </h1>
      </div>

      {!profile?.test_completed_at && (
        <div className="mb-6 rounded-2xl border border-accent-100 bg-accent-50 p-5">
          <p className="text-lg font-medium">3분이면 나와 맞는 이웃을 찾아드려요</p>
          <p className="mt-2 text-warm-gray">복잡하지 않아요. 천천히 시작해 보세요.</p>
          <Button href="/test" size="md" className="mt-4">
            시작하기
          </Button>
        </div>
      )}

      <section className="animate-fade-in-up">
        <p className="mb-3 text-sm text-warm-gray">오늘 카드 · 하나만</p>
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
        <p className="mt-2 text-center text-xs text-warm-gray">{COPY.anonymousNote}</p>
      </section>

      <nav className="mt-12 grid grid-cols-3 gap-3">
        {[
          { href: "/recommend", icon: "✨", label: "Discover" },
          { href: "/together", icon: "❤️", label: "Together" },
          { href: "/my", icon: "📅", label: "Activity" },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex min-h-[56px] items-center justify-center rounded-2xl bg-brand-50 py-4 text-center font-medium text-brand-800 transition-colors hover:bg-brand-100"
          >
            {item.icon} {item.label}
          </Link>
        ))}
      </nav>
    </AppShell>
  );
}
