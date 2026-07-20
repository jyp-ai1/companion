"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { generateIeumCode } from "@/lib/ieum/dna";
import { calculateTypeCode } from "@/lib/ieum/scoring";
import type { Question } from "@/lib/types";

export async function completeIeumTest(input: {
  interestSlugs: string[];
  answers: { question_id: number; selected_option: "A" | "B" }[];
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "로그인이 필요합니다." };

  if (input.interestSlugs.length < 3) {
    return { error: "관심사를 3개 이상 선택해 주세요." };
  }

  const { data: questions, error: qErr } = await supabase
    .from("questions")
    .select("*")
    .order("sort_order");

  if (qErr || !questions?.length) {
    return { error: "질문을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요." };
  }

  const score = calculateTypeCode(questions as Question[], input.answers);
  const dna = generateIeumCode(input.interestSlugs, score);

  for (const a of input.answers) {
    const { error } = await supabase.from("answers").upsert(
      {
        user_id: user.id,
        question_id: a.question_id,
        selected_option: a.selected_option,
      },
      { onConflict: "user_id,question_id" },
    );
    if (error) {
      console.error("answers upsert", error);
      return { error: "답변 저장에 실패했습니다." };
    }
  }

  const { error: delErr } = await supabase
    .from("user_interests")
    .delete()
    .eq("user_id", user.id);
  if (delErr) {
    console.error("user_interests delete", delErr);
    return { error: "관심사 저장에 실패했습니다." };
  }

  const { error: insErr } = await supabase.from("user_interests").insert(
    input.interestSlugs.map((interest_slug) => ({
      user_id: user.id,
      interest_slug,
    })),
  );
  if (insErr) {
    console.error("user_interests insert", insErr);
    return {
      error:
        "관심사 저장에 실패했습니다. Supabase에 interest_tags 마이그레이션이 적용됐는지 확인해 주세요.",
    };
  }

  const { error: profileErr } = await supabase
    .from("user_profiles")
    .update({
      type_code: score.type_code,
      activity_score: score.activity_score,
      relationship_score: score.relationship_score,
      interest_score: score.interest_score,
      participation_score: score.participation_score,
      ieum_code: dna.ieum_code,
      dna_title: dna.dna_title,
      test_completed_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (profileErr) {
    console.error("user_profiles update", profileErr);
    return { error: "이음 코드 저장에 실패했습니다." };
  }

  revalidatePath("/home");
  revalidatePath("/browse");
  revalidatePath("/my/profile");
  revalidatePath("/test/result");

  return {
    ok: true as const,
    ieumCode: dna.ieum_code,
    dnaTitle: dna.dna_title,
  };
}

export async function getUserInterestSlugs(): Promise<string[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("user_interests")
    .select("interest_slug")
    .eq("user_id", user.id);

  return data?.map((r) => r.interest_slug) ?? [];
}
