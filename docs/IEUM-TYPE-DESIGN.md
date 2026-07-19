# 이음 타입 (Simple-MBTI) 상세 설계서

> Sprint 2 구현 기준 문서. DB seed와 동기화됨.

---

## 1. 설계 원칙

| 원칙 | 설명 |
|------|------|
| 성격 테스트 아님 | "나는 어떤 사람?" → "나는 무엇을 같이 하고 싶은가?" |
| 3분 이내 | 12문항, 한 화면 1문항 |
| 결과 = 시작점 | 결과 페이지에서 바로 추천 모임 연결 |
| MVP = Rule-based | AI 모델 없음, type_code + region → category 매칭 |

---

## 2. 4축 모델

| 축 | 코드 | A측 | B측 | 측정 |
|----|------|-----|-----|------|
| 1. 활동 | A / P | **A**ctive | **P**eace | 외출·체험 vs 조용·대화 |
| 2. 관계 | C / S | **C**onnect | **S**mall | 넓은 관계 vs 깊은 소수 |
| 3. 관심 | H / L | **H**ealth | **L**earn | 운동·건강 vs 문화·배움 |
| 4. 참여 | R / F | **R**egular | **F**lexible | 정기 모임 vs 자유 참여 |

**type_code:** 4글자 조합 (예: `ACHR`, `PSLF`) → **16유형**

---

## 3. 8대표 유형 (UI/마케팅용 그룹)

16유형 전체를 사용자에게 노출하되, **대표 8유형**을 주요 카드로 강조:

| 대표 유형 | type_code | 이모지 |
|-----------|-----------|--------|
| 활력 동행형 | ACHR | 🌿 |
| 활력 탐험형 | ACHF | 🌄 |
| 건강 루틴형 | ASHR | 🚶 |
| 건강 성장형 | ASLR | 📖 |
| 따뜻한 이야기형 | PCHR | ☕ |
| 따뜻한 교류형 | PCLF | 🎭 |
| 조용한 성장형 | PSLR | ✍️ |
| 조용한 탐구형 | PSLF | 🔍 |

나머지 8유형은 결과 페이지에서 동일 품질로 표시 (DB `type_definitions` 참고).

---

## 4. 12개 질문 (확정)

### Axis 1 — 활동 (Q1~Q3)

| # | 질문 | A (Active) | B (Peace) |
|---|------|------------|-------------|
| 1 | 휴일에 가장 하고 싶은 것은? | 새로운 곳을 방문하거나 여행하기 | 카페에서 대화하거나 조용히 쉬기 |
| 2 | 좋아하는 여가 시간은? | 걷기, 체험, 야외 활동 | 독서, TV, 조용한 취미 |
| 3 | 새로운 경험에 대한 생각은? | 새로운 것을 시도하는 것이 즐겁다 | 익숙하고 편안한 것이 좋다 |

### Axis 2 — 관계 (Q4~Q6)

| # | 질문 | A (Connect) | B (Small) |
|---|------|-------------|-----------|
| 4 | 새로운 사람을 만날 때 나는? | 먼저 인사하고 대화를 시작한다 | 상대방이 먼저 다가오길 기다린다 |
| 5 | 모임에서 선호하는 분위기는? | 여러 사람과 함께 활기차게 | 소수와 깊은 대화 |
| 6 | 친구 관계에서 중요한 것은? | 다양한 사람과의 넓은 관계 | 몇 명과의 깊은 관계 |

### Axis 3 — 관심 (Q7~Q9)

| # | 질문 | A (Health) | B (Learn) |
|---|------|------------|-----------|
| 7 | 요즘 관심 있는 것은? | 운동, 산책, 건강 관리 | 문화, 공부, 새로운 배움 |
| 8 | 시간을 보낼 때 더 끌리는 것은? | 몸을 움직이는 활동 | 머리를 쓰는 활동 |
| 9 | 관심 분야를 고른다면? | 건강, 운동, 웰니스 | 문화, 예술, 학습 |

### Axis 4 — 참여 (Q10~Q12)

| # | 질문 | A (Regular) | B (Flexible) |
|---|------|-------------|--------------|
| 10 | 모임 참여 방식은? | 정기적으로 같은 모임에 참여 | 가끔 새로운 모임에 참여 |
| 11 | 일정 관리 스타일은? | 규칙적인 루틴을 선호 | 그때그때 자유롭게 |
| 12 | 활동 참여 빈도는? | 매주 정기적으로 | 관심 있을 때 가끔 |

---

## 5. 점수 계산 방식

### Step 1: 축별 집계

각 축 3문항 → A/B 선택 수 카운트

```
예) Axis 1 (Activity):
  Q1=A, Q2=A, Q3=B → A=2, B=1 → Active 승
```

