"use client";

import { useTransition } from "react";
import { consentProfileReveal } from "@/app/actions/growth";
import { Button } from "@/components/ui/Button";

export function ProfileRevealButton({
  peerUserId,
  className,
}: {
  peerUserId: string;
  className?: string;
}) {
  const [pending, startTransition] = useTransition();

  function reveal() {
    startTransition(async () => {
      await consentProfileReveal(peerUserId);
    });
  }

  return (
    <Button onClick={reveal} disabled={pending} className={className ?? "w-full"}>
      {pending ? "처리 중..." : "함께한 뒤 프로필 공개 동의"}
    </Button>
  );
}
