/** 사용자-facing 카피 — 나이를 말하지 않는 동행 브랜드 */
export const COPY = {
  brand: "Daily Companion",
  brandPromise: "관심사로 이어지는 동행",
  tagline: "오늘, 30초만 함께해요.",
  growthTagline: "혼자 들어왔다가, 함께 나갑니다.",
  inviteFriendHint: "우리 둘 다 좋아하는 관심사로, 같이 이음을 시작해 보세요.",
  activity: "함께하기",
  activities: "활동",
  openActivity: "지금 함께하기",
  togetherRequest: "함께하기 요청",
  joinPrompt: "오늘 함께 걸어보실래요?",
  joinYes: "네, 가능해요",
  joinLater: "다음에",
  discoverActivities: "활동 둘러보기",
  weeklySuggest: "이번 주 함께하기",
  emptyActivities: "곧 새로운 활동이 열립니다.",
  walkTogether: "오늘 함께 걷기",
  coffeeTogether: "커피 한 잔 하기",
  movieTogether: "같이 영화 보기",
  anonymousNote: "이름은 활동 후 공개 · 연령·지역·관심사만 표시",
  trustTitle: "나의 동행 배지",
  trustHint: "점수나 등급 없이, 함께한 활동으로 쌓인 배지만 보여드려요.",
  reviewTitle: "오늘 활동은 어떠셨나요?",
  reviewCommentLabel: "한 줄 후기 (선택)",
  reviewCommentPlaceholder: "오늘 함께해서 좋았던 점을 적어주세요",
  againTitle: "이분과 다시 함께하고 싶나요?",
  safeMeetTitle: "안전하게 함께하기",
  safeMeetTips: [
    "공공장소에서 만나세요.",
    "개인정보는 천천히 공유하세요.",
    "처음에는 30~60분 활동을 추천합니다.",
  ],
  safeMeetConfirm: "안내를 확인했어요",
  reportTitle: "신고하기",
  reportSubmit: "신고 접수",
  reportDone: "신고가 접수되었습니다. 검토 후 조치하겠습니다.",
  blockTitle: "차단하기",
  blockConfirm: "이 사용자를 차단할까요?",
  blockDone: "차단되었습니다. 추천과 Together에서 보이지 않습니다.",
  emergencyNote: "긴급 연락 기능은 준비 중입니다. 위험 상황 시 112 또는 119에 연락해 주세요.",
} as const;

export function activityPhrase(interest: string): string {
  const map: Record<string, string> = {
    walk: COPY.walkTogether,
    coffee: COPY.coffeeTogether,
    movie: COPY.movieTogether,
    hiking: "동네 산책",
    travel: "가볍게 나들이",
    culture: "문화 나누기",
  };
  return map[interest] ?? `오늘 ${interest} 함께하기`;
}
