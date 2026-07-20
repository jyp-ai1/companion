# MVP 테스트 가이드 (비개발자용)

배포 URL: **https://companion-two-sepia.vercel.app** (jyp-ai2/companion)

---

## ⚠️ 테스트 전 필수 (1회만)

### A. Supabase 이메일 확인 끄기 (가장 중요!)

1. Supabase Dashboard → **Authentication** → **Providers** → **Email**
2. **Confirm email** 스위치를 **OFF** 로 변경 → Save

> 켜져 있으면 가입 후 "가입 중..."에서 멈추거나 이메일 확인을 기다려야 합니다.

### B. Supabase URL 설정

1. **Authentication** → **URL Configuration**
2. **Site URL**: jyp-ai1 Production URL (Vercel Dashboard에서 확인)
3. **Redirect URLs**에 추가:
   - `https://YOUR-URL.vercel.app/**`

### C. SQL 마이그레이션

Supabase **SQL Editor**에서 아래 파일 순서대로 Run:

1. `20260719000001_seed_data.sql` (seed)
2. `20260719000002_sprint1_6_features.sql`
3. `20260719000003_signup_fix.sql` ← **새로 추가**

---

## 전체 테스트 시나리오 (약 10분)

### 1️⃣ 회원가입 (Sprint 1)

1. jyp-ai1 Production URL 접속
2. **시작하기** 클릭
3. 이름, 휴대폰, 이메일, 비밀번호 입력 → **가입하기**
4. 연령대, 지역 선택 → **다음**

✅ 확인: 프로필 화면이 나오고 테스트로 넘어감

---

### 2️⃣ 이음 타입 테스트 (Sprint 2)

1. 12개 질문에 하나씩 선택 (탭하면 자동 다음)
2. 결과 페이지에서 **유형명 + 이모지** 확인
3. **이번 주 추천** 모임 1~5개 표시 확인

✅ 확인: "활력 동행형" 등 유형 + 추천 모임 카드

---

### 3️⃣ 모임 참여 (Sprint 3~4)

1. 추천 모임 **자세히 보기** 클릭
2. **참여하기** 클릭
3. **내 모임** 메뉴에서 참여 목록 확인
4. **참여 취소** 테스트 (선택)

✅ 확인: "참여 신청이 완료되었습니다" 메시지

---

### 4️⃣ 후기 작성 (Sprint 5)

> 모임 일정이 지난 모임만 후기 버튼 표시

테스트용: Supabase Table Editor → `meetups` → `scheduled_at`을 **어제 날짜**로 수정

1. 해당 모임 상세 → **후기 작성하기**
2. 만족도, 새 사람 만남, 재참여 여부 입력 → **제출**

✅ 확인: 내 모임에서 상태 "완료"

---

### 5️⃣ 관리자 (Sprint 6)

Supabase → Table Editor → `user_profiles` → 본인 row → `is_admin` = **true**

1. 홈 → **관리자** 버튼
2. 가입자 수, 테스트 완료율, 유형 분포 확인

---

## 체크리스트

| # | 기능 | OK? |
|---|------|-----|
| 1 | 랜딩 페이지 | ☐ |
| 2 | 회원가입 | ☐ |
| 3 | 프로필 입력 | ☐ |
| 4 | 12문항 테스트 | ☐ |
| 5 | 결과 + 추천 | ☐ |
| 6 | 모임 참여 | ☐ |
| 7 | 내 모임 | ☐ |
| 8 | 후기 | ☐ |
| 9 | Admin | ☐ |

---

## 자주 발생하는 문제

| 증상 | 해결 |
|------|------|
| 질문이 안 나옴 | Supabase seed SQL 실행 |
| 가입 오류 | Supabase Auth → Email 활성화 확인 |
| 추천 모임 0개 | seed SQL + region "경기 하남" 선택 |
| Admin 안 보임 | `is_admin = true` 설정 |

---

## 문의 시 알려주세요

1. 어느 단계에서 막혔는지
2. 화면 스크린샷
3. 오류 메시지 (있다면)
