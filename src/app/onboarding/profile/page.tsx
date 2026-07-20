"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { RegionPicker, formatRegion } from "@/components/RegionPicker";

const AGE_GROUPS = ["50대", "60대", "70대", "75세 이상"];
const GENDERS = ["남성", "여성", "선택 안 함"];

export default function OnboardingProfilePage() {
  const router = useRouter();
  const [ageGroup, setAgeGroup] = useState("");
  const [sido, setSido] = useState("");
  const [sigungu, setSigungu] = useState("");
  const [gender, setGender] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!ageGroup || !sido || !sigungu) return;
    setLoading(true);
    setError("");

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setError("로그인이 필요합니다. 다시 로그인해 주세요.");
        return;
      }

      const { error: updateError } = await supabase
        .from("user_profiles")
        .update({
          age_group: ageGroup,
          region: formatRegion(sido, sigungu),
          gender: gender && gender !== "선택 안 함" ? gender : null,
          onboarding_completed: true,
        })
        .eq("id", user.id);

      if (updateError) {
        setError("저장에 실패했습니다.");
        return;
      }

      router.push("/test");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col px-6 py-8">
      <div className="mx-auto w-full max-w-md">
        <ProgressBar current={1} total={3} label="가입 단계" />
        <Card className="mt-8">
          <h1 className="mb-2">간단히 알려주세요</h1>
          <p className="mb-8 text-gray-600">
            맞는 모임을 추천해 드리기 위해 필요해요.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            <div>
              <p className="mb-3 text-lg font-medium">연령대</p>
              <div className="flex flex-wrap gap-3">
                {AGE_GROUPS.map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setAgeGroup(g)}
                    className={`min-h-[52px] rounded-2xl border-2 px-5 text-lg font-medium ${
                      ageGroup === g
                        ? "border-brand-600 bg-brand-50 text-brand-800"
                        : "border-brand-100 bg-white text-gray-700"
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
            <RegionPicker
              sido={sido}
              sigungu={sigungu}
              onSidoChange={setSido}
              onSigunguChange={setSigungu}
            />
            <div>
              <p className="mb-3 text-lg font-medium">성별 (선택)</p>
              <div className="flex flex-wrap gap-3">
                {GENDERS.map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGender(g === "선택 안 함" ? "" : g)}
                    className={`min-h-[52px] rounded-2xl border-2 px-5 text-lg font-medium ${
                      (gender === g || (g === "선택 안 함" && !gender))
                        ? "border-brand-600 bg-brand-50 text-brand-800"
                        : "border-brand-100 bg-white text-gray-700"
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
            <Button
              type="submit"
              disabled={!ageGroup || !sido || !sigungu || loading}
              className="w-full"
            >
              {loading ? "저장 중..." : "다음 — 이음 코드 만들기"}
            </Button>
            {error && (
              <p className="rounded-xl bg-red-50 p-3 text-red-700">{error}</p>
            )}
          </form>
        </Card>
      </div>
    </div>
  );
}
