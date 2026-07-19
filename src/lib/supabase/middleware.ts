import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key || url.includes("YOUR_PROJECT")) return null;
  return { url, key };
}

export async function updateSession(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const publicPaths = ["/", "/login", "/signup", "/privacy"];
  const isPublic =
    publicPaths.includes(path) || path.startsWith("/auth/");

  const env = getSupabaseEnv();
  if (!env) {
    // Supabase 미설정 시 public 페이지만 허용
    if (!isPublic) {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });

  try {
    const supabase = createServerClient(env.url, env.key, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user && !isPublic) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("next", path);
      return NextResponse.redirect(url);
    }

    if (user && (path === "/login" || path === "/signup")) {
      const url = request.nextUrl.clone();
      url.pathname = "/home";
      return NextResponse.redirect(url);
    }

    if (user && !isPublic && path !== "/onboarding/profile") {
      const { data: profile, error } = await supabase
        .from("user_profiles")
        .select("onboarding_completed, test_completed_at")
        .eq("id", user.id)
        .maybeSingle();

      if (!error && profile) {
        if (!profile.onboarding_completed) {
          const url = request.nextUrl.clone();
          url.pathname = "/onboarding/profile";
          return NextResponse.redirect(url);
        }

        if (
          profile.onboarding_completed &&
          !profile.test_completed_at &&
          !path.startsWith("/test")
        ) {
          const url = request.nextUrl.clone();
          url.pathname = "/test";
          return NextResponse.redirect(url);
        }
      }
    }

    return supabaseResponse;
  } catch {
    // Middleware 실패 시 public 페이지는 정상 표시
    if (isPublic) return NextResponse.next({ request });
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }
}
