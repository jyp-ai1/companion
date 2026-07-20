# 이음 서비스 설계 (Sprint 7+)

> MVP 기능 명세 → **매일 들어오는 라이프스타일 플랫폼**

## 핵심 질문

❌ "누구를 만날까요?" (시놀/소개팅)  
✅ **"오늘 무엇을 함께 해볼까요?"** (활동 우선)

---

## Home 9 Sections (구현 상태)

| # | Section | Sprint 7 |
|---|---------|----------|
| 1 | Greeting | ✅ |
| 2 | AI 오늘의 추천 (Simple-MBTI) | ✅ |
| 3 | 오늘 인기 모임 | ✅ |
| 4 | 나와 잘 맞는 모임 | ✅ |
| 5 | 우리 동네 모임 | ✅ |
| 6 | 새로운 모임 | ✅ |
| 7 | 관심사 카테고리 | ✅ |
| 8 | 이번주 행사 | 🔜 Sprint 8 |
| 9 | 친구 참여 (Coming Soon) | 🔜 |

---

## Bottom Navigation

| 탭 | 경로 | 상태 |
|----|------|------|
| 🏠 홈 | /home | ✅ |
| 🗺️ 모임 | /meetups | ✅ |
| ➕ 만들기 | /meetups/create | placeholder |
| ❤️ 내 활동 | /my | ✅ |
| 👤 마이 | /my/profile | ✅ |

---

## Sprint 8 — Discovery Platform

**핵심 전환:** Meeting(모임) → **Activity(활동)** 중심

| 탭 | 경로 | 역할 |
|----|------|------|
| 🏠 홈 | /home | Discovery Feed |
| ✨ 추천 | /recommend | AI 추천 (메인) |
| 🗓 일정 | /schedule | 오늘/내일/주/월 |
| ❤️ 내활동 | /my | 참여·배지·관심사 |
| 👤 마이 | /my/profile | 타입·통계·AI 리포트 |

**AI Coach:** 홈/추천 첫 카드  
**Dynamic MBTI:** 참여 기록 → evolved type  
**Gamification:** 활동 레벨, 배지  
**Social Impact:** Admin KPI (친구·외출·재참여·만족도)

---

## Simple-MBTI 지속 노출

- Home AI 카드: 매일 type + 추천 이유
- 프로필: 타입 표시 + 재테스트
- 향후: 참여 데이터 → 타입 진화

---

## 프로필 관리

- /my/profile: 이름, 휴대폰, 연령대, 성별, **시도→시군구** 지역

---

## IA (Information Architecture)

```
Landing (비로그인)
  └─ Signup / Login

App (로그인)
  ├─ Home ★
  ├─ Meetups (+ category filter)
  ├─ Meetup Detail → Join → Review
  ├─ My Activity
  ├─ My Profile (edit)
  ├─ Search (Sprint 8)
  ├─ Test / Result
  └─ Admin
```

---

## 화면 목록 (~40화면 로드맵)

Phase 1 (완료): Landing, Auth, Onboarding, Test, Home v1, Meetups, My  
Phase 2 (Sprint 7): Home v2, Bottom Nav, Profile Edit, Region Picker  
Phase 3 (Sprint 8): Search, Calendar, Map, Create Meetup, Challenge  
Phase 4: Friend, AI Evolution, Notifications
