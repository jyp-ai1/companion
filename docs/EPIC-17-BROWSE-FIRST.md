# EPIC 17 — Real Home Experience (Browse First)

## 목표

로그인 이후 **탐색(Browse)** 이 서비스의 중심이 되도록 IA를 전면 개편한다.

우선순위: **관심사 → 활동 → 사람 → 함께하기** (모임/사람 우선 ❌)

## 완료 항목

| # | 항목 | 구현 |
|---|------|------|
| 1 | Bottom Nav | 홈 · 둘러보기 · 함께 · 내 활동 · 마이 |
| 2 | Home 전면 개편 | Hero + 검색 + 관심사 + 10개 섹션 스크롤 |
| 3 | Browse 신설 | `/browse` 카테고리 탭 + 필터 + 더보기 |
| 4 | Activity Detail | `/browse/[id]` 소개·준비물·후기·비슷한 활동 |
| 5 | Demo Catalog | 408개 샘플 활동 (24 관심사 × 17) |
| 6 | Redirects | `/recommend`, `/search` → `/browse` |
| 7 | Empty State | 조건 없을 때 AI 추천 활동 자동 표시 |

## 라우트

| 경로 | 역할 |
|------|------|
| `/home` | 오늘 둘러볼 거리 (탐색 중심) |
| `/browse` | 카테고리·필터 탐색 |
| `/browse/[id]` | 활동 상세 |
| `/recommend` | → `/browse` 리다이렉트 |

## Home 섹션 순서

1. Hero + 검색 + Quick Category
2. 🔥 오늘 많이 함께하는 활동
3. 관심사로 발견하기
4. ✨ AI 추천 · Today For You
5. 이번 주 추천
6. 👀 이번 주 많이 본 활동
7. 🌿 오늘 새로 올라온 함께하기
8. 💬 이번 주 후기
9. 📍 지역별 추천
10. 🌱 오늘 새로 온 이웃
11. 📸 오늘의 추억 (Memory)
12. Footer CTA — 오늘 함께하기 만들기

## Browse 필터

- **카테고리**: 전체, 걷기, 커피, 영화, … 기타
- **시간**: 전체 · 오늘 · 이번 주
- **정렬**: AI추천 · 인기순 · 가까운순 · 최신
- **추가**: 무료 · 유료 · 초보환영 · 지역

## 핵심 파일

- `src/lib/browse/catalog.ts` — 408개 데모 활동 + 필터 헬퍼
- `src/lib/browse/types.ts` — BrowseActivity, 탭, 지역
- `src/app/home/page.tsx` — Browse-first Home
- `src/app/browse/page.tsx` — Browse 목록
- `src/app/browse/[id]/page.tsx` — 활동 상세
- `src/components/browse/*` — 카드, 필터, 리스트
- `src/components/AppShell.tsx` — Bottom Nav IA

## 카피 규칙

- ✅ 활동, 함께하기, 동행, 발견, 관심사
- ❌ 모임 (검색·UI에서 제거)
- 데모 데이터: "예시 활동 데이터" 표시

## 다음 단계 (기능 추가 X)

- Supabase `meetups` / `open_activities` 와 Browse 카탈로그 병합
- 행동 로그 · 퍼널 분석 · A/B 테스트
- 활동 상세 → 실제 함께하기 신청 플로우 연결
