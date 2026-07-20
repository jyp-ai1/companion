import { AppShell } from "@/components/AppShell";
import { CompatibilityBreakdownView } from "@/components/discovery/CompatibilityBreakdown";
import { CommonGroundCard, SimilarPersonRow } from "@/components/interest/InterestCards";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { getPeerDisplayLabels } from "@/lib/ieum/anonymous-context";
import { COPY } from "@/lib/copy";
import { getUserDiscoveryContext } from "@/lib/ieum/user-context";
import { createClient } from "@/lib/supabase/server";

export default async function PeoplePage() {
  const ctx = await getUserDiscoveryContext();
  if (!ctx) return null;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { similarWithCompat, similarCount, profile } = ctx;
  const myName = profile?.display_name ?? "회원";

  const nameById = Object.fromEntries(
    similarWithCompat.map((p) => [p.id, p.display_name]),
  );
  const labels = await getPeerDisplayLabels(user.id, similarWithCompat.map((p) => p.id), nameById);

  return (
    <AppShell title="비슷한 사람">
      <h1 className="mb-2">나와 비슷한 사람</h1>
      <p className="mb-2 text-gray-600">
        공통 관심사 Life Graph · {similarCount}명
      </p>
      <p className="mb-6 text-sm text-gray-500">{COPY.anonymousNote}</p>

      {similarWithCompat.length === 0 ? (
        <Card className="text-center">
          <p className="text-gray-600">아직 비슷한 사람 데이터가 없습니다.</p>
          <Button href="/test" className="mt-4">
            이음 코드 만들기
          </Button>
        </Card>
      ) : (
        <>
          {similarWithCompat[0] && (
            <>
              <CommonGroundCard
                myName={myName}
                person={similarWithCompat[0]}
                displayLabel={labels.get(similarWithCompat[0].id)?.label}
                isAnonymous={!labels.get(similarWithCompat[0].id)?.revealed}
              />
              <div className="mt-6">
                <CompatibilityBreakdownView compat={similarWithCompat[0].compatibility} />
              </div>
            </>
          )}
          <h2 className="mb-4 mt-10 text-lg font-bold">더 많은 이웃</h2>
          <div className="flex flex-col gap-3">
            {similarWithCompat.slice(1).map((person) => (
              <SimilarPersonRow
                key={person.id}
                person={person}
                displayLabel={labels.get(person.id)?.label}
              />
            ))}
          </div>
        </>
      )}
    </AppShell>
  );
}
