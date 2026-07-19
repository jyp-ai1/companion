import { Card } from "@/components/ui/Card";

export default function SignupPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-16">
      <Card className="w-full max-w-md text-center">
        <div className="mb-4 text-4xl">🌿</div>
        <h1 className="mb-3">회원가입</h1>
        <p className="mb-6 text-gray-600">
          Sprint 1에서 구현 예정입니다.
          <br />
          Supabase Auth 연동 후 활성화됩니다.
        </p>
        <a
          href="/"
          className="text-brand-600 font-semibold underline underline-offset-4 hover:text-brand-700"
        >
          ← 홈으로 돌아가기
        </a>
      </Card>
    </div>
  );
}
