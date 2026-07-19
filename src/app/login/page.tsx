"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (loginError) {
      setError(loginError.message);
      setLoading(false);
      return;
    }

    window.location.href = "/home";
  }

  return (
    <div className="flex flex-1 flex-col px-6 py-8">
      <Link href="/" className="mb-8 text-brand-600 font-medium">
        ← 홈으로
      </Link>
      <Card className="mx-auto w-full max-w-md">
        <h1 className="mb-8 text-center">다시 만나서 반가워요</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Input
            label="이메일"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label="비밀번호"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && (
            <p className="rounded-xl bg-red-50 p-3 text-red-700">{error}</p>
          )}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "로그인 중..." : "로그인"}
          </Button>
        </form>
        <p className="mt-6 text-center text-gray-600">
          계정이 없으신가요?{" "}
          <Link href="/signup" className="font-semibold text-brand-600 underline">
            가입하기
          </Link>
        </p>
      </Card>
    </div>
  );
}
