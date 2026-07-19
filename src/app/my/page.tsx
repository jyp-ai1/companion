import Link from "next/link";
import { Header } from "@/components/Header";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { CATEGORY_LABELS } from "@/lib/types";

export default async function MyMeetupsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: parts } = await supabase
    .from("participations")
    .select("*, meetups(*)")
    .eq("user_id", user!.id)
    .in("status", ["confirmed", "completed"])
    .order("created_at", { ascending: false });

  return (
    <div className="flex flex-1 flex-col">
      <Header />
      <main className="mx-auto w-full max-w-lg px-6 py-10">
        <h1 className="mb-8">내 모임</h1>
        <div className="flex flex-col gap-4">
          {!parts?.length ? (
            <Card className="text-center">
              <p className="text-gray-600">아직 참여한 모임이 없습니다.</p>
              <Button href="/meetups" className="mt-4">
                모임 찾아보기
              </Button>
            </Card>
          ) : (
            parts.map((p) => {
              const m = p.meetups as {
                id: string;
                title: string;
                category: keyof typeof CATEGORY_LABELS;
                scheduled_at: string | null;
                location_name: string | null;
              };
              const dateStr = m.scheduled_at
                ? new Date(m.scheduled_at).toLocaleDateString("ko-KR", {
                    month: "long",
                    day: "numeric",
                  })
                : "";
              return (
                <Card key={p.id}>
                  <span className="rounded-full bg-brand-50 px-3 py-1 text-sm text-brand-700">
                    {CATEGORY_LABELS[m.category]}
                  </span>
                  <h3 className="mt-2 text-xl font-semibold">{m.title}</h3>
                  <p className="mt-2 text-gray-600">
                    {dateStr}
                    {m.location_name && ` · ${m.location_name}`}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    상태: {p.status === "completed" ? "완료" : "참여 예정"}
                  </p>
                  <Link
                    href={`/meetups/${m.id}`}
                    className="mt-4 inline-block text-brand-600 underline"
                  >
                    상세 보기
                  </Link>
                </Card>
              );
            })
          )}
        </div>
        <form action="/auth/signout" method="post" className="mt-10">
          <button
            type="submit"
            className="w-full text-center text-gray-500 underline"
          >
            로그아웃
          </button>
        </form>
      </main>
    </div>
  );
}
