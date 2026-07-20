# EPIC 14 — Trust & Safety

## 목표

> 이음은 "사람을 연결하는 서비스"가 아니라 **"안전하게 함께할 수 있는 환경"**을 제공한다.

## 완료 항목

| # | 기능 | 상태 |
|---|------|------|
| 1 | Trust Profile (배지만, 점수 없음) | ✅ `/my/profile`, `/people/[id]` |
| 2 | Activity Review (이모지 + 한 줄 후기) | ✅ meetup + open activity |
| 3 | Again (네/괜찮아요/다음 기회에) | ✅ → Together Coach 연동 |
| 4 | Safe Meet Guide | ✅ 첫 참여 시 카드 |
| 5 | Report | ✅ 4가지 사유 |
| 6 | Block | ✅ 추천/Together/People 제외 |
| 7 | Emergency | 📋 설계만 (copy.emergencyNote) |
| 8 | Admin Trust Dashboard | ✅ `/admin` |
| 9 | Trust Badge | ✅ 자동 부여 |
| 10 | Copy | ✅ 평가/점수/등급 금지 톤 |

## Trust Badge 조건

| 배지 | 조건 |
|------|------|
| 🌱 첫걸음 | 1회 활동 완료 |
| 🌿 꾸준한 동행 | 5회 |
| 🌳 믿음직한 이웃 | 20회 |
| 💬 따뜻한 후기 | 후기 10개 |
| ⭐ 지역 리더 | 다시 함께하기(네) 10회 |

## DB Migration

`supabase/migrations/20260720000009_trust_safety.sql`

- `open_activity_reviews`
- `again_together`
- `user_reports`
- `user_blocks`
- `get_trust_metrics()` RPC
- Block filter on `get_matchable_profiles`, `get_together_connections`

## 주요 파일

```
src/lib/ieum/trust.ts
src/app/actions/trust.ts
src/components/trust/*
src/app/meetups/[id]/review/page.tsx
src/app/activities/[id]/review/page.tsx
```

## Copy 원칙

- ❌ 평가, 점수, 등급, 별점
- ✅ 함께하기, 동행, 활동, 후기, 응원

## 개발 원칙 (Founder)

> **"60~70대 사용자가 설명 없이 사용할 수 있는가?"**

통과 못하면 기능 추가 대신 UX 다듬기.
