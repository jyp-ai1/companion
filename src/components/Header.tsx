import Link from "next/link";

interface HeaderProps {
  showNav?: boolean;
}

export function Header({ showNav = true }: HeaderProps) {
  return (
    <header className="border-b border-brand-100 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/home" className="flex items-center gap-2">
          <span className="text-2xl">🌿</span>
          <span className="text-xl font-bold text-brand-700">이음</span>
        </Link>
        {showNav && (
          <nav className="flex gap-4 text-base font-medium">
            <Link href="/meetups" className="text-gray-700 hover:text-brand-700">
              모임
            </Link>
            <Link href="/my" className="text-gray-700 hover:text-brand-700">
              내 모임
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
