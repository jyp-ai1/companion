"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { BROWSE_REGIONS, BROWSE_TABS } from "@/lib/browse/types";
import { INTEREST_TAGS } from "@/lib/ieum/interests";

const WHEN_OPTIONS = [
  { value: "all", label: "전체" },
  { value: "today", label: "오늘" },
  { value: "week", label: "이번 주" },
] as const;

const SORT_OPTIONS = [
  { value: "ai", label: "AI추천" },
  { value: "popular", label: "인기순" },
  { value: "near", label: "가까운순" },
  { value: "new", label: "최신" },
] as const;

const EXTRA_OPTIONS = [
  { key: "price", value: "free", label: "무료" },
  { key: "price", value: "paid", label: "유료" },
  { key: "beginner", value: "1", label: "초보환영" },
] as const;

function pillClass(active: boolean) {
  return active
    ? "bg-black text-white border-black"
    : "bg-white text-[#212121] border-neutral-200 hover:border-neutral-400";
}

export function BrowseFilters() {
  const router = useRouter();
  const params = useSearchParams();
  const category = params.get("cat") ?? "all";
  const when = params.get("when") ?? "all";
  const sort = params.get("sort") ?? "ai";
  const region = params.get("region") ?? "";
  const price = params.get("price") ?? "all";
  const beginner = params.get("beginner") === "1";

  function update(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value === "all" && (key === "cat" || key === "when" || key === "price" || key === "region")) {
      next.delete(key);
    } else if (key === "beginner" && value !== "1") {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    next.delete("page");
    router.push(`/browse?${next.toString()}`);
  }

  function toggleBeginner() {
    update("beginner", beginner ? "0" : "1");
  }

  return (
    <div className="space-y-4">
      <div className="hide-scrollbar flex gap-2 overflow-x-auto pb-1 lg:flex-wrap">
        {BROWSE_TABS.map((tab) => (
          <button
            key={tab.slug}
            type="button"
            onClick={() => update("cat", tab.slug)}
            className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${pillClass(category === tab.slug)}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {WHEN_OPTIONS.map((o) => (
          <button
            key={o.value}
            type="button"
            onClick={() => update("when", o.value)}
            className={`min-h-[44px] rounded-full border px-4 text-sm transition-colors ${pillClass(when === o.value)}`}
          >
            {o.label}
          </button>
        ))}
        {SORT_OPTIONS.map((o) => (
          <button
            key={o.value}
            type="button"
            onClick={() => update("sort", o.value)}
            className={`min-h-[44px] rounded-full border px-4 text-sm transition-colors ${pillClass(sort === o.value)}`}
          >
            {o.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {EXTRA_OPTIONS.map((o) => {
          const active = o.key === "beginner" ? beginner : price === o.value;
          return (
            <button
              key={`${o.key}-${o.value}`}
              type="button"
              onClick={() =>
                o.key === "beginner" ? toggleBeginner() : update("price", o.value)
              }
              className={`min-h-[44px] rounded-full border px-4 text-sm transition-colors ${pillClass(active)}`}
            >
              {o.label}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-2">
        {BROWSE_REGIONS.map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => update("region", region === r ? "all" : r)}
            className={`min-h-[40px] rounded-full border px-4 text-sm transition-colors ${pillClass(region === r)}`}
          >
            {r}
          </button>
        ))}
      </div>
    </div>
  );
}

export function BrowseSearchForm({ defaultQ }: { defaultQ?: string }) {
  const router = useRouter();

  return (
    <form
      className="relative"
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const q = String(fd.get("q") ?? "").trim();
        router.push(q ? `/browse?q=${encodeURIComponent(q)}` : "/browse");
      }}
    >
      <input
        name="q"
        defaultValue={defaultQ}
        placeholder="무엇을 하고 싶으세요?"
        className="min-h-[52px] w-full rounded-full border border-neutral-300 bg-white px-5 pr-12 text-base focus:border-black focus:outline-none md:text-lg"
      />
      <button
        type="submit"
        className="absolute right-4 top-1/2 -translate-y-1/2 text-xl"
        aria-label="검색"
      >
        🔍
      </button>
    </form>
  );
}

export function QuickCategoryScroll() {
  const quick = INTEREST_TAGS.slice(0, 16);
  return (
    <div className="hide-scrollbar mt-3 flex gap-2 overflow-x-auto pb-1 lg:flex-wrap">
      {quick.map((c) => (
        <Link
          key={c.slug}
          href={`/browse?cat=${c.slug}`}
          className="shrink-0 rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-[#212121] transition-colors hover:border-black"
        >
          {c.emoji} {c.label}
        </Link>
      ))}
    </div>
  );
}
