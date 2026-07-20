import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { DailyMessageCard } from "@/components/emotional/EmotionalUI";
import {
  ActivityCard,
  ActivityCardHorizontal,
  InterestChip,
} from "@/components/browse/ActivityCard";
import { BrowseSearchForm, QuickCategoryScroll } from "@/components/browse/BrowseFilters";
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
import { INTEREST_TAGS } from "@/lib/ieum/interests";
import { getHabitContext } from "@/lib/ieum/habit-context";

export default async function HomePage() {
  const habit = await getHabitContext();
  if (!habit) return null;

  const { profile } = habit;
  const dailyMessage = getDailyMessage();
  const greeting = getGreeting();
  const popular = getPopularToday(8);
  const weekly = getWeeklyPicks(6);
  const newTogether = getNewTogether(6);
  const reviews = getPopularReviews(4);
  const userRegion = profile?.region?.split(" ").pop() ?? "하남";

  return (
    <AppShell headerSubtitle="오늘 둘러볼 거리">
      <div className="-mx-4 space-y-10 px-4">
        <DailyMessageCard message={dailyMessage} />

        {/* Hero */}
        <section className="animate-fade-in-up">
          <h1 className="text-2xl font-bold leading-snug">
            {greeting},
            <br />
            {profile?.display_name ?? "회원"}님.
          </h1>
          <p className="mt-2 text-lg text-warm-gray">오늘은 무엇을 함께 해볼까요?</p>
          <div className="mt-4">
            <BrowseSearchForm />
            <QuickCategoryScroll />
          </div>
        </section>

        {/* Section 1 — 오늘 인기 */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">🔥 오늘 많이 함께하는 활동</h2>
            <Link href="/browse?sort=popular" className="text-sm text-brand-600 underline">
              더보기
            </Link>
          </div>
          <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-2">
            {popular.map((a) => (
              <ActivityCardHorizontal key={a.id} activity={a} />
            ))}
          </div>
        </section>

        {/* Section 2 — 관심사 그리드 */}
        <section>
          <h2 className="mb-4 text-xl font-bold">관심사로 발견하기</h2>
          <div className="-mx-1 flex gap-3 overflow-x-auto pb-2">
            {INTEREST_TAGS.map((tag) => (
              <InterestChip
                key={tag.slug}
                slug={tag.slug}
                label={tag.label}
                emoji={tag.emoji}
                href={`/browse?cat=${tag.slug}`}
              />
            ))}
          </div>
        </section>

        {/* Section 3 — AI 추천 */}
        <section>
          <h2 className="mb-4 text-xl font-bold">✨ AI 추천 · Today For You</h2>
          <div className="flex flex-col gap-4">
            {weekly.slice(0, 3).map((a) => (
              <ActivityCard key={a.id} activity={a} showAiReason />
            ))}
          </div>
        </section>

        {/* Section 4 — 이번 주 추천 */}
        <section>
          <h2 className="mb-4 text-xl font-bold">이번 주 추천</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {weekly.map((a) => (
              <ActivityCard key={a.id} activity={a} compact />
            ))}
          </div>
        </section>

        {/* Section 5 — 이번 주 많이 본 활동 */}
        <section>
          <h2 className="mb-4 text-xl font-bold">👀 이번 주 많이 본 활동</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {getMostViewedThisWeek(6).map((a) => (
              <ActivityCard key={a.id} activity={a} compact />
            ))}
          </div>
        </section>

        {/* Section 6 — 새로 올라온 함께하기 */}
        <section>
          <h2 className="mb-4 text-xl font-bold">🌿 오늘 새로 올라온 함께하기</h2>
          <div className="flex flex-col gap-4">
            {newTogether.map((a) => (
              <ActivityCard key={a.id} activity={a} />
            ))}
          </div>
        </section>

        {/* Section 6 — 인기 후기 */}
        <section>
          <h2 className="mb-4 text-xl font-bold">💬 이번 주 후기</h2>
          <div className="flex flex-col gap-3">
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

        {/* Section 7 — 지역별 */}
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
          <div className="flex flex-col gap-3">
            {getRegionalPicks(userRegion, 4).map((a) => (
              <ActivityCard key={a.id} activity={a} compact />
            ))}
          </div>
        </section>

        {/* Section 8 — 오늘 가입한 사람 */}
        <section>
          <h2 className="mb-4 text-xl font-bold">🌱 오늘 새로 온 이웃</h2>
          <div className="flex flex-col gap-3">
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

        {/* Section 9 — Memory */}
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

        {/* Footer CTA */}
        <section className="pb-4">
          <Button href="/invite" className="w-full">
            오늘 함께하기 만들기
          </Button>
        </section>
      </div>
    </AppShell>
  );
}
