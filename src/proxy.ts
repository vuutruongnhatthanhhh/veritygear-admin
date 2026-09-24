import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
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
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
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

  // Fast-path role check from the JWT's app_metadata mirror — kept in sync
  // with profiles.role by every role-changing server action. The DB column
  // remains authoritative and is re-checked by requireAdmin()/requireStaff()
  // before any privileged mutation; this only gates page access.
  const role = user?.app_metadata?.role;
  const isStaff = role === "admin" || role === "mod";

  const { pathname } = request.nextUrl;
  const isAuthPage =
    pathname.startsWith("/login") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/reset-password");
  const isCallbackRoute = pathname.startsWith("/auth");

  if (!user && !isAuthPage && !isCallbackRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // A logged-in customer (or a staff account that was demoted) should never
  // reach the dashboard — sign them out so a stale session can't be reused.
  if (user && !isStaff && !isAuthPage && !isCallbackRoute) {
    await supabase.auth.signOut();
    const url = new URL("/login", request.url);
    url.searchParams.set("error", "unauthorized");
    return NextResponse.redirect(url, { headers: supabaseResponse.headers });
  }

  if (isStaff && isAuthPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (isStaff && !isAuthPage && !isCallbackRoute) {
    supabaseResponse.headers.set("Cache-Control", "no-store");
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
