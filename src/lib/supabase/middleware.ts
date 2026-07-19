import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
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
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  const publicPaths = ["/", "/login", "/signup", "/privacy", "/auth/callback"];
  const isPublic = publicPaths.some(
    (p) => path === p || path.startsWith("/auth/"),
  );

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
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("onboarding_completed, test_completed_at, is_admin")
      .eq("id", user.id)
      .single();

    if (profile && !profile.onboarding_completed && path !== "/onboarding/profile") {
      const url = request.nextUrl.clone();
      url.pathname = "/onboarding/profile";
      return NextResponse.redirect(url);
    }

    if (
      profile?.onboarding_completed &&
      !profile.test_completed_at &&
      !path.startsWith("/test") &&
      path !== "/onboarding/profile"
    ) {
      const url = request.nextUrl.clone();
      url.pathname = "/test";
      return NextResponse.redirect(url);
    }

    if (path.startsWith("/admin") && !profile?.is_admin) {
      const url = request.nextUrl.clone();
      url.pathname = "/home";
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
