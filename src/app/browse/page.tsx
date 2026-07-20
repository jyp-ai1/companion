import { Suspense } from "react";
import { AppShell } from "@/components/AppShell";
import { BrowseActivityList } from "@/components/browse/BrowseActivityList";
import { BrowseFilters, BrowseSearchForm } from "@/components/browse/BrowseFilters";
import { DemoDisclaimer } from "@/components/demo/DemoBanner";
import {
  BROWSE_CATALOG,
  filterActivities,
} from "@/lib/browse/catalog";

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
  const filter = {
    category: params.cat,
    when: (params.when as "today" | "week" | "all") ?? "all",
    sort: (params.sort as "popular" | "near" | "ai" | "new") ?? "ai",
    region: params.region,
    price: (params.price as "free" | "paid" | "all") ?? "all",
    beginner: params.beginner === "1",
    q: params.q,
  };

  const filtered = filterActivities(BROWSE_CATALOG, filter);
  const isFallback = filtered.length === 0;
  const source = isFallback
    ? filterActivities(BROWSE_CATALOG, { sort: "ai" })
    : filtered;

  const pageSize = 12;
  const end = (page + 1) * pageSize;
  const items = source.slice(0, end);
  const hasMore = end < source.length;

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

      <p className="mb-4 mt-6 text-sm text-warm-gray">
        {isFallback ? "추천 활동" : `${filtered.length}개의 활동`} · 관심사 → 활동 → 사람 →
        함께하기
      </p>

      <BrowseActivityList
        initialItems={items}
        hasMore={hasMore}
        page={page}
        isFallback={isFallback}
      />

      <DemoDisclaimer className="mt-8" />
    </AppShell>
  );
}
