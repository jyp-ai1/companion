import { Suspense } from "react";
import Link from "next/link";
import { SignupForm } from "@/components/auth/SignupForm";
import { Card } from "@/components/ui/Card";

function SignupFallback() {
  return (
    <Card className="mx-auto w-full max-w-md text-center">
      <p className="text-gray-600">가입 화면을 불러오는 중...</p>
    </Card>
  );
}

export default function SignupPage() {
  return (
    <div className="flex flex-1 flex-col px-6 py-8">
      <Link href="/" className="mb-8 font-medium text-brand-600">
        ← 홈으로
      </Link>
      <Suspense fallback={<SignupFallback />}>
        <SignupForm />
      </Suspense>
    </div>
  );
}
