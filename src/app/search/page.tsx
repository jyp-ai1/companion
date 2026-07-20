import { AppShell } from "@/components/AppShell";
import { Card } from "@/components/ui/Card";

export default function SearchPage() {
  return (
    <AppShell title="검색">
      <h1 className="mb-6">모임 검색</h1>
      <Card className="text-center">
        <p className="text-4xl">🔍</p>
        <p className="mt-4 text-gray-600">
          지역 · 관심사 · 날짜 검색은 Sprint 8에서 구현 예정입니다.
        </p>
        <p className="mt-2 text-sm text-gray-500">
          지금은 홈 → 관심사 카테고리 또는 모임 탭을 이용해 주세요.
        </p>
      </Card>
    </AppShell>
  );
}
