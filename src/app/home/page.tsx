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

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", user!.id)
    .single();

  let recommended: Meetup[] = [];
  let typeDef: TypeDefinition | null = null;

  if (profile?.type_code) {
    const { data: td } = await supabase
      .from("type_definitions")
      .select("*")
      .eq("type_code", profile.type_code)
      .single();
    typeDef = td as TypeDefinition | null;

    const { data: rules } = await supabase
      .from("type_category_rules")
      .select("category")
      .eq("type_code", profile.type_code)
      .order("priority");

    const categories = (rules?.map((r) => r.category) ?? []) as MeetupCategory[];
    const { data: meetups } = await supabase
      .from("meetups")
      .select("*")
      .eq("is_active", true);

    recommended = rankMeetups(
      (meetups as Meetup[]) ?? [],
      categories,
      profile.region,
      3,
    );
  }

  const counts = await Promise.all(
    recommended.map((m) => getParticipantCount(m.id)),
  );

  return (
    <div className="flex flex-1 flex-col">
      <Header />
      <main className="mx-auto w-full max-w-lg px-6 py-10">
        <Card>
          <p className="text-gray-600">안녕하세요,</p>
          <h1 className="mt-1">
            {profile?.display_name ?? "회원"}님
          </h1>
          {typeDef && (
            <p className="mt-4 text-lg">
              {typeDef.emoji} {typeDef.title}
            </p>
          )}
          <p className="mt-2 text-gray-600">
            오늘, 함께할 사람이 있습니다.
          </p>
        </Card>

        {!profile?.test_completed_at && (
          <Card className="mt-6 border-brand-200 bg-brand-50">
            <p className="font-medium">이음 타입 테스트를 완료해 주세요</p>
            <Button href="/test" className="mt-4 w-full">
              테스트 시작 (2분)
            </Button>
          </Card>
        )}

        {recommended.length > 0 && (
          <>
            <h2 className="mb-4 mt-10 text-xl font-semibold">나를 위한 추천</h2>
            <div className="flex flex-col gap-4">
              {recommended.map((m, i) => (
                <MeetupCard
                  key={m.id}
                  meetup={m}
                  participantCount={counts[i]}
                />
              ))}
            </div>
          </>
        )}

        <div className="mt-8 flex flex-col gap-3">
          <Button href="/meetups" variant="outline" className="w-full">
            전체 모임 보기
          </Button>
          <Button href="/my" variant="secondary" className="w-full">
            내 모임
          </Button>
          {profile?.is_admin && (
            <Button href="/admin" variant="outline" className="w-full">
              관리자
            </Button>
          )}
        </div>
      </main>
    </div>
  );
}
