import type { CompatibilityBreakdown } from "@/lib/ieum/compatibility";
import { Card } from "@/components/ui/Card";

const ROWS: { key: keyof CompatibilityBreakdown; label: string }[] = [
  { key: "interests", label: "공통 관심사" },
  { key: "conversation", label: "대화거리" },
  { key: "lifestyle", label: "생활패턴" },
  { key: "activity", label: "활동성" },
];

export function CompatibilityBreakdownView({
  compat,
}: {
  compat: CompatibilityBreakdown;
}) {
  return (
    <Card className="border-brand-200">
      <p className="text-center text-3xl font-bold text-brand-700">
        함께할 가능성 {compat.together}%
      </p>
      <div className="my-6 space-y-3">
        {ROWS.map(({ key, label }) => {
          const value = compat[key];
          if (typeof value !== "number") return null;
          return (
            <div key={key}>
              <div className="mb-1 flex justify-between text-sm">
                <span className="text-gray-600">{label}</span>
                <span className="font-semibold">{value}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-brand-100">
                <div
                  className="h-full rounded-full bg-brand-600 transition-all"
                  style={{ width: `${value}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex justify-between border-t border-brand-100 pt-4 text-sm text-gray-500">
        <span>거리 {compat.distance}%</span>
        <span>시간 {compat.time}%</span>
      </div>
    </Card>
  );
}
