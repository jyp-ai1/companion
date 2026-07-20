import { AppShell } from "@/components/AppShell";
import {
  CategoryRecommendRow,
  RecommendationRow,
} from "@/components/feed/RecommendationRow";
import { SimilarPersonRow } from "@/components/interest/InterestCards";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { INTEREST_TAGS, INTEREST_TO_CATEGORY } from "@/lib/ieum/interests";
import { getUserDiscoveryContext } from "@/lib/ieum/user-context";
import Link from "next/link";

export default async function RecommendPage() {
  const ctx = await getUserDiscoveryContext();
  if (!ctx) return null;

  const { dnaTitle, ieumCode, similarPeople, peerActivities, scoredMeetups, profile } =
    ctx;

  const categoryScores = INTEREST_TAGS.slice(0, 8).map((cat, i) => ({
    ...cat,
    score: Math.max(75, 95 - i * 3),
  }));

  return (
    <AppShell title="Discover">
      <h1 className="mb-2 text-2xl font-bold">Discover</h1>
      <p className="mb-6 text-gray-600">
        Spotify처럼 — 나와 맞는 관심사와 사람을 발견합니다
      </p>

      <Card className="bg-brand-50">
        <p className="font-medium">
          {profile?.display_name ?? "회원"}님과 비슷한 관심사를 가진 사람이
        </p>
        <p className="mt-2 text-3xl font-bold text-brand-700">
          우리 동네에 {ctx.similarCount}명
        </p>
        <Button href="/people" variant="outline" size="md" className="mt-4">
          비슷한 사람 보기
        </Button>
      </Card>

      <h2 className="mb-4 mt-10 text-xl font-bold">나와 비슷한 사람</h2>
      <div className="flex flex-col gap-3">
        {similarPeople.slice(0, 3).map((person) => (
          <SimilarPersonRow key={person.id} person={person} />
        ))}
      </div>

      <h2 className="mb-4 mt-10 text-xl font-bold">비슷한 사람들이 좋아하는 활동</h2>
      <div className="flex flex-col gap-3">
        {peerActivities.slice(0, 4).map((a) => (
          <Link
            key={a.slug}
            href={`/meetups?category=${INTEREST_TO_CATEGORY[a.slug] ?? a.slug}`}
          >
            <Card className="flex items-center gap-4 hover:border-brand-300">
              <span className="text-3xl">{a.emoji}</span>
              <div className="flex-1">
                <p className="font-semibold">{a.label}</p>
                <p className="text-sm text-gray-500">{a.count}명 관심</p>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <h2 className="mb-4 mt-10 text-xl font-bold">추천 활동</h2>
      <div className="flex flex-col gap-3">
        {categoryScores.map((cat) => (
          <CategoryRecommendRow
            key={cat.slug}
            category={cat.slug}
            label={cat.label}
            icon={cat.emoji}
            score={cat.score}
          />
        ))}
      </div>

      <h2 className="mb-4 mt-10 text-xl font-bold">추천 모임</h2>
      <div className="flex flex-col gap-3">
        {scoredMeetups.slice(0, 5).map((item) => (
          <RecommendationRow key={item.meetup.id} item={item} />
        ))}
      </div>
    </AppShell>
  );
}
