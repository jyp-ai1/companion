"use client";

import { REGION_DATA, SIDO_LIST, formatRegion } from "@/lib/regions";

interface RegionPickerProps {
  sido: string;
  sigungu: string;
  onSidoChange: (sido: string) => void;
  onSigunguChange: (sigungu: string) => void;
}

export function RegionPicker({
  sido,
  sigungu,
  onSidoChange,
  onSigunguChange,
}: RegionPickerProps) {
  const sigunguList = sido ? REGION_DATA[sido] ?? [] : [];

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="mb-3 text-lg font-medium">시·도</p>
        <div className="grid max-h-48 grid-cols-2 gap-2 overflow-y-auto sm:grid-cols-3">
          {SIDO_LIST.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => {
                onSidoChange(s);
                onSigunguChange("");
              }}
              className={`min-h-[48px] rounded-xl border-2 px-3 text-base font-medium transition-colors ${
                sido === s
                  ? "border-brand-600 bg-brand-50 text-brand-800"
                  : "border-brand-100 bg-white text-gray-700"
              }`}
            >
              {s.replace("특별자치시", "").replace("특별자치도", "").replace("광역시", "").replace("특별시", "")}
            </button>
          ))}
        </div>
      </div>
      {sido && (
        <div>
          <p className="mb-3 text-lg font-medium">시·군·구</p>
          <div className="grid max-h-56 grid-cols-2 gap-2 overflow-y-auto sm:grid-cols-3">
            {sigunguList.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => onSigunguChange(g)}
                className={`min-h-[48px] rounded-xl border-2 px-3 text-base font-medium transition-colors ${
                  sigungu === g
                    ? "border-brand-600 bg-brand-50 text-brand-800"
                    : "border-brand-100 bg-white text-gray-700"
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>
      )}
      {sido && sigungu && (
        <p className="rounded-xl bg-brand-50 px-4 py-3 text-brand-800">
          선택 지역: {formatRegion(sido, sigungu)}
        </p>
      )}
    </div>
  );
}

export { formatRegion };
