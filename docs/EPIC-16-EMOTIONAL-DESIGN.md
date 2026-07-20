# EPIC 16 — Emotional Design & First Impression

## 목표

기능을 추가하지 않는다.

> 첫 30초 안에 **"여기 따뜻한 서비스다."** 를 느끼게 한다.

## 완료 항목

| # | 항목 | 구현 |
|---|------|------|
| 1 | Landing Hero | 감성 카피 + 행동 칩 (☕🚶🎨) |
| 2 | Device Mockup | Landing + 온보딩 4장 |
| 3 | Empty State | 행동 유도 + CTA |
| 4 | 오늘의 한마디 | Home 최상단 · 50개 로테이션 |
| 5 | Visual System | Green/Teal + Orange accent + Warm Gray |
| 6 | Animation | fade-in-up, slide-in, button micro |
| 7 | Typography | 18px base, 1.75 line-height, 52px+ buttons |
| 8 | Accessibility | 48px touch, focus-visible, WCAG AA 목표 |

## 오늘의 한마디

- `src/lib/ieum/daily-messages.ts` — 50개 문장
- `getDailyMessage(date?)` — 날짜 기반 결정적 선택
- 향후 AI 생성: 동일 인터페이스로 교체 가능

## Device Mockup

- `src/components/emotional/DeviceMockup.tsx`
- 화면: `today` | `together` | `memory` | `invite`

## Empty State

- `src/components/emotional/EmotionalUI.tsx` — `EmptyState`
- 적용: `/my`, `/together`, `/people`

## 다음 단계 (기능 추가 X)

- 사용자 행동 로그 / 퍼널 분석
- A/B 테스트 (카피, 온보딩 순서)
- Admin 운영 도구 (신고 처리, 활동 승인)

## Copy 원칙

❌ Discovery Engine, Life Graph, Interest Matching  
✅ 같이 걸어요, 새로운 사람을 만났어요, 오늘도 좋은 하루
