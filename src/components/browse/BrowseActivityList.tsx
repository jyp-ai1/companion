"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ActivityCard } from "@/components/browse/ActivityCard";
import { Button } from "@/components/ui/Button";
import type { BrowseActivity } from "@/lib/browse/types";

export function BrowseActivityList({
  initialItems,
  hasMore: initialHasMore,
  page,
  isFallback,
}: {
  initialItems: BrowseActivity[];
  hasMore: boolean;
  page: number;
  isFallback?: boolean;
}) {
  const router = useRouter();
  const params = useSearchParams();
  const [items] = useState(initialItems);

  function loadMore() {
    const next = new URLSearchParams(params.toString());
    next.set("page", String(page + 1));
    router.push(`/browse?${next.toString()}`);
  }

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-brand-200 bg-brand-50/40 p-8 text-center">
        <span className="text-4xl">🌿</span>
        <p className="mt-4 text-lg font-bold">아직 이 카테고리 활동이 없어요</p>
        <p className="mt-2 text-warm-gray">AI 추천 활동을 먼저 둘러보세요</p>
        <Button href="/browse?sort=ai" className="mt-6">
          추천 활동 보기
        </Button>
      </div>
    );
  }

  return (
    <div>
      {isFallback && (
        <p className="mb-4 rounded-2xl bg-[#fff7f7] px-4 py-3 text-sm text-[#212121]">
          선택한 조건에 맞는 활동이 없어 AI 추천 활동을 보여드려요.
        </p>
      )}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((a) => (
          <ActivityCard key={a.id} activity={a} showAiReason />
        ))}
      </div>
      {initialHasMore && (
        <Button onClick={loadMore} variant="outline" className="mt-8 w-full">
          더 둘러보기
        </Button>
      )}
    </div>
  );
}
