import { BrowseSearchForm } from "@/components/browse/BrowseFilters";
import { InterestChip } from "@/components/browse/ActivityCard";
import { INTEREST_TAGS } from "@/lib/ieum/interests";

export function HomeDiscoverFilter() {
  return (
    <div className="mt-4">
      <BrowseSearchForm />
      <div className="mt-6">
        <p className="mb-3 text-base font-bold">관심사로 발견하기</p>
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12">
          {INTEREST_TAGS.map((tag) => (
            <InterestChip
              key={tag.slug}
              slug={tag.slug}
              label={tag.label}
              emoji={tag.emoji}
              href={`/browse?cat=${tag.slug}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
