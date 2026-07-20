import { AppShell } from "@/components/AppShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function CreateMeetupPage() {
  return (
    <AppShell title="모임 만들기">
      <h1 className="mb-6">모임 만들기</h1>
      <Card className="text-center">
        <p className="text-4xl">➕</p>
        <p className="mt-4 text-gray-600">
          모임 생성 기능은 Sprint 8에서 구현 예정입니다.
        </p>
        <Button href="/meetups" variant="outline" className="mt-6">
          모임 둘러보기
        </Button>
      </Card>
    </AppShell>
  );
}
