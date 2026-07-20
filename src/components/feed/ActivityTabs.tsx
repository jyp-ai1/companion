"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

const TABS = [
  { key: "upcoming", label: "참여 예정" },
  { key: "completed", label: "참여 완료" },
  { key: "badges", label: "배지" },
  { key: "interests", label: "관심사" },
  { key: "friends", label: "친구" },
];

export function ActivityTabs() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = searchParams.get("tab") ?? "upcoming";

  return (
    <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
      {TABS.map(({ key, label }) => {
        const href = `${pathname}?tab=${key}`;
        const active = current === key;
        return (
          <Link
            key={key}
            href={href}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium ${
              active ? "bg-brand-600 text-white" : "bg-brand-50 text-brand-700"
            }`}
          >
            {label}
          </Link>
        );
      })}
    </div>
  );
}

export function ScheduleTabs() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = searchParams.get("range") ?? "today";

  const tabs = [
    { key: "today", label: "오늘" },
    { key: "tomorrow", label: "내일" },
    { key: "week", label: "이번주" },
    { key: "month", label: "이번달" },
  ];

  return (
    <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
      {tabs.map(({ key, label }) => {
        const href = `${pathname}?range=${key}`;
        const active = current === key;
        return (
          <Link
            key={key}
            href={href}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium ${
              active ? "bg-brand-600 text-white" : "bg-brand-50 text-brand-700"
            }`}
          >
            {label}
          </Link>
        );
      })}
    </div>
  );
}
