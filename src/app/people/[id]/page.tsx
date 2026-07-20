import { notFound } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { ProfileRevealButton } from "@/components/growth/ProfileRevealButton";
import { ReportBlockActions } from "@/components/trust/ReportBlockActions";
import { TrustProfileCard } from "@/components/trust/TrustProfileCard";
import { CompatibilityBreakdownView } from "@/components/discovery/CompatibilityBreakdown";
import { WhyReasons } from "@/components/discovery/WhyReasons";
import { Card } from "@/components/ui/Card";
import { COPY } from "@/lib/copy";
import { generatePairSummary } from "@/lib/ieum/ai-summary";
import { getPeerDisplayLabels } from "@/lib/ieum/anonymous-context";
import { calculateCompatibility } from "@/lib/ieum/compatibility";
import { getInterestEmoji, getInterestLabel } from "@/lib/ieum/interests";
import { getUserDiscoveryContext } from "@/lib/ieum/user-context";
import { rankSimilarPeople, type MatchProfile } from "@/lib/ieum/similarity";
import { fetchTrustStatsForUser } from "@/lib/ieum/trust";
import { createClient } from "@/lib/supabase/server";

export default async function PersonDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const ctx = await getUserDiscoveryContext();
  if (!ctx) return null;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: peersRaw } = await supabase.rpc("get_matchable_profiles");
  const peers = (peersRaw ?? []) as MatchProfile[];
  const peer = peers.find((p) => p.id === id);

  if (!peer) notFound();

  const labels = await getPeerDisplayLabels(user.id, [id], {
    [id]: peer.display_name,
  });
  const display = labels.get(id);
  const revealed = display?.revealed ?? false;
  const displayName = display?.label ?? "이웃";

  const ranked = rankSimilarPeople(
    ctx.myInterests,
    {
      activity_score: Number(ctx.profile?.activity_score ?? 0.5),
      relationship_score: Number(ctx.profile?.relationship_score ?? 0.5),
      region: ctx.profile?.region ?? null,
    },
    [peer],
    1,
  );

  const person = ranked[0];
  if (!person) notFound();

  const compat = calculateCompatibility(
    ctx.myInterests,
    {
      activity_score: Number(ctx.profile?.activity_score ?? 0.5),
      relationship_score: Number(ctx.profile?.relationship_score ?? 0.5),
      participation_score: Number(ctx.profile?.participation_score ?? 0.5),
      region: ctx.profile?.region ?? null,
    },
    peer,
  );

  const aiSummary = revealed
    ? generatePairSummary(
        ctx.profile?.display_name ?? "회원",
        peer,
        person.sharedInterests,
        compat,
      )
    : "함께한 뒤 상호 동의하면 이름과 더 많은 정보를 볼 수 있어요.";

  const peerTrustStats = await fetchTrustStatsForUser(supabase, id);

  return (
    <AppShell title="프로필">
      {!revealed && (
        <Card className="mb-6 border-dashed border-brand-300 bg-brand-50/50">
          <p className="font-medium">Anonymous First</p>
          <p className="mt-2 text-sm text-gray-700">{COPY.anonymousNote}</p>
        </Card>
      )}

      <TrustProfileCard stats={peerTrustStats} compact />

      <Card className="mb-6 bg-brand-50">
        <p className="text-sm text-brand-600">{revealed ? "AI Summary" : "Anonymous Profile"}</p>
        <p className="mt-3 text-xl font-bold text-brand-800">{displayName}</p>
        <p className="mt-3 leading-relaxed text-gray-800">{aiSummary}</p>
      </Card>

      <CompatibilityBreakdownView compat={compat} />

      <Card className="mt-6">
        <p className="font-medium">
          {revealed ? `${peer.display_name ?? "이웃"}님과 공통점` : "공통 관심사"}
        </p>
        <ul className="mt-4 space-y-2">
          {person.sharedInterests.map((slug) => (
            <li key={slug} className="flex items-center gap-2">
              <span className="text-brand-600">✔</span>
              {getInterestEmoji(slug)} {getInterestLabel(slug)}
            </li>
          ))}
        </ul>
        <WhyReasons reasons={compat.reasons} className="mt-4" />
      </Card>

      {!revealed && <ProfileRevealButton peerUserId={id} className="mt-6" />}

      <ReportBlockActions userId={id} userLabel={displayName} />
    </AppShell>
  );
}
