import { DEMO_INVITE_CARD, DEMO_MEMORY, DEMO_TODAY_CARD } from "@/lib/demo/experience-data";

export type MockupScreen = "today" | "together" | "memory" | "invite";

function TodayScreen() {
  return (
    <div className="space-y-2 p-3">
      <p className="text-[10px] font-medium text-brand-600">오늘</p>
      <p className="text-sm font-bold leading-tight">{DEMO_TODAY_CARD.title}</p>
      <p className="text-xs text-brand-700">{DEMO_TODAY_CARD.subtitle}</p>
      <div className="mt-2 rounded-xl bg-brand-600 py-2 text-center text-xs font-semibold text-white">
        함께 걸어보실래요?
      </div>
    </div>
  );
}

function TogetherScreen() {
  return (
    <div className="space-y-2 p-3">
      <p className="text-[10px] font-medium text-brand-600">Together</p>
      <div className="grid grid-cols-3 gap-1 text-center">
        <div className="rounded-lg bg-brand-50 py-2">
          <p className="text-sm font-bold text-brand-700">2</p>
          <p className="text-[8px] text-gray-600">함께한 사람</p>
        </div>
        <div className="rounded-lg bg-brand-50 py-2">
          <p className="text-sm font-bold text-brand-700">1</p>
          <p className="text-[8px] text-gray-600">새 인연</p>
        </div>
        <div className="rounded-lg bg-brand-50 py-2">
          <p className="text-sm font-bold text-brand-700">35</p>
          <p className="text-[8px] text-gray-600">분</p>
        </div>
      </div>
      <p className="text-xs text-gray-600">60대 · 하남 · 걷기 좋아함</p>
    </div>
  );
}

function MemoryScreen() {
  return (
    <div className="space-y-2 p-3">
      <p className="text-[10px] font-medium text-brand-600">Memory</p>
      <div className="flex gap-2">
        <span className="text-2xl">📸</span>
        <div>
          <p className="text-xs font-bold">{DEMO_MEMORY.activity}</p>
          <p className="text-[10px] text-gray-600">
            새 인연 {DEMO_MEMORY.newPeople}명 · {DEMO_MEMORY.durationMinutes}분
          </p>
        </div>
      </div>
      <p className="text-xs text-brand-800">{DEMO_MEMORY.note}</p>
    </div>
  );
}

function InviteScreen() {
  return (
    <div className="space-y-2 p-3">
      <p className="text-[10px] text-gray-500">오늘</p>
      <p className="text-sm font-bold">{DEMO_INVITE_CARD.title}</p>
      <p className="rounded-lg bg-brand-50 py-2 text-center text-xs font-medium text-brand-800">
        {DEMO_INVITE_CARD.prompt}
      </p>
      <p className="text-[10px] text-gray-500">{DEMO_INVITE_CARD.anonymous}</p>
    </div>
  );
}

const SCREENS: Record<MockupScreen, () => React.ReactNode> = {
  today: TodayScreen,
  together: TogetherScreen,
  memory: MemoryScreen,
  invite: InviteScreen,
};

export function DeviceMockup({
  screen,
  className = "",
}: {
  screen: MockupScreen;
  className?: string;
}) {
  const Screen = SCREENS[screen];
  return (
    <div className={`mx-auto w-[220px] ${className}`}>
      <div className="rounded-[2rem] border-[6px] border-gray-800 bg-gray-800 p-1 shadow-xl">
        <div className="rounded-[1.4rem] bg-white">
          <div className="flex justify-center py-1">
            <div className="h-1 w-12 rounded-full bg-gray-200" />
          </div>
          <div className="min-h-[200px] rounded-b-[1.4rem] bg-gradient-to-b from-brand-50/50 to-white">
            <Screen />
          </div>
        </div>
      </div>
      <p className="mt-3 text-center text-xs text-gray-400">예시 화면입니다.</p>
    </div>
  );
}

export const LANDING_ACTIONS = [
  { emoji: "☕", label: "커피 한 잔" },
  { emoji: "🚶", label: "함께 걷기" },
  { emoji: "🎨", label: "취미 나누기" },
  { emoji: "📚", label: "책 이야기" },
  { emoji: "🌿", label: "동네 산책" },
] as const;
