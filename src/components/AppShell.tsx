"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/home", label: "Home", icon: "🏠", match: ["/home"] },
  { href: "/recommend", label: "Discover", icon: "✨", match: ["/recommend", "/people"] },
  { href: "/together", label: "Together", icon: "❤️", match: ["/together"] },
  { href: "/my", label: "Activity", icon: "📅", match: ["/my", "/schedule"] },
  { href: "/my/profile", label: "My", icon: "👤", match: ["/my/profile"] },
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
            return pathname === m || pathname.startsWith(`${m}/`);
          });
          return (
            <Link
              key={href}
              href={href}
              className={`flex min-h-[56px] min-w-[52px] flex-col items-center justify-center gap-0.5 rounded-xl px-0.5 text-[11px] font-medium transition-colors sm:text-xs ${
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
}: {
  children: React.ReactNode;
  title?: string;
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
            <span className="text-sm font-medium text-brand-600">Today For You</span>
          )}
          <Link href="/search" className="text-2xl" aria-label="검색">
            🔍
          </Link>
        </div>
      </header>
      <main className="mx-auto w-full max-w-lg flex-1 px-4 py-6">{children}</main>
      <BottomNav />
    </div>
  );
}
