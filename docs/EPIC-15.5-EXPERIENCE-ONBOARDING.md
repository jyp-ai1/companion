# EPIC 15.5 — First Experience & Guided Onboarding

## 목표

서비스를 **설명하지 않는다.**

> "아, 이렇게 쓰는 서비스구나." — 30초 안에 이해

## 흐름

```
첫 방문 (/) → /welcome (4장 가이드) → 시작하기 | 둘러보기
```

- **건너뛰기** → 랜딩 `/`
- **시작하기** → `/signup`
- **먼저 둘러보기** → `/demo/home` (샘플 데이터)

## 4장 Experience Guide

| # | 제목 | 보여주는 것 |
|---|------|------------|
| 1 | 오늘 함께할 사람을 발견해요 | 산책·카페 일러스트 + 하남 18명 |
| 2 | 오늘의 추천이 도착했어요 | 30분 산책 · 3명 샘플 카드 |
| 3 | 부담 없이 함께 시작하세요 | 커피 초대 + Anonymous |
| 4 | 좋은 하루는 추억이 됩니다 | Memory 카드 · 35분 |

## Demo Mode (`/demo/*`)

| 탭 | 경로 |
|----|------|
| Home | `/demo/home` |
| Discover | `/demo/discover` |
| Together | `/demo/together` |
| Activity | `/demo/activity` |
| Memory | `/demo/memory` |

모든 화면 하단: **"예시 화면입니다."**

## Copy Rule

❌ Interest Matching, Life Graph, Discovery Engine, AI Engine  
✅ 같이 걸어요, 새로운 사람을 만났어요, 오늘도 좋은 하루였습니다

## 다시 보기

- `/welcome?replay=1`
- My → **이용 가이드 다시 보기**

## Empty State

데이터 없을 때 빈 화면 대신 샘플 카드 + "예시 화면입니다."

- `/my` (예정 활동 없음)
- `/together` (함께한 기록 없음)

## Cookies

| Cookie | 의미 |
|--------|------|
| `ieum_guide_seen=1` | 가이드 완료/건너뛰기 |
| `ieum_demo=1` | 둘러보기 모드 (7일) |

## 주요 파일

```
src/app/welcome/page.tsx
src/app/demo/**
src/components/experience/ExperienceGuide.tsx
src/lib/demo/experience-data.ts
src/app/actions/experience.ts
```
