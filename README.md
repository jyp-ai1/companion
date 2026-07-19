# 이음 (Companion) — Age-Tech AI Platform

50~75세를 위한 AI 기반 활동·친구 매칭 플랫폼.

## Tech Stack

- **Frontend:** Next.js 16 + TypeScript + Tailwind CSS v4
- **Backend:** Supabase (Auth, PostgreSQL, RLS)
- **Deployment:** Vercel (**jyp-ai1/companion** — [배포 가이드](docs/DEPLOY.md))

## Quick Start

```bash
# 의존성 설치
npm install

# 환경변수 설정
cp .env.local.example .env.local
# .env.local에 Supabase URL/Key 입력

# 개발 서버
npm run dev
```

## Sprint Progress

| Sprint | Status | Description |
|--------|--------|-------------|
| 0 | ✅ Done | Foundation, DB schema, Landing |
| 1 | 🔜 Next | Auth & Onboarding |
| 2 | ⏳ | AI 이음 타입 테스트 |
| 3 | ⏳ | 모임 & Rule-based 추천 |
| 4 | ⏳ | 참여 & 피드백 |
| 5 | ⏳ | Admin & 실증 준비 |

## Documentation

| 문서 | 내용 |
|------|------|
| [docs/PRD.md](docs/PRD.md) | Project AGEZERO MVP 전체 명세 |
| [docs/IEUM-TYPE-DESIGN.md](docs/IEUM-TYPE-DESIGN.md) | 이음 타입 12문항·점수·추천 알고리즘 |
| [docs/UX-WIREFRAME.md](docs/UX-WIREFRAME.md) | 시니어 UX 화면별 와이어프레임 |
| [docs/MVP-VALIDATION-PLAN.md](docs/MVP-VALIDATION-PLAN.md) | 파일럿 검증·KPI·정부지원 증거 데이터 |
| [docs/SETUP.md](docs/SETUP.md) | Supabase/Vercel 설정 가이드 |

## Database

```bash
# Supabase CLI로 마이그레이션 적용
npx supabase db push
```

마이그레이션 파일:
- `supabase/migrations/20260719000000_initial_schema.sql` — 테이블 + RLS
- `supabase/migrations/20260719000001_seed_data.sql` — 12문항 + 16유형 + 샘플 모임
