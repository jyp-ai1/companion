import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { rankMeetups } from "@/lib/ieum/recommend";
import type { Meetup, MeetupCategory, TypeDefinition } from "@/lib/types";
import { Header } from "@/components/Header";
import { MeetupCard } from "@/components/meetup/MeetupCard";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

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

  if (!profile?.type_code) {
    return (
      <div className="flex flex-1 items-center justify-center px-6">
        <Card className="text-center">
          <p>아직 테스트를 완료하지 않으셨어요.</p>
          <Button href="/test" className="mt-4">
            테스트 시작
          </Button>
        </Card>
      </div>
    );
  }

  const { data: typeDef } = await supabase
    .from("type_definitions")
    .select("*")
    .eq("type_code", profile.type_code)
    .single();

  const typed = typeDef as TypeDefinition | null;

  const { data: rules } = await supabase
    .from("type_category_rules")
    .select("category, priority")
    .eq("type_code", profile.type_code)
    .order("priority");

  const categories = (rules?.map((r) => r.category) ?? []) as MeetupCategory[];

  const { data: allMeetups } = await supabase
    .from("meetups")
    .select("*")
    .eq("is_active", true);

  const recommended = rankMeetups(
    (allMeetups as Meetup[]) ?? [],
    categories,
    profile.region,
    5,
  );

  const counts = await Promise.all(
    recommended.map((m) => getParticipantCount(m.id)),
  );

  return (
    <div className="flex flex-1 flex-col">
      <Header />
      <main className="mx-auto w-full max-w-lg px-6 py-10">
        <Card className="text-center">
          <div className="text-5xl">{typed?.emoji ?? "🌿"}</div>
          <h1 className="mt-4">{typed?.title ?? profile.type_code}입니다</h1>
          <p className="mt-4 text-lg text-gray-600">
            {typed?.description ?? "나에게 맞는 활동을 찾아보세요."}
          </p>
          {typed?.recommendations && (
            <p className="mt-4 text-brand-700">
              추천 활동: {typed.recommendations.join(" · ")}
            </p>
          )}
        </Card>

        <h2 className="mb-4 mt-10 text-xl font-semibold">이번 주 추천</h2>
        <div className="flex flex-col gap-4">
          {recommended.length === 0 ? (
            <Card>
              <p className="text-gray-600">
                곧 {profile.region} 지역에 새로운 모임이 열립니다.
              </p>
              <Link href="/meetups" className="mt-4 inline-block text-brand-600 underline">
                전체 모임 보기
              </Link>
            </Card>
          ) : (
            recommended.map((m, i) => (
              <MeetupCard
                key={m.id}
                meetup={m}
                participantCount={counts[i]}
              />
            ))
          )}
        </div>

        <Button href="/home" variant="outline" className="mt-8 w-full">
          홈으로 가기
        </Button>
      </main>
    </div>
  );
}
