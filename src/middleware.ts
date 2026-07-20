import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  // 이메일 확인 링크가 /?code=... 로 올 때 callback으로 전달
  const code = request.nextUrl.searchParams.get("code");
  if (code && (request.nextUrl.pathname === "/" || request.nextUrl.pathname === "/login")) {
    const callback = request.nextUrl.clone();
    callback.pathname = "/auth/callback";
    if (!callback.searchParams.get("next")) {
      callback.searchParams.set("next", "/onboarding/profile");
    }
    return NextResponse.redirect(callback);
  }

  try {
    return await updateSession(request);
  } catch {
    return NextResponse.next({ request });
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
