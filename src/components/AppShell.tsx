"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/home", label: "홈", icon: "🏠", match: ["/home"] },
  { href: "/browse", label: "둘러보기", icon: "🔍", match: ["/browse", "/people"] },
  { href: "/together", label: "함께", icon: "❤️", match: ["/together"] },
  { href: "/my", label: "내 활동", icon: "📅", match: ["/my", "/schedule"] },
  { href: "/my/profile", label: "마이", icon: "👤", match: ["/my/profile"] },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-brand-100 bg-white pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto flex max-w-lg items-center justify-around px-1 py-2">
        {NAV_ITEMS.map(({ href, label, icon, match }) => {
          const active = match.some((m) => {
            if (m === "/my/profile") return pathname === m;
            if (m === "/my") return pathname === "/my" || pathname.startsWith("/schedule");
            if (m === "/browse") return pathname === "/browse" || pathname.startsWith("/browse/") || pathname.startsWith("/people");
            return pathname === m || pathname.startsWith(`${m}/`);
          });
          return (
            <Link
              key={href}
              href={href}
              className={`flex min-h-[56px] min-w-[48px] flex-col items-center justify-center gap-0.5 rounded-xl px-0.5 text-[10px] font-medium sm:text-[11px] ${
                active ? "text-brand-700" : "text-gray-500 hover:text-brand-600"
              }`}
            >
              <span className="text-xl">{icon}</span>
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function AppShell({
  children,
  title,
  headerSubtitle,
}: {
  children: React.ReactNode;
  title?: string;
  headerSubtitle?: string;
}) {
  return (
    <div className="flex min-h-full flex-col pb-24">
      <header className="sticky top-0 z-40 border-b border-brand-100 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-lg items-center justify-between px-6 py-4">
          <Link href="/home" className="flex items-center gap-2">
            <span className="text-2xl">🌿</span>
            <span className="text-xl font-bold text-brand-700">이음</span>
          </Link>
          {title ? (
            <span className="text-lg font-semibold text-gray-700">{title}</span>
          ) : (
            <span className="text-sm font-medium text-brand-600">
              {headerSubtitle ?? "오늘 둘러볼 거리"}
            </span>
          )}
          <Link href="/browse" className="min-h-[48px] min-w-[48px] text-center text-2xl leading-[48px]" aria-label="둘러보기">
            🔍
          </Link>
        </div>
      </header>
      <main className="mx-auto w-full max-w-lg flex-1 px-4 py-6">{children}</main>
      <BottomNav />
    </div>
  );
}
