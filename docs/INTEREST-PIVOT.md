# Product Pivot — Interest Matching Platform

> **"모임을 찾는 것이 아니라, 공통 관심사를 발견한다."**

## 객체 구조

```
User → Interest DNA (이음 코드) → Similarity → Activity → Meeting
```

모임은 **결과**이며, 관심사가 **시작점**입니다.

## 이음 코드

- MBTI/성격 검사 ❌
- 관심사 3~8개 선택 + 생활 질문 12문항 ✅
- Output: `ieum_code` + `dna_title` (예: AC-CO-WA-MV · 카페·걷기형)

## Similarity Engine

비교: 관심사, 활동성, 관계성, 지역  
Output: 0~100% + 공통점 카드

## Home 섹션 순서

1. 내 관심사 / 이음 코드
2. 나와 비슷한 사람
3. AI 추천
4. 비슷한 사람들이 좋아하는 활동
5. 추천 활동
6. **추천 모임 (마지막)**
7. 새로운 관심사
8. 오늘 가입한 사람

## DB Migration

`supabase/migrations/20260720000004_interest_dna.sql`  
Supabase SQL Editor에서 실행 필요.
