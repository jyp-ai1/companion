export type SocialHealthReport = {
  score: number;
  delta: number;
  monthlyActivities: number;
  peopleTogether: number;
  newConnections: number;
  streakWeeks: number;
  interestDiversity: number;
  labels: { key: string; label: string; value: number; trend: "up" | "flat" | "down" }[];
};

export function buildSocialHealthReport(input: {
  monthlyActivities: number;
  lastMonthActivities: number;
  peopleTogether: number;
  newConnections: number;
  streakWeeks: number;
  interestCount: number;
  completedTotal: number;
}): SocialHealthReport {
  const {
    monthlyActivities,
    lastMonthActivities,
    peopleTogether,
    newConnections,
    streakWeeks,
    interestCount,
    completedTotal,
  } = input;

  const activityScore = Math.min(30, monthlyActivities * 6);
  const peopleScore = Math.min(25, peopleTogether * 5);
  const newScore = Math.min(15, newConnections * 5);
  const streakScore = Math.min(15, streakWeeks * 4);
  const diversityScore = Math.min(15, interestCount * 2);

  const score = Math.round(
    activityScore + peopleScore + newScore + streakScore + diversityScore,
  );
  const lastScore = Math.max(
    40,
    score - (monthlyActivities - lastMonthActivities) * 4 - newConnections * 2,
  );
  const delta = score - lastScore;

  return {
    score: Math.min(99, Math.max(35, score)),
    delta,
    monthlyActivities,
    peopleTogether,
    newConnections,
    streakWeeks,
    interestDiversity: interestCount,
    labels: [
      {
        key: "outings",
        label: "외출 활동",
        value: monthlyActivities,
        trend: monthlyActivities >= lastMonthActivities ? "up" : "flat",
      },
      {
        key: "people",
        label: "함께한 사람",
        value: peopleTogether,
        trend: peopleTogether > 0 ? "up" : "flat",
      },
      {
        key: "new",
        label: "새로운 인연",
        value: newConnections,
        trend: newConnections > 0 ? "up" : "flat",
      },
      {
        key: "streak",
        label: "연속 활동",
        value: streakWeeks,
        trend: streakWeeks >= 2 ? "up" : "flat",
      },
      {
        key: "diversity",
        label: "관심사 다양성",
        value: interestCount,
        trend: interestCount >= 3 ? "up" : "flat",
      },
    ],
  };
}
