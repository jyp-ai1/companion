"use client";

import { useState, useTransition } from "react";
import { markSafeGuideSeen } from "@/app/actions/trust";
import { COPY } from "@/lib/copy";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export function SafeMeetGuide({
  showDismiss = true,
  onDismiss,
}: {
  showDismiss?: boolean;
  onDismiss?: () => void;
}) {
  const [pending, startTransition] = useTransition();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed && showDismiss) return null;

  function confirm() {
    startTransition(async () => {
      await markSafeGuideSeen();
      setDismissed(true);
      onDismiss?.();
    });
  }

  return (
    <Card className="mb-6 border-2 border-brand-200 bg-brand-50/60">
      <p className="font-semibold text-brand-800">{COPY.safeMeetTitle}</p>
      <ul className="mt-3 space-y-2 text-gray-700">
        {COPY.safeMeetTips.map((tip) => (
          <li key={tip} className="flex gap-2">
            <span className="text-brand-600">✓</span>
            {tip}
          </li>
        ))}
      </ul>
      {showDismiss && (
        <Button
          onClick={confirm}
          disabled={pending}
          size="md"
          className="mt-4 w-full"
        >
          {pending ? "..." : COPY.safeMeetConfirm}
        </Button>
      )}
    </Card>
  );
}
