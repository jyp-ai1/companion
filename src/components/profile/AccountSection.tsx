"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export function LogoutButton({ className }: { className?: string }) {
  return (
    <form action="/auth/signout" method="post" className={className}>
      <Button type="submit" variant="outline" className="w-full">
        로그아웃
      </Button>
    </form>
  );
}

export function AccountSection() {
  return (
    <Card className="mb-4 mt-8 border-brand-100">
      <h2 className="mb-2 text-lg font-bold">계정</h2>
      <p className="mb-4 text-sm text-warm-gray">다른 계정으로 로그인하려면 로그아웃해 주세요.</p>
      <LogoutButton />
    </Card>
  );
}
