import { AppShell } from "@/components/AppShell";
import { AiCoachCard } from "@/components/feed/AiCoachCard";
import { ProfileEditForm } from "@/components/profile/ProfileEditForm";
import { TrustProfileCard } from "@/components/trust/TrustProfileCard";
import { SocialHealthCard } from "@/components/together/TogetherCards";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { fetchTrustStatsForUser } from "@/lib/ieum/trust";
import { getUserDiscoveryContext } from "@/lib/ieum/user-context";
import { getTogetherContext } from "@/lib/ieum/together-context";
import { createClient } from "@/lib/supabase/server";

export default async function MyProfilePage() {
  const ctx = await getUserDiscoveryContext();
  if (!ctx) return null;

  const together = await getTogetherContext();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const trustStats = user
    ? await fetchTrustStatsForUser(supabase, user.id)
    : {
        completedActivities: 0,
        completionRate: 0,
        reviewCount: 0,
        againYesCount: 0,
        memberDays: 0,
        profileCompleteness: 0,
      };

  const {
    profile,
    typeDef,
    dynamicType,
    activityGraph,
    activityLevel,
    socialImpact,
    coach,
    completed,
  } = ctx;

  return (
    <AppShell title="마이">
      <h1 className="mb-6">{profile?.display_name ?? "회원"}님</h1>

      <TrustProfileCard stats={trustStats} />

      {together && (
        <div className="mb-6">
          <SocialHealthCard
            score={together.socialHealth.score}
            delta={together.socialHealth.delta}
            labels={together.socialHealth.labels}
          />
          <Button href="/together" variant="outline" size="md" className="mt-4 w-full">
            Together Life Graph 보기
          </Button>
        </div>
      )}

      <Card className="mb-6 bg-brand-50">
        <p className="text-sm text-gray-600">나의 이음 코드</p>
        <p className="mt-2 text-2xl font-bold">
          {ctx.dnaTitle ?? "이음 회원"}
        </p>
        {ctx.ieumCode && (
          <p className="mt-1 font-mono text-brand-700">{ctx.ieumCode}</p>
        )}
        <p className="mt-3 text-sm text-gray-600">{ctx.dynamicType.shiftDescription}</p>
        <Button href="/test" variant="outline" size="md" className="mt-4">
          관심사 업데이트
        </Button>
      </Card>

      <Card className="mb-6">
        <p className="text-sm text-gray-600">활동 레벨</p>
        <p className="mt-2 text-xl font-bold">
          {activityLevel.emoji} {activityLevel.title}
        </p>
        <ProgressBar current={activityLevel.progress} total={100} />
        <p className="mt-2 text-sm text-gray-500">
          {activityLevel.totalParticipations}회 참여 · 다음 {activityLevel.nextTitle}
        </p>
      </Card>

      <Card className="mb-6">
        <h2 className="mb-4 text-lg font-bold">참여 통계</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">완료 활동</p>
            <p className="text-2xl font-bold">{completed.length}회</p>
          </div>
          <div>
            <p className="text-gray-600">월간 외출</p>
            <p className="text-2xl font-bold">{socialImpact.monthlyOutings}회</p>
          </div>
          <div>
            <p className="text-gray-600">새로운 관계</p>
            <p className="text-2xl font-bold">{socialImpact.newFriends}명</p>
          </div>
          <div>
            <p className="text-gray-600">활동 후기</p>
            <p className="text-2xl font-bold">{trustStats.reviewCount}개</p>
          </div>
        </div>
      </Card>

      {activityGraph.length > 0 && (
        <Card className="mb-6">
          <h2 className="mb-4 text-lg font-bold">Activity Graph</h2>
          <ul className="space-y-2">
            {activityGraph.map((a) => (
              <li key={a.category} className="flex justify-between">
                <span>{a.label}</span>
                <span className="font-semibold">{a.count}회</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      <div className="mb-6">
        <h2 className="mb-4 text-lg font-bold">AI 리포트</h2>
        <AiCoachCard coach={coach} />
      </div>

      <ProfileEditForm />

      <Card className="mt-6">
        <h2 className="mb-2 text-lg font-bold">이용 가이드</h2>
        <p className="text-sm text-gray-600">이음을 처음 사용하시나요? 30초 가이드를 다시 볼 수 있어요.</p>
        <Button href="/welcome?replay=1" variant="outline" size="md" className="mt-4 w-full">
          이용 가이드 다시 보기
        </Button>
        <Button href="/demo/home" variant="outline" size="md" className="mt-2 w-full">
          둘러보기 모드
        </Button>
      </Card>

      <form action="/auth/signout" method="post" className="mt-8">
        <button type="submit" className="w-full text-center text-gray-500 underline">
          로그아웃
        </button>
      </form>
    </AppShell>
  );
}
