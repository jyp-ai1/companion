/** EPIC 15.5 — Demo / Experience 샘플 데이터 (실제 데이터 아님) */

export const DEMO_DISCLAIMER = "예시 화면입니다.";

export const DEMO_STATS = {
  walkingToday: { region: "하남", count: 18, label: "오늘 함께 걷는 사람" },
  coffeeThisWeek: { count: 24, label: "이번 주 커피 좋아하는 분" },
  newConnections: { count: 132, label: "새로운 인연" },
} as const;

export const DEMO_TODAY_CARD = {
  title: "오늘 30분 산책",
  subtitle: "함께할 사람 3명",
  location: "미사호수공원",
  time: "오후 3시",
  invitation: "안녕하세요.\n걷기를 좋아하는 분과\n가볍게 30분 산책하고 싶습니다.",
};

export const DEMO_INVITE_CARD = {
  title: "오늘 커피 한 잔",
  prompt: "같이 하실래요?",
  anonymous: "60대 · 하남 · 커피 좋아함",
};

export const DEMO_MEMORY = {
  date: "오늘",
  newPeople: 1,
  durationMinutes: 35,
  note: "오늘도 좋은 하루였습니다.",
  activity: "미사호수공원 산책",
};

export const DEMO_TOGETHER = [
  {
    id: "demo-1",
    label: "60대 · 하남 · 걷기 좋아함",
    meetCount: 2,
    lastActivity: "30분 산책",
  },
  {
    id: "demo-2",
    label: "50대 · 성남 · 커피 좋아함",
    meetCount: 1,
    lastActivity: "커피 한 잔",
  },
];

export const DEMO_ACTIVITIES = {
  upcoming: [
    {
      id: "demo-u1",
      title: "오후 3시 · 30분 산책",
      category: "산책",
      location: "미사호수공원",
    },
  ],
  completed: [
    {
      id: "demo-c1",
      title: "커피 한 잔",
      category: "카페",
      note: "즐거웠어요",
    },
  ],
};

export const DEMO_DISCOVER = [
  { emoji: "🚶", title: "오늘 30분 산책", people: 3 },
  { emoji: "☕", title: "커피 한 잔", people: 2 },
  { emoji: "🌳", title: "동네 공원 걷기", people: 4 },
];

export const EXPERIENCE_SCREENS = [
  {
    id: 1,
    title: "오늘 함께할 사람을\n발견해요",
    description: "3분이면\n나와 비슷한 관심사를 가진 사람을\n찾아드립니다.",
    illustration: "discover" as const,
    stat: DEMO_STATS.walkingToday,
  },
  {
    id: 2,
    title: "오늘의 추천이\n도착했어요",
    description: "AI가\n오늘 가장 잘 맞는 활동을\n추천해드립니다.",
    illustration: "recommend" as const,
    sample: DEMO_TODAY_CARD,
  },
  {
    id: 3,
    title: "부담 없이\n함께 시작하세요",
    description:
      "처음에는\n익명으로 시작합니다.\n\n원하면\n활동 후\n프로필을 공개할 수 있습니다.",
    illustration: "invite" as const,
    sample: DEMO_INVITE_CARD,
  },
  {
    id: 4,
    title: "좋은 하루는\n추억이 됩니다",
    description: "오늘의 활동이\n추억으로 기록됩니다.",
    illustration: "memory" as const,
    sample: DEMO_MEMORY,
    stat: DEMO_STATS.newConnections,
  },
] as const;
