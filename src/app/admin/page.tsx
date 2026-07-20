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

  const { data: allParts } = await supabase
    .from("participations")
    .select("user_id, status, created_at")
    .in("status", ["confirmed", "completed"]);

  const { data: reviews } = await supabase
    .from("reviews")
    .select("rating, met_new_people, user_id, created_at");

  const avgRating =
    reviews && reviews.length > 0
      ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
      : 0;

  const newFriends = reviews?.filter((r) => r.met_new_people).length ?? 0;

  const now = new Date();
  const thisMonthParts =
    allParts?.filter((p) => {
      const d = new Date(p.created_at);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length ?? 0;

  const lastMonthParts =
    allParts?.filter((p) => {
      const d = new Date(p.created_at);
      const lm = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      return d.getMonth() === lm.getMonth() && d.getFullYear() === lm.getFullYear();
    }).length ?? 0;

  const outingIncrease = thisMonthParts - lastMonthParts;

  const userPartCounts: Record<string, number> = {};
  allParts?.forEach((p) => {
    userPartCounts[p.user_id] = (userPartCounts[p.user_id] ?? 0) + 1;
  });
  const usersWithMultiple = Object.values(userPartCounts).filter((c) => c >= 2).length;
  const usersWithOne = Object.values(userPartCounts).filter((c) => c >= 1).length;
  const rejoinRate =
    usersWithOne > 0 ? Math.round((usersWithMultiple / usersWithOne) * 100) : 0;

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

  const { data: proposals } = await supabase
    .from("activity_proposals")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: false })
    .limit(10);

  const { data: habitRaw } = await supabase.rpc("get_habit_metrics");
  const habit = habitRaw?.[0] as
    | {
        dau: number;
        question_responses_today: number;
        checkins_today: number;
        open_activities_today: number;
        open_joins_today: number;
      }
    | undefined;

  const questionRate =
    habit && habit.checkins_today > 0
      ? Math.round((Number(habit.question_responses_today) / Number(habit.checkins_today)) * 100)
      : 0;

  const openJoinRate =
    habit && habit.open_activities_today > 0
      ? Math.round((Number(habit.open_joins_today) / Number(habit.open_activities_today)) * 100)
      : 0;

  const { data: growthRaw } = await supabase.rpc("get_growth_metrics");
  const growth = growthRaw?.[0] as
    | {
        invites_created: number;
        invite_joins: number;
        invite_links_shared: number;
        referral_signups: number;
        first_activities: number;
      }
    | undefined;

  const inviteAcceptRate =
    growth && Number(growth.invites_created) > 0
      ? Math.round((Number(growth.invite_joins) / Number(growth.invites_created)) * 100)
      : 0;

  const { count: profileRevealCount } = await supabase
    .from("profile_reveals")
    .select("*", { count: "exact", head: true })
    .eq("user_consented", true)
    .eq("peer_consented", true);

  const { data: trustRaw } = await supabase.rpc("get_trust_metrics");
  const trust = trustRaw?.[0] as
    | {
        activity_completion_rate: number;
        review_write_rate: number;
        again_yes_rate: number;
        report_rate: number;
        block_rate: number;
        happy_rate: number;
        pending_reports: number;
      }
    | undefined;

  const { data: pendingReports } = await supabase
    .from("user_reports")
    .select("id, reason, detail, created_at, reported_user_id")
    .eq("status", "pending")
    .order("created_at", { ascending: false })
    .limit(10);

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

        <h2 className="mb-4 text-xl font-bold">AI 활동 제안 (승인 대기)</h2>
        {!proposals?.length ? (
          <Card className="mb-10">
            <p className="text-gray-600">
              대기 중인 AI 활동 제안이 없습니다. 사용자가 쌓이면 홈에서 자동 제안됩니다.
            </p>
          </Card>
        ) : (
          <div className="mb-10 flex flex-col gap-3">
            {proposals.map((p) => (
              <Card key={p.id}>
                <p className="font-semibold">{p.title}</p>
                <p className="mt-1 text-sm text-gray-600">
                  {p.interest_slug} · 예상 {p.suggested_participants}명
                </p>
              </Card>
            ))}
          </div>
        )}

        <h2 className="mb-4 text-xl font-bold">Growth Engine (오늘)</h2>
        <div className="mb-10 grid gap-4 sm:grid-cols-2">
          <Card>
            <p className="text-gray-600">초대 생성 수</p>
            <p className="text-3xl font-bold">{growth?.invites_created ?? 0}건</p>
          </Card>
          <Card>
            <p className="text-gray-600">초대 수락률</p>
            <p className="text-3xl font-bold">{inviteAcceptRate}%</p>
            <p className="text-sm text-gray-500">수락 {growth?.invite_joins ?? 0}건</p>
          </Card>
          <Card>
            <p className="text-gray-600">친구 초대 링크</p>
            <p className="text-3xl font-bold">{growth?.invite_links_shared ?? 0}건</p>
          </Card>
          <Card>
            <p className="text-gray-600">초대 기반 가입</p>
            <p className="text-3xl font-bold">{growth?.referral_signups ?? 0}명</p>
          </Card>
          <Card>
            <p className="text-gray-600">첫 활동 성공</p>
            <p className="text-3xl font-bold">{growth?.first_activities ?? 0}건</p>
          </Card>
          <Card>
            <p className="text-gray-600">프로필 상호 공개</p>
            <p className="text-3xl font-bold">{profileRevealCount ?? 0}쌍</p>
            <p className="text-sm text-gray-500">관계 지속률 proxy</p>
          </Card>
        </div>

        <h2 className="mb-4 text-xl font-bold">Trust & Safety</h2>
        <div className="mb-6 grid gap-4 sm:grid-cols-2">
          <Card>
            <p className="text-gray-600">활동 완료율</p>
            <p className="text-3xl font-bold">{trust?.activity_completion_rate ?? 0}%</p>
          </Card>
          <Card>
            <p className="text-gray-600">후기 작성률</p>
            <p className="text-3xl font-bold">{trust?.review_write_rate ?? 0}%</p>
          </Card>
          <Card>
            <p className="text-gray-600">다시 함께하기 (네)</p>
            <p className="text-3xl font-bold">{trust?.again_yes_rate ?? 0}%</p>
          </Card>
          <Card>
            <p className="text-gray-600">활동 만족 (즐거웠어요)</p>
            <p className="text-3xl font-bold">{trust?.happy_rate ?? 0}%</p>
          </Card>
          <Card>
            <p className="text-gray-600">신고율</p>
            <p className="text-3xl font-bold">{trust?.report_rate ?? 0}%</p>
          </Card>
          <Card>
            <p className="text-gray-600">차단율</p>
            <p className="text-3xl font-bold">{trust?.block_rate ?? 0}%</p>
          </Card>
        </div>

        <h3 className="mb-3 text-lg font-bold">신고 대기 ({trust?.pending_reports ?? 0})</h3>
        {!pendingReports?.length ? (
          <Card className="mb-10">
            <p className="text-gray-600">대기 중인 신고가 없습니다.</p>
          </Card>
        ) : (
          <div className="mb-10 flex flex-col gap-3">
            {pendingReports.map((r) => (
              <Card key={r.id}>
                <p className="font-medium">{r.reason}</p>
                {r.detail && <p className="mt-1 text-sm text-gray-600">{r.detail}</p>}
                <p className="mt-2 text-xs text-gray-500">
                  {new Date(r.created_at).toLocaleString("ko-KR")}
                </p>
              </Card>
            ))}
          </div>
        )}

        <h2 className="mb-4 text-xl font-bold">Habit Engine</h2>
        <div className="mb-10 grid gap-4 sm:grid-cols-2">
          <Card>
            <p className="text-gray-600">DAU (오늘)</p>
            <p className="text-3xl font-bold">{habit?.dau ?? 0}명</p>
          </Card>
          <Card>
            <p className="text-gray-600">오늘 질문 응답률</p>
            <p className="text-3xl font-bold">{questionRate}%</p>
          </Card>
          <Card>
            <p className="text-gray-600">Open Activity (오늘)</p>
            <p className="text-3xl font-bold">{habit?.open_activities_today ?? 0}개</p>
          </Card>
          <Card>
            <p className="text-gray-600">Open 참여율</p>
            <p className="text-3xl font-bold">{openJoinRate}%</p>
          </Card>
        </div>

        <h2 className="mb-4 text-xl font-bold">Social Impact (정부 실증 KPI)</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <p className="text-gray-600">신규 친구 (후기 기준)</p>
            <p className="text-3xl font-bold">{newFriends}명</p>
          </Card>
          <Card>
            <p className="text-gray-600">월간 활동 증가</p>
            <p className="text-3xl font-bold">
              {outingIncrease >= 0 ? "+" : ""}
              {outingIncrease}건
            </p>
            <p className="text-sm text-gray-500">이번달 {thisMonthParts}건</p>
          </Card>
          <Card>
            <p className="text-gray-600">외출 빈도 (이번달)</p>
            <p className="text-3xl font-bold">{thisMonthParts}회</p>
          </Card>
          <Card>
            <p className="text-gray-600">재참여율</p>
            <p className="text-3xl font-bold">{rejoinRate}%</p>
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

        <h2 className="mb-4 mt-10 text-xl font-bold">서비스 현황</h2>
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
            <p className="text-3xl font-bold">{allParts?.length ?? 0}건</p>
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