### Step 2: 축 결과 결정

- **2:1 또는 3:0** → 다수 쪽 letter
- **동점 (예: 1.5:1.5 불가, 1:1:1 불가)** → 실제로 3문항이므로 2:1 또는 3:0만 발생
- **1:1:1 불가** (3문항 중 홀수)

### Step 3: type_code 생성

```
type_code = Axis1 + Axis2 + Axis3 + Axis4
예: A + C + H + R = "ACHR"
```

### Step 4: score 저장 (0.0 ~ 1.0)

각 축에서 A-side 선택 비율:

```
activity_score      = A_count / 3        (A=1.0 쪽, P=0.0 쪽)
relationship_score  = C_count / 3
interest_score      = H_count / 3
participation_score = R_count / 3
```

### Step 5: DB 저장

```sql
UPDATE user_profiles SET
  type_code = 'ACHR',
  activity_score = 1.0,
  relationship_score = 1.0,
  interest_score = 1.0,
  participation_score = 1.0,
  test_completed_at = NOW()
WHERE id = :user_id;

INSERT INTO answers (user_id, question_id, selected_option) ...
```

---

## 6. 16유형 전체 정의

| code | title | emoji | 추천 키워드 |
|------|-------|-------|-------------|
| ACHR | 활력 동행형 | 🌿 | 산책, 등산, 여행, 건강챌린지 |
| ACHF | 활력 탐험형 | 🌄 | 근교 나들이, 체험, 등산 |
| ACLR | 활력 교류형 | 🎯 | 문화체험, 단체학습, 등산 |
| ACLF | 활력 발견형 | ✨ | 문화행사, 체험, 나들이 |
| ASHR | 건강 루틴형 | 🚶 | 걷기, 운동, 생활습관 |
| ASHF | 건강 여유형 | 🧘 | 산책, 요가, 힐링 |
| ASLR | 건강 성장형 | 📖 | 건강강좌, 운동클래스, 독서 |
| ASLF | 건강 자유형 | 🌱 | 가벼운 운동, 산책 |
| PCHR | 따뜻한 이야기형 | ☕ | 카페, 문화, 독서 |
| PCHF | 따뜻한 만남형 | 🤝 | 카페, 문화, 친목 |
| PCLR | 따뜻한 배움형 | 📚 | 독서, 강좌, 토론 |
| PCLF | 따뜻한 교류형 | 🎭 | 카페, 문화, 전시 |
| PSHR | 건강 동행형 | 🏃 | 걷기, 운동, 건강모임 |
| PSHF | 건강 여유 동행형 | 🌸 | 산책, 가벼운 운동 |
| PSLR | 조용한 성장형 | ✍️ | 글쓰기, 강좌, 독서 |
| PSLF | 조용한 탐구형 | 🔍 | 독서, 취미클래스 |

---

## 7. Rule-based 추천 알고리즘

### Input

```typescript
{
  type_code: "ACHR",
  region: "경기 하남",
  interests?: string[]  // Sprint 3+
}
```

### Step 1: type → categories

`type_category_rules` 테이블에서 priority 순 category 목록 조회

### Step 2: region 필터

```sql
SELECT * FROM meetups
WHERE is_active = true
  AND region ILIKE '%하남%'
  AND category IN (:categories)
ORDER BY scheduled_at ASC
LIMIT 5;
```

### Step 3: 결과 표시

```
🌿 활력 동행형입니다.

이번 주 추천:
1. 미사 호수공원 아침 산책 · 65세 4명 [참여하기]
2. 근교 나들이 친구 찾기 · 68세 5명 [참여하기]
```

### Fallback

- 지역 매칭 0건 → category만 매칭
- category 매칭 0건 → region 내 전체 active meetups
- 그래도 0건 → "곧 새로운 모임이 열립니다" empty state

---

## 8. KPI 연결

| KPI | 측정 |
|-----|------|
| 테스트 완료율 80% | `test_completed_at IS NOT NULL` / 가입자 |
| 추천 클릭률 50% | 결과→모임상세 click event |
| 추천 참여율 40% | participations / 추천 노출 |
| 재참여율 30% | 2회+ participation / 1회+ participation |

---

## 9. 구현 파일 (Sprint 2)

| 파일 | 역할 |
|------|------|
| `src/app/test/page.tsx` | 테스트 시작 |
| `src/app/test/[step]/page.tsx` | 문항 UI |
| `src/app/test/result/page.tsx` | 결과 + 추천 |
| `src/lib/ieum/scoring.ts` | 점수 계산 |
| `src/lib/ieum/recommend.ts` | Rule-based 추천 |
| `supabase/migrations/*` | questions, type_definitions seed ✅ |
