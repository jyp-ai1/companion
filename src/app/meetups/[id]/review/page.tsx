"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

export default function ReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: meetupId } = use(params);
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [metNew, setMetNew] = useState<boolean | null>(null);
  const [retry, setRetry] = useState<boolean | null>(null);
  const [nextActivity, setNextActivity] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating < 1 || metNew === null || retry === null) return;
    setLoading(true);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from("reviews").insert({
      user_id: user.id,
      meetup_id: meetupId,
      rating,
      met_new_people: metNew,
      retry_intention: retry,
      next_activity: nextActivity || null,
    });

    await supabase
      .from("participations")
      .update({ status: "completed", satisfaction: rating })
      .eq("user_id", user.id)
      .eq("meetup_id", meetupId);

    router.push("/my");
  }

  return (
    <div className="flex flex-1 flex-col">
      <Header />
      <main className="mx-auto w-full max-w-lg px-6 py-10">
        <Link href={`/meetups/${meetupId}`} className="mb-6 inline-block text-brand-600">
          ← 모임으로
        </Link>
        <Card>
          <h1 className="mb-8">모임은 어떠셨나요?</h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            <div>
              <p className="mb-3 text-lg font-medium">만족도</p>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setRating(n)}
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl text-2xl transition-colors ${
                      rating >= n
                        ? "bg-brand-100 text-brand-700"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-3 text-lg font-medium">새로운 사람을 만나셨나요?</p>
              <div className="flex gap-3">
                {[
                  { label: "예", val: true },
                  { label: "아니오", val: false },
                ].map(({ label, val }) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setMetNew(val)}
                    className={`min-h-[52px] flex-1 rounded-2xl border-2 text-lg font-medium ${
                      metNew === val
                        ? "border-brand-600 bg-brand-50"
                        : "border-brand-100"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-3 text-lg font-medium">다시 참여하시겠어요?</p>
              <div className="flex gap-3">
                {[
                  { label: "예", val: true },
                  { label: "아니오", val: false },
                ].map(({ label, val }) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setRetry(val)}
                    className={`min-h-[52px] flex-1 rounded-2xl border-2 text-lg font-medium ${
                      retry === val
                        ? "border-brand-600 bg-brand-50"
                        : "border-brand-100"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <Input
              label="원하는 다음 활동 (선택)"
              value={nextActivity}
              onChange={(e) => setNextActivity(e.target.value)}
              placeholder="예: 등산, 독서 모임"
            />
            <Button
              type="submit"
              disabled={loading || rating < 1 || metNew === null || retry === null}
              className="w-full"
            >
              {loading ? "제출 중..." : "제출하기"}
            </Button>
          </form>
        </Card>
      </main>
    </div>
  );
}
