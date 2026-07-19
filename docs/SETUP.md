# 이음 (Companion) — 설정 가이드

Sprint 0 배포 후 **직접 확인하고 설정해야 할 항목**입니다.

---

## ✅ 1. Supabase 프로젝트 생성 (필수)

1. [supabase.com](https://supabase.com) 로그인 → **juinjip0@gmail.com**
2. **New Project** 클릭
   - Name: `companion` (또는 `ieum`)
   - Region: **Northeast Asia (Seoul)** 권장
   - Database Password: 안전한 비밀번호 저장
3. 프로젝트 생성 후 **Settings → API** 에서 확인:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### DB 마이그레이션 적용

**방법 A — Supabase Dashboard (SQL Editor)**

1. Dashboard → **SQL Editor**
2. `supabase/migrations/20260719000000_initial_schema.sql` 내용 붙여넣기 → Run
3. `supabase/migrations/20260719000001_seed_data.sql` 내용 붙여넣기 → Run

**방법 B — Supabase CLI**

```bash
npm install -g supabase
supabase login
supabase link --project-ref YOUR_PROJECT_REF
supabase db push
```

### 확인 사항

- [ ] Table Editor에 7개 테이블 생성됨
  - `type_definitions`, `user_profiles`, `questions`, `answers`, `meetups`, `participations`, `type_category_rules`
- [ ] `questions` 테이블에 12행
- [ ] `type_definitions` 테이블에 16행
- [ ] `meetups` 테이블에 10행 (샘플 모임)

---

## ✅ 2. Vercel 배포 설정 (필수)

1. [vercel.com](https://vercel.com) 로그인 → **juinjip0@gmail.com**
2. **Add New Project** → GitHub repo `companion` 연결
3. **Environment Variables** 추가:

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |

4. Deploy 클릭

### 확인 사항

- [ ] Production URL 접속 시 랜딩 페이지 표시
- [ ] "시작하기" 버튼 클릭 → `/signup` 페이지 이동
- [ ] 모바일(375px)에서 글씨 크기·버튼 크기 적절

---

## ✅ 3. GitHub Repository (권장)

로컬 repo를 GitHub에 push:

```bash
gh repo create companion --public --source=. --push
```

또는 GitHub에서 수동 생성 후:

```bash
git remote add origin https://github.com/YOUR_USERNAME/companion.git
git push -u origin main
```

---

## ✅ 4. Auth 설정 (Sprint 1 전에)

Supabase Dashboard → **Authentication → Providers**:

- [ ] Email provider 활성화
- [ ] (선택) Kakao OAuth — Sprint 1에서 설정

**Authentication → URL Configuration:**

- Site URL: `https://YOUR_VERCEL_URL.vercel.app`
- Redirect URLs: `https://YOUR_VERCEL_URL.vercel.app/**`

---

## ✅ 5. 로컬 개발 환경

```bash
# .env.local 생성
cp .env.local.example .env.local
# Supabase URL/Key 입력

npm run dev
# http://localhost:3000
```

---

## Sprint 0 완료 체크리스트

| # | 항목 | 확인 |
|---|------|------|
| 1 | Next.js 프로젝트 생성 | ✅ |
| 2 | Supabase 스키마 마이그레이션 | ⬜ 직접 확인 |
| 3 | Seed data (12문항, 16유형) | ⬜ 직접 확인 |
| 4 | Vercel 배포 | ⬜ 직접 확인 |
| 5 | 환경변수 설정 | ⬜ 직접 확인 |
| 6 | 랜딩 페이지 동작 | ⬜ 직접 확인 |

---

## 다음 Sprint (Sprint 1)

Sprint 1에서는 아래를 구현합니다:

- Supabase Auth 회원가입/로그인
- 기본 프로필 입력 (이름, 출생년, 지역)
- 온보딩 가드 (미완료 시 리다이렉트)

Supabase + Vercel 설정 완료 후 알려주시면 Sprint 1을 진행합니다.
