import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { MeetupReviewClient } from "@/components/trust/MeetupReviewClient";
import { Card } from "@/components/ui/Card";
import { buildAnonymousLabel } from "@/lib/ieum/anonymous";
import { createClient } from "@/lib/supabase/server";

export default async function MeetupReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: meetupId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  let peersRaw: { user_id: string; display_name: string | null; age_group: string | null }[] =
    [];
  try {
    const { data } = await supabase.rpc("get_meetup_co_participants", {
      meetup_uuid: meetupId,
    });
    peersRaw = (data ?? []) as typeof peersRaw;
  } catch {
    peersRaw = [];
  }

  const peers = peersRaw.map((p) => ({
    userId: p.user_id,
    label: buildAnonymousLabel(p.age_group, null, []),
  }));

  return (
    <AppShell title="활동 후기">
      <Link href={`/meetups/${meetupId}`} className="mb-6 inline-block text-brand-600">
        ← 활동으로
      </Link>
      <Card>
        <h1 className="mb-2 text-xl font-bold">활동 후기</h1>
        <p className="mb-8 text-gray-600">
          평가나 점수가 아니라, 오늘 함께한 활동에 대한 후기예요.
        </p>
        <MeetupReviewClient meetupId={meetupId} peers={peers} />
      </Card>
    </AppShell>
  );
}
