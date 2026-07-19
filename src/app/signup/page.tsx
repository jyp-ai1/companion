"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

function toKoreanAuthError(message: string) {
  if (message.includes("already registered") || message.includes("already been registered")) {
    return "이미 가입된 이메일입니다. 로그인해 주세요.";
  }
  if (message.includes("Password")) {
    return "비밀번호는 6자 이상이어야 합니다.";
  }
  if (message.includes("valid email")) {
    return "올바른 이메일 주소를 입력해 주세요.";
  }
  if (message.includes("rate limit")) {
    return "잠시 후 다시 시도해 주세요.";
  }
  return message;
}

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setInfo("");
    setLoading(true);

    try {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      if (!url || !key) {
        setError(
          "Supabase 연결 설정이 없습니다. Vercel → Settings → Environment Variables에 URL/Key를 추가한 뒤 Redeploy(재배포)해 주세요.",
        );
        return;
      }

      const supabase = createClient();
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            display_name: name.trim(),
            phone: phone.trim(),
          },
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/onboarding/profile`,
        },
      });

      if (signUpError) {
        setError(toKoreanAuthError(signUpError.message));
        return;
      }

      if (!data.user) {
        setError("가입에 실패했습니다. 다시 시도해 주세요.");
        return;
      }

      // 이메일 확인이 켜져 있으면 세션이 없음
      if (!data.session) {
        setInfo(
          "가입 확인 메일을 보냈습니다. 메일의 링크를 누른 후 로그인해 주세요. (테스트용: Supabase에서 이메일 확인을 끄면 바로 진행됩니다)",
        );
        return;
      }

      const { error: profileError } = await supabase.from("user_profiles").upsert(
        {
          id: data.user.id,
          display_name: name.trim(),
          phone: phone.trim(),
        },
        { onConflict: "id" },
      );

      if (profileError) {
        console.error(profileError);
        // 프로필 저장 실패해도 세션 있으면 진행
      }

      router.push("/onboarding/profile");
      router.refresh();
    } catch (err) {
      setError("네트워크 오류입니다. 인터넷 연결 후 다시 시도해 주세요.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col px-6 py-8">
      <Link href="/" className="mb-8 font-medium text-brand-600">
        ← 홈으로
      </Link>
      <Card className="mx-auto w-full max-w-md">
        <h1 className="mb-2 text-center">함께할 친구를 찾아볼까요?</h1>
        <p className="mb-8 text-center text-gray-600">
          가입부터 결과까지 약 3분이면 충분합니다.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Input
            label="이름"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="홍길동"
          />
          <Input
            label="휴대폰"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            placeholder="010-0000-0000"
          />
          <Input
            label="이메일"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="example@email.com"
          />
          <Input
            label="비밀번호"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            placeholder="6자 이상"
          />
          {error && (
            <p className="rounded-xl bg-red-50 p-3 text-red-700">{error}</p>
          )}
          {info && (
            <p className="rounded-xl bg-brand-50 p-3 text-brand-800">{info}</p>
          )}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "가입 중..." : "가입하기"}
          </Button>
        </form>
        <p className="mt-6 text-center text-gray-600">
          이미 계정이 있으신가요?{" "}
          <Link href="/login" className="font-semibold text-brand-600 underline">
            로그인
          </Link>
        </p>
        <p className="mt-4 text-center text-sm text-gray-500">
          <Link href="/privacy" className="underline">
            개인정보 처리방침
          </Link>
        </p>
      </Card>
    </div>
  );
}
