import type { Question } from "@/lib/types";

export interface TestAnswer {
  question_id: number;
  selected_option: "A" | "B";
}

export interface ScoreResult {
  type_code: string;
  activity_score: number;
  relationship_score: number;
  interest_score: number;
  participation_score: number;
}

const AXIS_MAP = {
  activity: { a: "A", b: "P" },
  relationship: { a: "C", b: "S" },
  interest: { a: "H", b: "L" },
  participation: { a: "R", b: "F" },
} as const;

export function calculateTypeCode(
  questions: Question[],
  answers: TestAnswer[],
): ScoreResult {
  const answerMap = new Map(answers.map((a) => [a.question_id, a.selected_option]));

  const axisScores: Record<string, { a: number; total: number; letterA: string; letterB: string }> = {
    activity: { a: 0, total: 0, letterA: "A", letterB: "P" },
    relationship: { a: 0, total: 0, letterA: "C", letterB: "S" },
    interest: { a: 0, total: 0, letterA: "H", letterB: "L" },
    participation: { a: 0, total: 0, letterA: "R", letterB: "F" },
  };

  for (const q of questions) {
    const selected = answerMap.get(q.id);
    if (!selected) continue;

    const axis = axisScores[q.axis];
    axis.total += 1;
    if (selected === "A") axis.a += 1;
  }

  const getLetter = (axis: keyof typeof axisScores) => {
    const s = axisScores[axis];
    const ratio = s.total > 0 ? s.a / s.total : 0.5;
    return ratio >= 0.5 ? s.letterA : s.letterB;
  };

  const type_code =
    getLetter("activity") +
    getLetter("relationship") +
    getLetter("interest") +
    getLetter("participation");

  return {
    type_code,
    activity_score: axisScores.activity.total
      ? axisScores.activity.a / axisScores.activity.total
      : 0.5,
    relationship_score: axisScores.relationship.total
      ? axisScores.relationship.a / axisScores.relationship.total
      : 0.5,
    interest_score: axisScores.interest.total
      ? axisScores.interest.a / axisScores.interest.total
      : 0.5,
    participation_score: axisScores.participation.total
      ? axisScores.participation.a / axisScores.participation.total
      : 0.5,
  };
}
