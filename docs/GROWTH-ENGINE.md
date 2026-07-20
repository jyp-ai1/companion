# Sprint 12 — Growth Engine

## 목표

> "사용자가 서비스를 사용한다" → **"사용자가 사람을 초대한다"**

기능 추가(푸시, 스트릭, AI 확장)가 아니라 **바이럴 루프**와 **Anonymous First**에 집중합니다.

## 브랜드

- **대외:** "관심사로 이어지는 동행"
- **대내 타깃:** 시니어 친화 UX, 하지만 "시니어 전용" / "50+" 문구는 사용하지 않음

## 핵심 기능

### 1. 함께하기 요청 (`/invite`)

- Open Activity에 **함께하기 요청** 생성
- 예약·채팅 없음 — 초대 한 장으로 시작
- AI 초대 문구: `generateInvitationMessage()` (rule-based LLM 대체)

### 2. Anonymous First

- 처음에는 **닉네임/이름 비공개**
- 표시: 연령대 · 지역 · 관심사
- 활동 후 **상호 동의** 시 프로필 공개 (`profile_reveals`)

### 3. 친구 초대 (`/invite/[code]`)

- 공유 링크 + AI 문구
- 가입 시 `?ref=` → `completeReferralSignup()`

### 4. Referral (설계만)

- `invite_links.use_count` 추적
- 추후: 추천인 보상, 정부 실증 KPI 연동

## Viral Loop

```
Activity → Invitation → New User → New Activity → Invitation
```

이벤트는 `growth_events` 테이블에 저장:

| event_type | 설명 |
|---|---|
| `invite_created` | 함께하기 요청 생성 |
| `invite_accepted` | 함께하기 수락 |
| `invite_shared` | 친구 초대 링크 생성 |
| `referral_signup` | 초대 링크로 가입 |
| `activity_join` | Open Activity 참여 |
| `profile_reveal` | 프로필 공개 동의 |
| `viral_loop_complete` | 루프 단계 완료 |

## Growth Metrics (Admin)

`get_growth_metrics()` RPC + Admin 대시보드:

- 초대 생성 수
- 초대 수락률
- 친구 초대 링크 수
- 초대 기반 가입
- 첫 활동 성공
- 프로필 상호 공개 (관계 지속률 proxy)

## DB Migration

`supabase/migrations/20260720000008_growth_engine.sql`

Supabase SQL Editor에서 실행 필요.

## 주요 파일

```
src/app/invite/page.tsx
src/app/invite/[code]/page.tsx
src/app/actions/growth.ts
src/lib/ieum/growth.ts
src/lib/ieum/anonymous.ts
src/lib/ieum/anonymous-context.ts
src/components/growth/TogetherRequestForm.tsx
src/components/growth/ProfileRevealButton.tsx
```

## 하지 않는 것 (Founder STOP)

- 푸시 알림
- 스트릭 / 게이미피케이션 확장
- LLM API 연동 (MVP는 rule-based 초대 문구)
