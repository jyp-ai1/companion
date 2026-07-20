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

const NAV_ITEMS = [
  { href: "/home", label: "홈", icon: "🏠", match: ["/home"] },
  { href: "/browse", label: "둘러보기", icon: "🔍", match: ["/browse", "/people"] },
  { href: "/together", label: "함께", icon: "❤️", match: ["/together"] },
  { href: "/my", label: "내 활동", icon: "📅", match: ["/my", "/schedule"] },
  { href: "/my/profile", label: "마이", icon: "👤", match: ["/my/profile"] },
];

function isNavActive(pathname: string, match: string[]) {
  return match.some((m) => {
    if (m === "/my/profile") return pathname === m;
    if (m === "/my") return pathname === "/my" || pathname.startsWith("/schedule");
    if (m === "/browse")
      return (
        pathname === "/browse" ||
        pathname.startsWith("/browse/") ||
        pathname.startsWith("/people")
      );
    return pathname === m || pathname.startsWith(`${m}/`);
  });
}

function NavLink({
  href,
  label,
  icon,
  active,
  desktop,
}: {
  href: string;
  label: string;
  icon: string;
  active: boolean;
  desktop?: boolean;
}) {
  if (desktop) {
    return (
      <Link
        href={href}
        className={`rounded-full px-4 py-2 text-[15px] font-medium transition-colors ${
          active
            ? "bg-black text-white"
            : "text-[#212121] hover:bg-neutral-100"
        }`}
      >
        {label}
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className={`flex min-h-[56px] min-w-[48px] flex-col items-center justify-center gap-0.5 rounded-xl px-0.5 text-[10px] font-medium sm:text-[11px] ${
        active ? "text-black" : "text-neutral-500 hover:text-black"
      }`}
    >
      <span className="text-xl">{icon}</span>
      <span>{label}</span>
    </Link>
  );
}

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className={SHELL_BOTTOM_NAV}>
      <div className="mx-auto flex w-full max-w-7xl items-center justify-around px-1 py-2">
        {NAV_ITEMS.map(({ href, label, icon, match }) => (
          <NavLink
            key={href}
            href={href}
            label={label}
            icon={icon}
            active={isNavActive(pathname, match)}
          />
        ))}
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
  const pathname = usePathname();

  return (
    <div className="flex min-h-full flex-col pb-24 lg:pb-0">
      <header className={SHELL_HEADER}>
        <div className={SHELL_HEADER_INNER}>
          <Link href="/home" className="flex shrink-0 items-center gap-2">
            <span className="text-2xl">🌿</span>
            <span className="text-xl font-bold text-black">이음</span>
          </Link>

          <nav className={SHELL_DESKTOP_NAV} aria-label="주요 메뉴">
            {NAV_ITEMS.map(({ href, label, icon, match }) => (
              <NavLink
                key={href}
                href={href}
                label={label}
                icon={icon}
                active={isNavActive(pathname, match)}
                desktop
              />
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            {title ? (
              <span className="hidden text-base font-semibold text-[#212121] md:inline lg:hidden">
                {title}
              </span>
            ) : (
              <span className="hidden text-sm font-medium text-neutral-500 md:inline lg:hidden">
                {headerSubtitle ?? "오늘 둘러볼 거리"}
              </span>
            )}
            <Link
              href="/browse"
              className="touch-target rounded-full text-center text-xl leading-[48px] hover:bg-neutral-100"
              aria-label="둘러보기"
            >
              🔍
            </Link>
          </div>
        </div>
      </header>

      <main className={SHELL_MAIN}>{children}</main>
      <BottomNav />
    </div>
  );
}
