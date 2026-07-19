# Vercel + Supabase 연결 가이드 (필수)

> 가입 시 "Supabase 환경변수" 오류가 나면 **이 문서대로** 설정하세요.

---

## 원인

배포된 Vercel 프로젝트 **`truck-grease-reservation/companion`** 에  
Supabase 환경변수가 **등록되어 있지 않습니다.**

환경변수 추가 후 **반드시 Redeploy** 해야 앱에 반영됩니다.

---

## 1단계: Supabase에서 값 복사

1. https://supabase.com → 프로젝트 선택
2. 왼쪽 **⚙️ Project Settings** → **API**
3. 아래 2개 복사 (메모장에 붙여넣기):

| 이름 | Supabase 화면 |
|------|---------------|
| `NEXT_PUBLIC_SUPABASE_URL` | **Project URL** (`https://xxxxx.supabase.co`) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | **anon public** 키 (eyJ... 로 시작) |

---

## 2단계: Vercel에 환경변수 추가

1. https://vercel.com 로그인
2. **truck-grease-reservation** 팀 → **companion** 프로젝트 클릭
3. 상단 **Settings** 탭
4. 왼쪽 **Environment Variables**
5. **Add Environment Variable** 클릭

**첫 번째 변수:**
- Key: `NEXT_PUBLIC_SUPABASE_URL`
- Value: (Supabase Project URL 붙여넣기)
- ✅ Production ✅ Preview ✅ Development 모두 체크
- **Save**

**두 번째 변수:**
- Key: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Value: (anon public 키 붙여넣기)
- ✅ Production ✅ Preview ✅ Development 모두 체크
- **Save**

---

## 3단계: 재배포 (필수!)

환경변수만 추가하고 재배포 안 하면 **오류 그대로**입니다.

1. 상단 **Deployments** 탭
2. 맨 위 배포 오른쪽 **⋯** (점 3개) 클릭
3. **Redeploy** 클릭
4. **Redeploy** 확인
5. **1~2분** 대기 → Status **Ready** 확인

---

## 4단계: 테스트

1. https://companion-sandy.vercel.app (Ctrl+Shift+R 새로고침)
2. **시작하기** → 가입
3. 오류 없이 **프로필 입력** 화면으로 이동하면 성공

---

## 자주 하는 실수

| 실수 | 결과 |
|------|------|
| 환경변수 추가 후 Redeploy 안 함 | 오류 계속 |
| 다른 Vercel 프로젝트에 추가 | 오류 계속 |
| service_role 키 사용 | 보안 위험 + 동작 오류 |
| Production만 체크 안 함 | Preview에서 오류 |

---

## 확인 방법

Vercel → Settings → Environment Variables 에  
아래 2개가 보이면 OK:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
