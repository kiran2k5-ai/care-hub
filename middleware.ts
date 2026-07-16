import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://example.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "example-anon-key";

const protectedPrefixes = ["/patient", "/doctor", "/admin"];
const authRoutes = ["/login", "/signup"];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isProtected = protectedPrefixes.some((prefix) => pathname.startsWith(prefix));
  const isAuthRoute = authRoutes.includes(pathname);

  let response = NextResponse.next({ request });

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name) {
        return request.cookies.get(name)?.value;
      },
      set(name, value, options) {
        response = NextResponse.next({ request });
        response.cookies.set({ name, value, ...options });
      },
      remove(name, options) {
        response = NextResponse.next({ request });
        response.cookies.set({ name, value: "", ...options, maxAge: 0 });
      },
    },
  });

  const { data } = await supabase.auth.getUser();
  const user = data.user;

  if (!user && isProtected) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (user && isAuthRoute) {
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
    const role = profile?.role ?? (user.user_metadata?.role as string | undefined) ?? "patient";
    const redirectPath = role === "doctor" ? "/doctor/dashboard" : role === "admin" ? "/admin/dashboard" : "/patient/dashboard";
    return NextResponse.redirect(new URL(redirectPath, request.url));
  }

  return response;
}

export const config = {
  matcher: ["/patient/:path*", "/doctor/:path*", "/admin/:path*", "/login", "/signup"],
};
