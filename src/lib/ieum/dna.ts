import { getInterestLabel } from "@/lib/ieum/interests";
import type { ScoreResult } from "@/lib/ieum/scoring";

export type IeumCodeResult = {
  ieum_code: string;
  dna_title: string;
  activity_label: string;
  relationship_label: string;
};

export function generateIeumCode(
  interestSlugs: string[],
  scores: ScoreResult,
): IeumCodeResult {
  const sorted = [...interestSlugs].slice(0, 3);
  const codes = sorted.map((s) => s.slice(0, 2).toUpperCase()).join("-");
  const activityLetter = scores.activity_score >= 0.5 ? "A" : "P";
  const socialLetter = scores.relationship_score >= 0.5 ? "C" : "S";
  const ieum_code = `${activityLetter}${socialLetter}-${codes || "IE-UM"}`;

  const labels = sorted.map(getInterestLabel);
  const dna_title =
    labels.length >= 2
      ? `${labels[0]}·${labels[1]}형`
      : labels.length === 1
        ? `${labels[0]}형`
        : "이음 회원";

  return {
    ieum_code,
    dna_title,
    activity_label: scores.activity_score >= 0.5 ? "활동적" : "여유로운",
    relationship_label: scores.relationship_score >= 0.5 ? "교류형" : "소수형",
  };
}
