"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SHELL_BOTTOM_NAV,
  SHELL_DESKTOP_NAV,
  SHELL_HEADER,
  SHELL_HEADER_INNER,
  SHELL_MAIN,
} from "@/lib/layout";

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
    <nav className={SHELL_BOTTOM_NAV}>
      <div className="mx-auto flex w-full max-w-7xl items-center justify-around px-0 py-2">
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
  const pathname = usePathname();

  return (
    <div className="flex min-h-full flex-col pb-24 lg:pb-0">
      <header className={SHELL_HEADER}>
        <div className={SHELL_HEADER_INNER}>
          <Link href="/demo/home" className="flex items-center gap-2">
            <span className="text-2xl">🌿</span>
            <span className="text-xl font-bold text-brand-700">이음</span>
          </Link>

          <nav className={SHELL_DESKTOP_NAV} aria-label="데모 메뉴">
            {DEMO_NAV.map(({ href, label }) => {
              const active = pathname === href || pathname.startsWith(`${href}/`);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`rounded-full px-4 py-2 text-[15px] font-medium ${
                    active ? "bg-brand-600 text-white" : "text-brand-800 hover:bg-brand-50"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          {title ? (
            <span className="text-base font-semibold text-[#212121] lg:hidden">{title}</span>
          ) : (
            <span className="text-sm font-medium text-neutral-500">데모</span>
          )}
        </div>
      </header>
      <main className={SHELL_MAIN}>{children}</main>
      <DemoBottomNav />
    </div>
  );
}
