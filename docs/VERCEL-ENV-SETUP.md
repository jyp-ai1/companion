# Vercel + Supabase 연결 가이드 (jyp-ai1)

> 환경변수는 **jyp-ai1 → companion** 프로젝트에 설정합니다.

---

## 1. Supabase 값 복사

Supabase → **Settings** → **API**

- `NEXT_PUBLIC_SUPABASE_URL` ← Project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` ← anon public

---

## 2. Vercel jyp-ai1에 설정

1. https://vercel.com → **jyp-ai1** (Hobby)
2. **companion** → **Settings** → **Environment Variables**
3. 위 2개 변수 (Production + Preview + Development)
4. **Save**

---

## 3. Redeploy

**Deployments** → **⋯** → **Redeploy** → 1~2분 대기

---

## 4. Supabase Auth URL

**Authentication → URL Configuration**

- Site URL = jyp-ai1 Production URL
- Redirect URLs = `https://YOUR-URL.vercel.app/**`

---

## 5. 테스트

jyp-ai1 Production URL 접속 → **시작하기** → 가입

---

## ⚠️ truck-grease-reservation 사용 금지

`companion-sandy.vercel.app` 은 잘못 연결된 팀 프로젝트입니다.  
**jyp-ai1 Production URL** 만 사용하세요.
