# 배포 가이드 — jyp-ai1 (정식)

> **Production은 `jyp-ai1` Vercel 계정만 사용합니다.**  
> ~~truck-grease-reservation~~ 은 사용하지 않습니다.

---

## Production URL 확인

1. https://vercel.com → **jyp-ai1** (Hobby) 로그인
2. **companion** 프로젝트 클릭
3. **Deployments** → 맨 위 **Production** 옆 URL 복사  
   (예: `https://companion-xxxxx.vercel.app`)

---

## 환경변수 (jyp-ai1에 이미 설정됨)

| Key | Value |
|-----|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |

변경 후 **Deployments → Redeploy** 필수.

---

## 배포 방법 (GitHub 연동)

1. GitHub `jyp-ai1/companion` 에 push
2. jyp-ai1 Vercel이 자동 배포
3. 또는 Vercel Dashboard → **Deployments** → **Redeploy**

---

## Supabase URL 설정

**Authentication → URL Configuration**

- **Site URL**: jyp-ai1 Production URL
- **Redirect URLs**: `https://YOUR-URL.vercel.app/**`

---

## CLI 사용 시 주의

로컬 CLI가 `truck-grease-reservation`에 연결되어 있으면 **배포하지 마세요.**

```powershell
# 로컬 vercel 연결 해제됨 (.vercel 삭제)
# jyp-ai1에서만 GitHub 연동 배포 사용
```

---

## truck-grease-reservation 정리 (선택)

잘못 배포된 프로젝트 제거:

1. Vercel → **truck-grease-reservation** 팀 전환
2. **companion** 프로젝트 → **Settings** → 맨 아래 **Delete Project**

또는 CLI: `vercel project rm companion --scope truck-grease-reservation`
