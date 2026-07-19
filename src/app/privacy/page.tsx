import Link from "next/link";
import { Card } from "@/components/ui/Card";

export default function PrivacyPage() {
  return (
    <div className="flex flex-1 flex-col px-6 py-10">
      <Link href="/" className="mb-8 text-brand-600">
        ← 홈으로
      </Link>
      <Card className="mx-auto max-w-2xl">
        <h1 className="mb-6">개인정보 처리방침</h1>
        <div className="space-y-4 text-gray-700">
          <p>
            이음(Companion)은 50~75세 사용자의 활동 연결 서비스를 제공합니다.
          </p>
          <h2 className="text-xl font-semibold text-foreground">수집 항목</h2>
          <ul className="list-disc pl-6">
            <li>필수: 이름, 이메일, 휴대폰, 연령대, 거주 지역</li>
            <li>선택: 성별, 활동 가능 시간</li>
            <li>서비스 이용: 이음 타입 결과, 모임 참여, 후기</li>
          </ul>
          <h2 className="text-xl font-semibold text-foreground">이용 목적</h2>
          <p>맞춤 활동 추천, 지역 모임 연결, 서비스 개선 및 MVP 검증</p>
          <h2 className="text-xl font-semibold text-foreground">문의</h2>
          <p>juinjip0@gmail.com</p>
        </div>
      </Card>
    </div>
  );
}
