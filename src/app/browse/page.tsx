import { Suspense } from "react";
import { getUserInterestSlugs } from "@/app/actions/onboarding";
import { AppShell } from "@/components/AppShell";
import { BrowseActivityList } from "@/components/browse/BrowseActivityList";
import { BrowseFilters, BrowseSearchForm } from "@/components/browse/BrowseFilters";
import { DemoDisclaimer } from "@/components/demo/DemoBanner";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  BROWSE_CATALOG,
  filterActivities,
  filterByInterestSlugs,
} from "@/lib/browse/catalog";
import { getInterestLabel } from "@/lib/ieum/interests";

function FiltersFallback() {
  return <div className="h-24 animate-pulse rounded-2xl bg-brand-50" />;
}

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: Promise<{
    cat?: string;
    when?: string;
    sort?: string;
    region?: string;
    price?: string;
    beginner?: string;
    q?: string;
    page?: string;
  }>;
}) {
  const params = await searchParams;
  const page = Math.max(0, Number(params.page ?? 0));
  const interestSlugs = await getUserInterestSlugs();
  const hasExplicitQuery = Boolean(params.cat || params.q || params.region);

  const filter = {
    category: params.cat,
    when: (params.when as "today" | "week" | "all") ?? "all",
    sort: (params.sort as "popular" | "near" | "ai" | "new") ?? "ai",
    region: params.region,
    price: (params.price as "free" | "paid" | "all") ?? "all",
    beginner: params.beginner === "1",
    q: params.q,
  };

  const needsInterestSetup = interestSlugs.length === 0 && !hasExplicitQuery;

  let catalog = BROWSE_CATALOG;
  if (!needsInterestSetup && !hasExplicitQuery && interestSlugs.length > 0) {
    const byInterest = filterByInterestSlugs(BROWSE_CATALOG, interestSlugs);
    if (byInterest.length > 0) catalog = byInterest;
  }

  const filtered = filterActivities(catalog, filter);
  const isFallback = filtered.length === 0 && !needsInterestSetup;
  const source = isFallback
    ? filterActivities(BROWSE_CATALOG, { sort: "ai" })
    : filtered;

  const pageSize = 12;
  const end = (page + 1) * pageSize;
  const items = needsInterestSetup ? [] : source.slice(0, end);
  const hasMore = !needsInterestSetup && end < source.length;

  return (
    <AppShell title="둘러보기">
      <h1 className="mb-2 text-2xl font-bold">🔍 둘러보기</h1>
      <p className="mb-6 text-lg text-warm-gray">
        관심사부터 발견하고, 마음에 드는 활동을 골라보세요.
      </p>

      <BrowseSearchForm defaultQ={params.q} />

      <div className="mt-6">
        <Suspense fallback={<FiltersFallback />}>
          <BrowseFilters />
        </Suspense>
      </div>

      {needsInterestSetup ? (
        <Card className="mt-8 border-2 border-dashed border-brand-200 bg-brand-50/50 text-center">
          <span className="text-4xl">🌿</span>
          <h2 className="mt-4 text-xl font-bold">관심사를 먼저 등록해 주세요</h2>
          <p className="mt-2 text-warm-gray">
            3분이면 나만의 이음 코드와 맞춤 추천을 받을 수 있어요.
          </p>
          <Button href="/test" className="mt-6">
            관심사 · 이음 코드 만들기
          </Button>
          <Button href="/onboarding/profile" variant="outline" className="mt-3 w-full">
            가입 단계 이어하기
          </Button>
        </Card>
      ) : (
        <>
          {!hasExplicitQuery && interestSlugs.length > 0 && (
            <p className="mb-4 mt-6 rounded-xl bg-brand-50 px-4 py-3 text-sm text-brand-800">
              ✨ 내 관심사(
              {interestSlugs
                .slice(0, 3)
                .map((s) => getInterestLabel(s))
                .join(", ")}
              {interestSlugs.length > 3 ? "…" : ""}) 기반 추천
            </p>
          )}

          <p className="mb-4 mt-2 text-sm text-warm-gray">
            {isFallback ? "추천 활동" : `${filtered.length}개의 활동`} · 관심사 → 활동 →
            사람 → 함께하기
          </p>

          <BrowseActivityList
            initialItems={items}
            hasMore={hasMore}
            page={page}
            isFallback={isFallback}
          />
        </>
      )}

      <DemoDisclaimer className="mt-8" />
    </AppShell>
  );
}
