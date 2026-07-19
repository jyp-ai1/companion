import Link from "next/link";
import { Header } from "@/components/Header";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default async function AdminPage() {
  const supabase = await createClient();

  const { count: userCount } = await supabase
    .from("user_profiles")
    .select("*", { count: "exact", head: true });

  const { count: testCount } = await supabase
    .from("user_profiles")
    .select("*", { count: "exact", head: true })
    .not("test_completed_at", "is", null);

  const { count: meetupCount } = await supabase
    .from("meetups")
    .select("*", { count: "exact", head: true })
    .eq("is_active", true);

  const { count: partCount } = await supabase
    .from("participations")
    .select("*", { count: "exact", head: true })
    .in("status", ["confirmed", "completed"]);

  const { data: reviews } = await supabase.from("reviews").select("rating");
  const avgRating =
    reviews && reviews.length > 0
      ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
      : 0;

  const { data: typeDist } = await supabase
    .from("user_profiles")
    .select("type_code")
    .not("type_code", "is", null);

  const typeCounts: Record<string, number> = {};
  typeDist?.forEach((p) => {
    if (p.type_code) typeCounts[p.type_code] = (typeCounts[p.type_code] ?? 0) + 1;
  });

  const testRate =
    userCount && userCount > 0
      ? Math.round(((testCount ?? 0) / userCount) * 100)
      : 0;

  return (
    <div className="flex flex-1 flex-col">
      <Header showNav={false} />
      <main className="mx-auto w-full max-w-3xl px-6 py-10">
        <div className="mb-8 flex items-center justify-between">
          <h1>이음 Admin</h1>
          <Button href="/home" variant="outline" size="md">
            홈으로
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <p className="text-gray-600">가입자</p>
            <p className="text-3xl font-bold">{userCount ?? 0}명</p>
          </Card>
          <Card>
            <p className="text-gray-600">테스트 완료</p>
            <p className="text-3xl font-bold">
              {testCount ?? 0}명 ({testRate}%)
            </p>
          </Card>
          <Card>
            <p className="text-gray-600">활성 모임</p>
            <p className="text-3xl font-bold">{meetupCount ?? 0}개</p>
          </Card>
          <Card>
            <p className="text-gray-600">참여 신청</p>
            <p className="text-3xl font-bold">{partCount ?? 0}건</p>
          </Card>
          <Card>
            <p className="text-gray-600">평균 만족도</p>
            <p className="text-3xl font-bold">
              {avgRating > 0 ? avgRating.toFixed(1) : "-"} / 5
            </p>
          </Card>
          <Card>
            <p className="text-gray-600">후기 수</p>
            <p className="text-3xl font-bold">{reviews?.length ?? 0}건</p>
          </Card>
        </div>

        <Card className="mt-8">
          <h2 className="mb-4">유형별 분포</h2>
          {Object.keys(typeCounts).length === 0 ? (
            <p className="text-gray-600">아직 데이터 없음</p>
          ) : (
            <ul className="space-y-2">
              {Object.entries(typeCounts)
                .sort((a, b) => b[1] - a[1])
                .map(([code, count]) => (
                  <li key={code} className="flex justify-between">
                    <span>{code}</span>
                    <span className="font-semibold">{count}명</span>
                  </li>
                ))}
            </ul>
          )}
        </Card>

        <Card className="mt-8">
          <h2 className="mb-4">MVP KPI 목표</h2>
          <ul className="space-y-2 text-gray-700">
            <li>가입자 100명 · 현재 {userCount ?? 0}명</li>
            <li>테스트 완료 80%+ · 현재 {testRate}%</li>
            <li>모임 20회+ · 현재 {meetupCount ?? 0}개</li>
            <li>만족도 4.5+ · 현재 {avgRating > 0 ? avgRating.toFixed(1) : "-"}</li>
          </ul>
        </Card>

        <p className="mt-8 text-sm text-gray-500">
          관리자 권한: Supabase에서{" "}
          <code className="rounded bg-gray-100 px-1">user_profiles.is_admin = true</code>{" "}
          설정 필요
        </p>
        <Link href="/meetups" className="mt-4 inline-block text-brand-600 underline">
          모임 목록 보기
        </Link>
      </main>
    </div>
  );
}
