import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { OpenActivityReviewClient } from "@/components/trust/OpenActivityReviewClient";
import { Card } from "@/components/ui/Card";
import { buildAnonymousLabel } from "@/lib/ieum/anonymous";
import { createClient } from "@/lib/supabase/server";

export default async function OpenActivityReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: activityId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  let peersRaw: { user_id: string; display_name: string | null; age_group: string | null }[] =
    [];
  try {
    const { data } = await supabase.rpc("get_open_activity_co_participants", {
      activity_uuid: activityId,
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
      <Link href="/home" className="mb-6 inline-block text-brand-600">
        ← 홈으로
      </Link>
      <Card>
        <h1 className="mb-2 text-xl font-bold">함께하기 후기</h1>
        <p className="mb-8 text-gray-600">
          오늘 함께한 시간은 어떠셨나요? 편하게 남겨 주세요.
        </p>
        <OpenActivityReviewClient activityId={activityId} peers={peers} />
      </Card>
    </AppShell>
  );
}
