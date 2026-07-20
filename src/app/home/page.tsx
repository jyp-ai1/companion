import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { DailyMessageCard } from "@/components/emotional/EmotionalUI";
import { ActivityCard, ActivityCardHorizontal } from "@/components/browse/ActivityCard";
import { DailyCheckInCard } from "@/components/home/DailyCheckInCard";
import { HomeDiscoverFilter } from "@/components/home/HomeDiscoverFilter";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  getGreeting,
  getMostViewedThisWeek,
  getNewMembersToday,
  getNewTogether,
  getPopularReviews,
  getPopularToday,
  getRegionalPicks,
  getWeeklyPicks,
} from "@/lib/browse/catalog";
import { BROWSE_REGIONS } from "@/lib/browse/types";
import { getDailyMessage } from "@/lib/ieum/daily-messages";
import { getHabitContext } from "@/lib/ieum/habit-context";
import { getPersonalizedTodayPicks } from "@/lib/ieum/personalized-home";

export default async function HomePage() {
  const habit = await getHabitContext();
  if (!habit) return null;

  const {
    profile,
    question,
    questionAnswered,
    questionMood,
    interestSlugs,
  } = habit;

  const displayName = profile?.display_name ?? "회원";
  const dailyMessage = getDailyMessage();
  const greeting = getGreeting();
  const popular = getPopularToday(8);
  const weekly = getWeeklyPicks(6);
  const newTogether = getNewTogether(6);
  const reviews = getPopularReviews(4);
  const userRegion = profile?.region?.split(" ").pop() ?? "하남";

  const personalized = getPersonalizedTodayPicks({
    interestSlugs,
    questionAnswer: questionAnswered,
    mood: questionMood,
    ieumCode: profile?.ieum_code ?? null,
    dnaTitle: profile?.dna_title ?? null,
    region: profile?.region ?? null,
  });

  return (
    <AppShell headerSubtitle="오늘 둘러볼 거리">
      <div className="space-y-12 md:space-y-16">
        <DailyMessageCard message={dailyMessage} />

        {/* Hero — 검색 + 관심사 필터 */}
        <section className="animate-fade-in-up">
          <h1 className="text-2xl font-bold leading-snug">
            {greeting},
            <br />
            {displayName}님.
          </h1>
          <p className="mt-2 text-lg text-warm-gray">오늘은 무엇을 함께 해볼까요?</p>
          <HomeDiscoverFilter />
        </section>

        {/* 오늘 질문 + 기분 */}
        <section>
          <DailyCheckInCard
            question={question}
            savedAnswer={questionAnswered}
            savedMood={questionMood}
            dnaTitle={profile?.dna_title ?? null}
          />
        </section>

        {/* OOO님의 오늘 추천 */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">✨ {displayName}님의 오늘 추천</h2>
              {profile?.dna_title && (
                <p className="mt-1 text-sm text-warm-gray">
                  {profile.dna_title}
                  {profile.ieum_code ? ` · ${profile.ieum_code}` : ""}
                </p>
              )}
            </div>
            <Link href="/browse?sort=ai" className="text-sm text-brand-600 underline">
              더보기
            </Link>
          </div>
          {!questionAnswered || !questionMood ? (
            <Card className="border-dashed border-brand-200 bg-brand-50/40 text-center">
              <p className="text-warm-gray">
                오늘 질문과 기분을 선택하면 더 잘 맞는 활동을 추천해 드려요.
              </p>
            </Card>
          ) : null}
          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {personalized.map((a) => (
              <ActivityCard
                key={a.id}
                activity={{ ...a, aiReason: a.personalReason }}
                showAiReason
              />
            ))}
          </div>
        </section>

        {/* 오늘 인기 */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">🔥 오늘 많이 함께하는 활동</h2>
            <Link href="/browse?sort=popular" className="text-sm text-brand-600 underline">
              더보기
            </Link>
          </div>
          <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-2 hide-scrollbar lg:mx-0 lg:grid lg:grid-cols-2 lg:gap-4 lg:overflow-visible lg:px-0 xl:grid-cols-4">
            {popular.map((a) => (
              <ActivityCardHorizontal key={a.id} activity={a} />
            ))}
          </div>
        </section>

        {/* 이번 주 추천 */}
        <section>
          <h2 className="mb-4 text-xl font-bold">이번 주 추천</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {weekly.map((a) => (
              <ActivityCard key={a.id} activity={a} compact />
            ))}
          </div>
        </section>

        {/* 이번 주 많이 본 활동 */}
        <section>
          <h2 className="mb-4 text-xl font-bold">👀 이번 주 많이 본 활동</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {getMostViewedThisWeek(6).map((a) => (
              <ActivityCard key={a.id} activity={a} compact />
            ))}
          </div>
        </section>

        {/* 새로 올라온 함께하기 */}
        <section>
          <h2 className="mb-4 text-xl font-bold">🌿 오늘 새로 올라온 함께하기</h2>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {newTogether.map((a) => (
              <ActivityCard key={a.id} activity={a} />
            ))}
          </div>
        </section>

        {/* 이번 주 후기 */}
        <section>
          <h2 className="mb-4 text-xl font-bold">💬 이번 주 후기</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {reviews.map((a) => (
              <Link key={a.id} href={`/browse/${a.id}`}>
                <Card className="border-brand-100">
                  <div className="flex gap-3">
                    <span className="text-3xl">{a.emoji}</span>
                    <div>
                      <p className="font-medium">{a.title}</p>
                      <p className="mt-1 text-sm text-gray-700">
                        &ldquo;{a.reviewSnippet}&rdquo;
                      </p>
                      <p className="mt-2 text-xs text-brand-600">
                        {a.reviewAuthor} · {a.hostBadge} · 후기 {a.reviewCount}개
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* 지역별 */}
        <section>
          <h2 className="mb-4 text-xl font-bold">📍 지역별 추천</h2>
          <div className="mb-4 flex flex-wrap gap-2">
            {BROWSE_REGIONS.slice(0, 5).map((r) => (
              <Link
                key={r}
                href={`/browse?region=${encodeURIComponent(r)}`}
                className="rounded-full bg-brand-50 px-4 py-2 text-sm font-medium text-brand-800"
              >
                {r}
              </Link>
            ))}
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {getRegionalPicks(userRegion, 4).map((a) => (
              <ActivityCard key={a.id} activity={a} compact />
            ))}
          </div>
        </section>

        {/* 오늘 새로 온 이웃 */}
        <section>
          <h2 className="mb-4 text-xl font-bold">🌱 오늘 새로 온 이웃</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {getNewMembersToday(5).map((m) => (
              <Card key={m.id} className="border-brand-100">
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-2xl">
                    {m.emoji}
                  </span>
                  <div>
                    <p className="font-medium">{m.name}님이 가입했어요</p>
                    <p className="text-sm text-warm-gray">
                      {m.region} · {m.interest} 관심
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Memory */}
        <section>
          <h2 className="mb-4 text-xl font-bold">📸 오늘의 추억</h2>
          <Card className="border-2 border-brand-200 bg-gradient-to-br from-brand-50 to-accent-50/30">
            <p className="text-sm text-brand-600">Memory</p>
            <p className="mt-2 text-lg font-bold">함께한 시간은 추억으로 남습니다</p>
            <p className="mt-2 text-warm-gray">첫 동행 후 여기에 오늘의 기록이 쌓여요</p>
            <Button href="/demo/memory" variant="outline" size="md" className="mt-4">
              예시 보기
            </Button>
          </Card>
        </section>

        <section className="pb-4">
          <Button href="/invite" className="w-full">
            오늘 함께하기 만들기
          </Button>
        </section>
      </div>
    </AppShell>
  );
}
