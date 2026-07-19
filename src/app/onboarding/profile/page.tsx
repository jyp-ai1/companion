"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";

const AGE_GROUPS = ["50대", "60대", "70대", "75세 이상"];
const REGIONS = [
  "서울 강동",
  "서울 송파",
  "경기 하남",
  "경기 성남",
  "경기 광주",
  "인천",
  "기타",
];
const GENDERS = ["남성", "여성", "선택 안 함"];

export default function OnboardingProfilePage() {
  const [ageGroup, setAgeGroup] = useState("");
  const [region, setRegion] = useState("");
  const [gender, setGender] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!ageGroup || !region) return;
    setLoading(true);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from("user_profiles")
      .update({
        age_group: ageGroup,
        region,
        gender: gender || null,
        onboarding_completed: true,
      })
      .eq("id", user.id);

    window.location.href = "/test";
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
                    className={`min-h-[52px] rounded-2xl border-2 px-5 text-lg font-medium transition-colors ${
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
            <div>
              <p className="mb-3 text-lg font-medium">거주 지역</p>
              <div className="flex flex-col gap-3">
                {REGIONS.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRegion(r)}
                    className={`min-h-[52px] rounded-2xl border-2 px-5 text-left text-lg font-medium transition-colors ${
                      region === r
                        ? "border-brand-600 bg-brand-50 text-brand-800"
                        : "border-brand-100 bg-white text-gray-700"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-3 text-lg font-medium">성별 (선택)</p>
              <div className="flex flex-wrap gap-3">
                {GENDERS.map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGender(g === "선택 안 함" ? "" : g)}
                    className={`min-h-[52px] rounded-2xl border-2 px-5 text-lg font-medium transition-colors ${
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
              disabled={!ageGroup || !region || loading}
              className="w-full"
            >
              {loading ? "저장 중..." : "다음 — 이음 타입 테스트"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
