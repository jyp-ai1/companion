import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { COPY } from "@/lib/copy";
import { getInterestLabel } from "@/lib/ieum/interests";

export default async function InviteLandingPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const supabase = await createClient();

  const { data: link } = await supabase
    .from("invite_links")
    .select("*")
    .eq("code", code)
    .maybeSingle();

  if (!link) {
    return (
      <div className="flex flex-1 items-center justify-center px-6">
        <Card className="text-center">
          <p>초대 링크를 찾을 수 없습니다.</p>
          <Button href="/signup" className="mt-4">
            이음 시작하기
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col px-6 py-12">
      <div className="mx-auto w-full max-w-md text-center">
        <span className="text-4xl">🌿</span>
        <h1 className="mt-4 text-2xl font-bold">이음</h1>
        <p className="mt-2 text-lg text-brand-700">{COPY.brandPromise}</p>
        <Card className="mt-8 text-left">
          <p className="whitespace-pre-line leading-relaxed">{link.message}</p>
          {link.interest_slug && (
            <p className="mt-4 text-sm text-gray-600">
              공통 관심사: {getInterestLabel(link.interest_slug)}
            </p>
          )}
        </Card>
        <Button href={`/signup?ref=${code}`} size="lg" className="mt-8 w-full">
          같이 시작하기
        </Button>
        <Link href="/login" className="mt-4 inline-block text-brand-600 underline">
          이미 계정이 있어요
        </Link>
      </div>
    </div>
  );
}
