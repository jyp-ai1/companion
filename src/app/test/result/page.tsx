import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { rankMeetups } from "@/lib/ieum/recommend";
import { getInterestEmoji, getInterestLabel, interestsToCategories } from "@/lib/ieum/interests";
import type { Meetup } from "@/lib/types";
import { Header } from "@/components/Header";
import { MeetupCard } from "@/components/meetup/MeetupCard";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { InterestDNAChip } from "@/components/interest/InterestCards";

async function getParticipantCount(meetupId: string) {
  const supabase = await createClient();
  const { data } = await supabase.rpc("get_meetup_participant_count", {
    meetup_uuid: meetupId,
  });
  return (data as number) ?? 0;
}

export default async function TestResultPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { data: interestRows } = await supabase
    .from("user_interests")
    .select("interest_slug")
    .eq("user_id", user.id);

  const myInterests = interestRows?.map((r) => r.interest_slug) ?? [];

  if (!profile?.test_completed_at) {
    return (
      <div className="flex flex-1 items-center justify-center px-6">
        <Card className="text-center">
          <p>아직 이음 코드를 만들지 않으셨어요.</p>
          <Button href="/test" className="mt-4">
            시작하기
          </Button>
        </Card>
      </div>
    );
  }

  const categories = interestsToCategories(myInterests);

  const { data: allMeetups } = await supabase
    .from("meetups")
    .select("*")
    .eq("is_active", true);

  const recommended = rankMeetups(
    (allMeetups as Meetup[]) ?? [],
    categories,
    profile.region,
    3,
  );

  const counts = await Promise.all(recommended.map((m) => getParticipantCount(m.id)));

  return (
    <div className="flex flex-1 flex-col">
      <Header />
      <main className="mx-auto w-full max-w-lg px-6 py-10">
        <Card className="text-center">
          <div className="text-5xl">🧬</div>
          <p className="mt-4 text-sm font-medium text-brand-600">나의 이음 코드</p>
          <h1 className="mt-2 text-2xl font-bold">{profile.dna_title ?? "이음 회원"}</h1>
          <p className="mt-2 font-mono text-lg text-brand-700">
            {profile.ieum_code ?? "—"}
          </p>
          <p className="mt-4 text-gray-600">
            관심사와 생활 방식을 바탕으로 만들어졌습니다.
          </p>
          {myInterests.length > 0 && (
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {myInterests.map((slug) => (
                <InterestDNAChip key={slug} slug={slug} active />
              ))}
            </div>
          )}
        </Card>

        <h2 className="mb-4 mt-10 text-xl font-semibold">나와 비슷한 사람들이 좋아하는 활동</h2>
        <div className="flex flex-wrap gap-2">
          {myInterests.slice(0, 4).map((slug) => (
            <span
              key={slug}
              className="rounded-2xl border-2 border-brand-100 px-4 py-3 font-medium"
            >
              {getInterestEmoji(slug)} {getInterestLabel(slug)}
            </span>
          ))}
        </div>

        <h2 className="mb-4 mt-10 text-xl font-semibold">이번 주 추천 모임</h2>
        <div className="flex flex-col gap-4">
          {recommended.length === 0 ? (
            <Card>
              <p className="text-gray-600">곧 새로운 모임이 열립니다.</p>
            </Card>
          ) : (
            recommended.map((m, i) => (
              <MeetupCard key={m.id} meetup={m} participantCount={counts[i]} />
            ))
          )}
        </div>

        <Button href="/home" className="mt-8 w-full">
          홈에서 발견하기
        </Button>
        <Link href="/people" className="mt-4 block text-center text-brand-600 underline">
          비슷한 사람 둘러보기
        </Link>
      </main>
    </div>
  );
}
