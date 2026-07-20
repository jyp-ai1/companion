export type ActivityLevel = {
  level: number;
  title: string;
  emoji: string;
  nextTitle: string;
  progress: number;
  totalParticipations: number;
};

const LEVELS = [
  { min: 0, title: "새싹", emoji: "🌱", next: "활동가" },
  { min: 3, title: "활동가", emoji: "🌿", next: "커뮤니티 리더" },
  { min: 10, title: "커뮤니티 리더", emoji: "🌳", next: "이음 앰배서더" },
  { min: 25, title: "이음 앰배서더", emoji: "⭐", next: "최고 레벨" },
];

export function getActivityLevel(completedCount: number): ActivityLevel {
  let current = LEVELS[0];
  for (const lvl of LEVELS) {
    if (completedCount >= lvl.min) current = lvl;
  }
  const idx = LEVELS.indexOf(current);
  const next = LEVELS[idx + 1];
  const progress = next
    ? Math.min(
        100,
        Math.round(
          ((completedCount - current.min) / (next.min - current.min)) * 100,
        ),
      )
    : 100;

  return {
    level: idx + 1,
    title: current.title,
    emoji: current.emoji,
    nextTitle: current.next,
    progress,
    totalParticipations: completedCount,
  };
}

export type Badge = {
  id: string;
  title: string;
  emoji: string;
  earned: boolean;
  description: string;
};

export function getBadges(stats: {
  completedCount: number;
  categoryCounts: Record<string, number>;
  streakWeeks: number;
  metNewPeople: number;
}): Badge[] {
  const { completedCount, categoryCounts, streakWeeks, metNewPeople } = stats;
  const uniqueCategories = Object.keys(categoryCounts).length;

  return [
    {
      id: "first",
      title: "첫 걸음",
      emoji: "👣",
      earned: completedCount >= 1,
      description: "첫 모임 참여",
    },
    {
      id: "explorer",
      title: "탐험가",
      emoji: "🧭",
      earned: uniqueCategories >= 3,
      description: "3가지 활동 경험",
    },
    {
      id: "social",
      title: "새로운 인연",
      emoji: "🤝",
      earned: metNewPeople >= 1,
      description: "새 친구 만남",
    },
    {
      id: "streak",
      title: "꾸준함",
      emoji: "🔥",
      earned: streakWeeks >= 2,
      description: "2주 연속 참여",
    },
    {
      id: "leader",
      title: "활동 리더",
      emoji: "🏆",
      earned: completedCount >= 10,
      description: "10회 참여",
    },
  ];
}
