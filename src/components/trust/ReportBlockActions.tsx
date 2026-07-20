"use client";

import { useState, useTransition } from "react";
import { blockUser, reportUser } from "@/app/actions/trust";
import { COPY } from "@/lib/copy";
import { REPORT_REASONS, type ReportReason } from "@/lib/ieum/trust";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export function ReportBlockActions({
  userId,
  userLabel,
}: {
  userId: string;
  userLabel: string;
}) {
  const [pending, startTransition] = useTransition();
  const [mode, setMode] = useState<"idle" | "report" | "block">("idle");
  const [reason, setReason] = useState<ReportReason>("uncomfortable");
  const [detail, setDetail] = useState("");
  const [message, setMessage] = useState("");

  function submitReport() {
    startTransition(async () => {
      const res = await reportUser({ reportedUserId: userId, reason, detail });
      if (res.error) {
        setMessage(res.error);
        return;
      }
      setMessage(COPY.reportDone);
      setMode("idle");
    });
  }

  function submitBlock() {
    startTransition(async () => {
      const res = await blockUser(userId);
      if (res.error) {
        setMessage(res.error);
        return;
      }
      setMessage(COPY.blockDone);
      setMode("idle");
    });
  }

  if (message) {
    return (
      <Card className="mt-6 border-brand-200 bg-brand-50">
        <p className="text-gray-700">{message}</p>
      </Card>
    );
  }

  if (mode === "report") {
    return (
      <Card className="mt-6">
        <p className="font-semibold">{COPY.reportTitle}</p>
        <p className="mt-1 text-sm text-gray-600">{userLabel}</p>
        <div className="mt-4 flex flex-col gap-2">
          {REPORT_REASONS.map((r) => (
            <button
              key={r.value}
              type="button"
              onClick={() => setReason(r.value)}
              className={`min-h-[48px] rounded-xl border-2 px-4 text-left ${
                reason === r.value ? "border-brand-600 bg-brand-50" : "border-brand-100"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
        <textarea
          className="mt-4 w-full rounded-xl border-2 border-brand-100 p-3"
          rows={3}
          placeholder="추가 설명 (선택)"
          value={detail}
          onChange={(e) => setDetail(e.target.value)}
        />
        <div className="mt-4 flex gap-2">
          <Button variant="outline" onClick={() => setMode("idle")} className="flex-1">
            취소
          </Button>
          <Button onClick={submitReport} disabled={pending} className="flex-1">
            {COPY.reportSubmit}
          </Button>
        </div>
      </Card>
    );
  }

  if (mode === "block") {
    return (
      <Card className="mt-6">
        <p className="font-semibold">{COPY.blockTitle}</p>
        <p className="mt-2 text-gray-700">{COPY.blockConfirm}</p>
        <p className="mt-1 text-sm text-gray-500">{userLabel}</p>
        <div className="mt-4 flex gap-2">
          <Button variant="outline" onClick={() => setMode("idle")} className="flex-1">
            취소
          </Button>
          <Button onClick={submitBlock} disabled={pending} className="flex-1">
            차단
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="mt-6 flex flex-col gap-2">
      <Button variant="outline" size="md" onClick={() => setMode("report")}>
        {COPY.reportTitle}
      </Button>
      <Button variant="outline" size="md" onClick={() => setMode("block")}>
        {COPY.blockTitle}
      </Button>
      <p className="text-center text-xs text-gray-500">{COPY.emergencyNote}</p>
    </div>
  );
}
