import { COPY } from "@/lib/copy";
import { getTrustBadges, type TrustStats } from "@/lib/ieum/trust";
import { Card } from "@/components/ui/Card";

export function TrustProfileCard({
  stats,
  compact,
}: {
  stats: TrustStats;
  compact?: boolean;
}) {
  const badges = getTrustBadges(stats).filter((b) => b.earned);

  return (
    <Card className={compact ? "" : "mb-6"}>
      <p className="text-sm font-medium text-brand-600">{COPY.trustTitle}</p>
      {!compact && (
        <p className="mt-1 text-sm text-gray-600">{COPY.trustHint}</p>
      )}

      {badges.length === 0 ? (
        <p className="mt-4 text-gray-600">
          첫 활동 후 배지가 쌓입니다. 함께하기를 시작해 보세요.
        </p>
      ) : (
        <div className="mt-4 flex flex-wrap gap-2">
          {badges.map((badge) => (
            <span
              key={badge.id}
              className="inline-flex items-center gap-2 rounded-2xl bg-brand-50 px-4 py-2 text-sm font-medium text-brand-800"
              title={badge.description}
            >
              <span className="text-lg">{badge.emoji}</span>
              {badge.title}
            </span>
          ))}
        </div>
      )}

      {!compact && (
        <ul className="mt-4 space-y-1 text-sm text-gray-500">
          <li>· 함께한 활동 {stats.completedActivities}회</li>
          <li>· 활동 후기 {stats.reviewCount}개</li>
          <li>· 이음과 함께한 지 {stats.memberDays}일</li>
        </ul>
      )}
    </Card>
  );
}
