import { AppShell } from "@/components/AppShell";
import {
  FriendInviteShare,
  TogetherRequestForm,
} from "@/components/growth/TogetherRequestForm";
import { Card } from "@/components/ui/Card";
import { COPY } from "@/lib/copy";

export default function InvitePage() {
  return (
    <AppShell title="초대">
      <h1 className="mb-2 text-2xl font-bold">{COPY.togetherRequest}</h1>
      <p className="mb-6 text-gray-600">{COPY.growthTagline}</p>

      <Card className="mb-6 border-dashed border-brand-300 bg-brand-50/50">
        <p className="font-medium">Anonymous First</p>
        <ul className="mt-3 space-y-1 text-sm text-gray-700">
          <li>· 이름 대신 연령대 · 지역 · 관심사</li>
          <li>· 채팅 없이 먼저 함께하기</li>
          <li>· 활동 후 상호 동의 시 프로필 공개</li>
        </ul>
      </Card>

      <TogetherRequestForm />
      <FriendInviteShare />
    </AppShell>
  );
}
