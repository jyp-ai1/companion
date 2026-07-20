import { createClient } from "@/lib/supabase/server";
import { isProfileRevealed, toAnonymousProfile } from "@/lib/ieum/anonymous";

export type PeerDisplay = {
  label: string;
  revealed: boolean;
};

export async function getPeerDisplayLabels(
  currentUserId: string,
  peerIds: string[],
  nameById: Record<string, string | null | undefined> = {},
): Promise<Map<string, PeerDisplay>> {
  const map = new Map<string, PeerDisplay>();
  if (peerIds.length === 0) return map;

  const supabase = await createClient();

  const { data: reveals } = await supabase
    .from("profile_reveals")
    .select("user_id, peer_user_id, user_consented, peer_consented")
    .or(
      `and(user_id.eq.${currentUserId},peer_user_id.in.(${peerIds.join(",")})),and(peer_user_id.eq.${currentUserId},user_id.in.(${peerIds.join(",")}))`,
    );

  const revealByPeer = new Map<string, { user_consented: boolean; peer_consented: boolean }>();
  for (const row of reveals ?? []) {
    const peerId = row.user_id === currentUserId ? row.peer_user_id : row.user_id;
    revealByPeer.set(peerId, {
      user_consented: row.user_consented,
      peer_consented: row.peer_consented,
    });
  }

  for (const peerId of peerIds) {
    const reveal = revealByPeer.get(peerId) ?? null;
    if (isProfileRevealed(reveal)) {
      map.set(peerId, {
        label: nameById[peerId] ?? "이웃",
        revealed: true,
      });
      continue;
    }

    try {
      const { data: anonRaw } = await supabase.rpc("get_anonymous_profile", {
        target_user: peerId,
      });
      const anon = anonRaw?.[0] as
        | { age_group: string | null; region: string | null; interest_slugs: string[] }
        | undefined;
      if (anon) {
        map.set(peerId, {
          label: toAnonymousProfile({
            age_group: anon.age_group,
            region: anon.region,
            interest_slugs: anon.interest_slugs ?? [],
          }).label,
          revealed: false,
        });
        continue;
      }
    } catch {
      /* migration optional */
    }

    map.set(peerId, {
      label: buildFallbackLabel(nameById[peerId]),
      revealed: false,
    });
  }

  return map;
}

function buildFallbackLabel(displayName: string | null | undefined): string {
  if (!displayName) return "이웃 · Anonymous";
  return `${displayName[0] ?? ""}○○ · Anonymous`;
}
