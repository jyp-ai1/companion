"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { RegionPicker, formatRegion } from "@/components/RegionPicker";
import { parseRegion } from "@/lib/regions";

const AGE_GROUPS = ["50대", "60대", "70대", "75세 이상"];
const GENDERS = ["남성", "여성"];

export function ProfileEditForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [gender, setGender] = useState("");
  const [sido, setSido] = useState("");
  const [sigungu, setSigungu] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return;
      setEmail(user.email ?? "");
      const { data: profile } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      if (profile) {
        setName(profile.display_name ?? "");
        setPhone(profile.phone ?? "");
        setAgeGroup(profile.age_group ?? "");
        setGender(profile.gender ?? "");
        const parsed = parseRegion(profile.region);
        setSido(parsed.sido);
        setSigungu(parsed.sigungu);
      }
      setLoading(false);
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!sido || !sigungu || !ageGroup) return;
    setSaving(true);
    setError("");
    setSuccess(false);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { error: updateError } = await supabase
      .from("user_profiles")
      .update({
        display_name: name.trim(),
        phone: phone.trim(),
        age_group: ageGroup,
        gender: gender || null,
        region: formatRegion(sido, sigungu),
      })
      .eq("id", user.id);

    setSaving(false);
    if (updateError) {
      setError("저장에 실패했습니다.");
      return;
    }
    setSuccess(true);
    router.refresh();
  }

  if (loading) {
    return <p className="text-center text-gray-600">불러오는 중...</p>;
  }

  return (
    <Card>
      <h2 className="mb-4 text-lg font-bold">설정</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <Input label="이름" value={name} onChange={(e) => setName(e.target.value)} required />
        <Input label="휴대폰" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <Input label="이메일" value={email} disabled className="bg-gray-50" />
        <div>
          <p className="mb-3 text-lg font-medium">연령대</p>
          <div className="flex flex-wrap gap-2">
            {AGE_GROUPS.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setAgeGroup(g)}
                className={`min-h-[48px] rounded-xl border-2 px-4 font-medium ${
                  ageGroup === g ? "border-brand-600 bg-brand-50" : "border-brand-100"
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-3 text-lg font-medium">성별 (선택)</p>
          <div className="flex gap-2">
            {GENDERS.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setGender(g)}
                className={`min-h-[48px] flex-1 rounded-xl border-2 font-medium ${
                  gender === g ? "border-brand-600 bg-brand-50" : "border-brand-100"
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
        {error && <p className="rounded-xl bg-red-50 p-3 text-red-700">{error}</p>}
        {success && (
          <p className="rounded-xl bg-brand-50 p-3 text-brand-800">저장되었습니다.</p>
        )}
        <Button type="submit" disabled={saving || !sido || !sigungu} className="w-full">
          {saving ? "저장 중..." : "저장하기"}
        </Button>
      </form>
    </Card>
  );
}
