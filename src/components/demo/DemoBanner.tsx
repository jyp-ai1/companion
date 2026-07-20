import { DEMO_DISCLAIMER } from "@/lib/demo/experience-data";

export function DemoDisclaimer({ className }: { className?: string }) {
  return (
    <p className={`text-center text-xs text-gray-400 ${className ?? ""}`}>
      {DEMO_DISCLAIMER}
    </p>
  );
}

export function DemoBanner() {
  return (
    <div className="sticky top-0 z-50 border-b border-amber-200 bg-amber-50 px-4 py-2">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-2 px-4 md:px-6 lg:px-8">
        <p className="text-sm font-medium text-amber-900">
          🌿 {DEMO_DISCLAIMER} · 둘러보기 모드
        </p>
        <a
          href="/signup"
          className="shrink-0 rounded-full bg-brand-600 px-3 py-1 text-xs font-semibold text-white"
        >
          가입하기
        </a>
      </div>
    </div>
  );
}
