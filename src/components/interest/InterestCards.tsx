import Link from "next/link";
import { getInterestEmoji, getInterestLabel } from "@/lib/ieum/interests";
import type { SimilarPerson } from "@/lib/ieum/similarity";
import { Card } from "@/components/ui/Card";

export function InterestDNAChip({
  slug,
  active,
}: {
  slug: string;
  active?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium ${
        active ? "bg-brand-600 text-white" : "bg-brand-50 text-brand-800"
      }`}
    >
      {getInterestEmoji(slug)} {getInterestLabel(slug)}
    </span>
  );
}

export function CommonGroundCard({
  myName,
  person,
  displayLabel,
  isAnonymous,
}: {
  myName: string;
  person: SimilarPerson;
  displayLabel?: string;
  isAnonymous?: boolean;
}) {
  const name = displayLabel ?? person.display_name ?? "이웃";
  return (
    <Card className="border-brand-200">
      <p className="text-sm text-gray-600">
        {myName}님과
      </p>
      <p className="mt-1 text-2xl font-bold text-brand-700">공통점 {person.similarity}%</p>
      <div className="my-4 border-t border-brand-100" />
      <ul className="space-y-2">
        {person.sharedInterests.slice(0, 5).map((slug) => (
          <li key={slug} className="flex items-center gap-2">
            <span className="text-brand-600">✔</span>
            {getInterestEmoji(slug)} {getInterestLabel(slug)}
          </li>
        ))}
      </ul>
      <p className="mt-4 text-sm text-gray-600">대화가 잘 통할 가능성이 높습니다.</p>
      <Link
        href={`/people/${person.id}`}
        className="mt-4 inline-block text-brand-600 underline"
      >
        {isAnonymous ? "Anonymous 프로필 보기" : `${name}님 프로필 보기`}
      </Link>
    </Card>
  );
}

export function SimilarPersonRow({
  person,
  displayLabel,
}: {
  person: SimilarPerson;
  displayLabel?: string;
}) {
  const name = displayLabel ?? person.display_name ?? "이웃";
  return (
    <Link href={`/people/${person.id}`}>
      <Card className="flex items-center gap-4 hover:border-brand-300">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-2xl">
          {person.sharedInterests[0]
            ? getInterestEmoji(person.sharedInterests[0])
            : "🙂"}
        </div>
        <div className="flex-1">
          <p className="font-semibold">{name}</p>
          <p className="text-sm text-gray-600">
            {person.age_group ?? "연령 비공개"}
            {person.region && ` · ${person.region.split(" ").pop()}`}
          </p>
          <p className="mt-1 text-sm text-brand-700">
            공통 관심사 {person.sharedInterests.length}개
          </p>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold text-brand-700">{person.similarity}%</p>
        </div>
      </Card>
    </Link>
  );
}
