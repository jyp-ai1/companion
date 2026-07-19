# Project AGEZERO MVP

## AI 기반 시니어 사회관계 연결 플랫폼

**서비스명(가칭):** 이음  
**Tagline:** "오늘, 함께할 사람이 있습니다."

---

# 1. 프로젝트 개요

## Background

대한민국은 초고령사회로 진입하고 있으며, 고령층의 사회적 고립과 관계 단절 문제가 증가하고 있다.

기존 서비스는 소개팅 중심, 단순 커뮤니티, 지역 모임 게시판 형태가 대부분이며, 시니어 사용자가 쉽게 자신의 관심사와 성향에 맞는 사람과 활동을 찾도록 돕는 서비스는 부족하다.

---

# 2. 서비스 방향

## 우리가 만들지 않는 것

- 시니어 소개팅 서비스
- 데이팅 앱
- 단순 SNS
- 채팅 중심 서비스

## 우리가 만드는 것

**AI 기반 Social Connection Platform**

**목표:** "나와 맞는 사람과 활동을 발견하고, 지역 안에서 지속적인 관계를 만드는 서비스"

**핵심 가치:** 친구 · 취미 · 경험 · 지역 연결 · 건강한 사회관계

---

# 3. MVP 핵심 가설

| # | 가설 |
|---|------|
| H1 | 시니어는 새로운 연애보다 함께할 수 있는 활동과 관계를 원한다 |
| H2 | 사용자의 성향과 관심사를 파악하면 더 높은 모임 참여율을 만들 수 있다 |
| H3 | AI 기반 추천은 사용자의 탐색 부담을 줄이고 참여를 증가시킨다 |

---

# 4. Target User

**Primary:** 50~75세 액티브 시니어 (스마트폰 사용 가능, 새로운 활동 관심, 은퇴 이후 관계 감소 경험)

**Secondary:** 복지기관, 지자체, 시니어센터

---

# 5. Product Concept

```
가입 → 나의 이음 타입 확인 → 나에게 맞는 활동 추천
→ 지역 모임 참여 → 새로운 관계 형성 → 지속 참여
```

---

# 6. MVP 범위 (반드시 개발)

1. 회원가입
2. 사용자 프로필
3. Simple-MBTI (이음 타입)
4. 관심사 기반 추천
5. 지역 모임 조회
6. 모임 참여 신청
7. 후기 작성
8. 운영자 관리
9. 데이터 분석

---

# 7. UX Principle

| 원칙 | 설명 |
|------|------|
| **Simple** | 한 화면 한 목적 |
| **Large** | 큰 글씨, 큰 버튼 |
| **Trust** | 안심되는 표현 |
| **Human** | 기계적인 매칭 표현 금지 |

**금지 표현:** 매칭, 점수, 경쟁, 인기순위

---

# 8. Branding

- **브랜드:** 이음 (사람과 사람을 잇다)
- **톤:** 따뜻함, 신뢰, 편안함

---

# 9. User Flow

```
Landing → 회원가입 → 기본정보 입력 → 이음 타입 테스트
→ 결과 확인 → 추천 활동 확인 → 모임 참여
```

---

# 10. 회원가입

**필수:** 이름, 연령대, 지역, 휴대폰  
**선택:** 성별, 활동 가능 시간

---

# 11. 이음 타입 (Simple-MBTI)

성격 테스트가 아님. **활동 성향과 관계 스타일 파악**이 목적.

- 12문항, 3분 이내
- 4축: ACTIVE/PEACE · CONNECT/SMALL · HEALTH/LEARN · REGULAR/FLEXIBLE

---

# 12. Recommendation (MVP)

AI Model 사용하지 않음. **Rule Based Recommendation**

Input: 지역, 관심사, 이음 타입, 활동 선호  
Output: 추천 모임

---

# 13~15. Meeting / Review / Admin

→ 상세: `docs/IEUM-TYPE-DESIGN.md`, `docs/UX-WIREFRAME.md`, `docs/MVP-VALIDATION-PLAN.md` 참고

---

# 16. Database

| Table | 주요 필드 |
|-------|-----------|
| User | id, name, age_group, location, phone |
| UserProfile | user_id, type_code, 4축 score |
| Interest | id, name |
| Meeting | id, title, category, location, date, capacity, status |
| Participation | id, user_id, meeting_id, status |
| Review | id, user_id, meeting_id, rating, comment, retry_intention |

---

# 17. Tech Stack

Next.js · TypeScript · Tailwind CSS · shadcn/ui · Supabase · PostgreSQL · Vercel

---

# 18. Development Sprint

| Sprint | 내용 | 상태 |
|--------|------|------|
| 0 | Foundation | ✅ 완료 |
| 1 | 회원가입 + 프로필 | 🔜 |
| 2 | 이음 타입 | ⏳ |
| 3 | 추천 + 모임 리스트 | ⏳ |
| 4 | 모임 참여/취소 | ⏳ |
| 5 | 후기 + Analytics | ⏳ |
| 6 | Admin | ⏳ |

---

# 19. MVP KPI

| 영역 | 목표 |
|------|------|
| 가입자 | 100명 |
| 이음 테스트 완료 | 80%+ |
| 모임 | 20회+ |
| 참여율 | 60%+ |
| 재참여 | 40%+ |
| 만족도 | 4.5+ |

---

# 20. Future Roadmap

- **Phase 2:** LLM 기반 활동 추천
- **Phase 3:** AI Community Manager
- **Phase 4:** B2G/B2B (복지관, 지자체, 보험, 병원)

---

# Final Goal

MVP의 목적은 앱 출시가 아니다. 실제 시니어 사용자가 가입 → 성향 분석 → 추천 → 모임 참여 → 관계 지속을 **검증**하는 것이다.
