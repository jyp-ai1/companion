"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const DEMO_NAV = [
  { href: "/demo/home", label: "홈", icon: "🏠" },
  { href: "/demo/discover", label: "둘러보기", icon: "🔍" },
  { href: "/demo/together", label: "함께", icon: "❤️" },
  { href: "/demo/activity", label: "내 활동", icon: "📅" },
  { href: "/demo/memory", label: "마이", icon: "👤" },
];

export function DemoBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-brand-100 bg-white pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto flex max-w-lg items-center justify-around px-0 py-2">
        {DEMO_NAV.map(({ href, label, icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className={`flex min-h-[56px] min-w-[48px] flex-col items-center justify-center gap-0.5 rounded-xl px-0.5 text-[10px] font-medium sm:text-[11px] ${
                active ? "text-brand-700" : "text-gray-500"
              }`}
            >
              <span className="text-lg">{icon}</span>
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function DemoShell({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <div className="flex min-h-full flex-col pb-24">
      <header className="border-b border-brand-100 bg-white">
        <div className="mx-auto flex max-w-lg items-center justify-between px-6 py-4">
          <Link href="/demo/home" className="flex items-center gap-2">
            <span className="text-2xl">🌿</span>
            <span className="text-xl font-bold text-brand-700">이음</span>
          </Link>
          {title ? (
            <span className="text-lg font-semibold text-gray-700">{title}</span>
          ) : (
            <span className="text-sm font-medium text-brand-600">둘러보기</span>
          )}
        </div>
      </header>
      <main className="mx-auto w-full max-w-lg flex-1 px-4 py-6">{children}</main>
      <DemoBottomNav />
    </div>
  );
}
