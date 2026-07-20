"use client";

import { useState, useTransition } from "react";
import { createTogetherRequest, createFriendInviteLink } from "@/app/actions/growth";
import { INTEREST_TAGS } from "@/lib/ieum/interests";
import { COPY } from "@/lib/copy";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

export function TogetherRequestForm() {
  const [pending, startTransition] = useTransition();
  const [interest, setInterest] = useState("walk");
  const [location, setLocation] = useState("");
  const [time, setTime] = useState("15:00");
  const [result, setResult] = useState<{ message: string } | null>(null);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const today = new Date();
    const [h, m] = time.split(":").map(Number);
    today.setHours(h, m, 0, 0);
    if (today.getTime() < Date.now()) today.setDate(today.getDate() + 1);

    startTransition(async () => {
      const res = await createTogetherRequest({
        interestSlug: interest,
        locationName: location || "우리 동네",
        startsAt: today.toISOString(),
        durationMinutes: 30,
      });
      if (res.message) setResult({ message: res.message });
    });
  }

  if (result) {
    return (
      <Card className="border-brand-200 bg-brand-50">
        <p className="text-sm font-medium text-brand-600">AI 초대 문구</p>
        <p className="mt-3 whitespace-pre-line leading-relaxed">{result.message}</p>
        <p className="mt-4 text-sm text-gray-600">
          Anonymous First — 이름 없이 연령·지역·관심사만 보입니다.
        </p>
        <Button href="/home" variant="outline" size="md" className="mt-4">
          홈으로
        </Button>
      </Card>
    );
  }

  return (
    <Card>
      <h2 className="text-lg font-bold">함께하기 요청</h2>
      <p className="mt-2 text-gray-600">예약·채팅 없이, 초대 한 장으로 시작합니다.</p>
      <form onSubmit={submit} className="mt-6 flex flex-col gap-4">
        <div>
          <p className="mb-2 font-medium">관심사</p>
          <div className="flex flex-wrap gap-2">
            {INTEREST_TAGS.slice(0, 8).map(({ slug, label, emoji }) => (
              <button
                key={slug}
                type="button"
                onClick={() => setInterest(slug)}
                className={`rounded-xl border-2 px-3 py-2 ${
                  interest === slug ? "border-brand-600 bg-brand-50" : "border-brand-100"
                }`}
              >
                {emoji} {label}
              </button>
            ))}
          </div>
        </div>
        <Input
          label="장소"
          placeholder="예: 미사호수공원"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <Input
          label="시간"
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
        <Button type="submit" disabled={pending} className="w-full">
          {pending ? "생성 중..." : "함께하기 요청 만들기"}
        </Button>
      </form>
    </Card>
  );
}

export function FriendInviteShare() {
  const [pending, startTransition] = useTransition();
  const [share, setShare] = useState<{ url: string; message: string } | null>(null);

  function createLink() {
    startTransition(async () => {
      const res = await createFriendInviteLink("coffee");
      if (res.url && res.message) setShare({ url: res.url, message: res.message });
    });
  }

  return (
    <Card className="mt-6">
      <h2 className="text-lg font-bold">친구 초대</h2>
      <p className="mt-2 text-gray-600">{COPY.inviteFriendHint}</p>
      {!share ? (
        <Button onClick={createLink} disabled={pending} variant="outline" className="mt-4">
          초대 링크 만들기
        </Button>
      ) : (
        <div className="mt-4 rounded-xl bg-brand-50 p-4">
          <p className="text-sm">{share.message}</p>
          <p className="mt-2 break-all text-sm text-brand-700">{share.url}</p>
          <Button
            size="md"
            className="mt-4"
            onClick={() => navigator.clipboard?.writeText(`${share.message}\n${share.url}`)}
          >
            복사하기
          </Button>
        </div>
      )}
    </Card>
  );
}
