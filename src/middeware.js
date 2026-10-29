import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

const ROLE_ROUTES = {
  "/admin": "ADMIN",
  "/issuer": "UNIVERSITY",
  "/student": "STUDENT",
};

// Routes accessible to ANY authenticated user (no specific role required)
const AUTHED_ONLY_ROUTES = ["/account", "/certificate"];

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  const isPublic =
    pathname === "/" ||
    pathname === "/login" ||
    pathname.startsWith("/verify") ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/api/verify") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon");

  if (isPublic) return NextResponse.next();

  if (!session) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Role-specific routes
  for (const [prefix, requiredRole] of Object.entries(ROLE_ROUTES)) {
    if (pathname.startsWith(prefix) && session.user.role !== requiredRole) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // Auth-only routes (any role can access)
  const isAuthedOnly = AUTHED_ONLY_ROUTES.some((p) => pathname.startsWith(p));
  if (isAuthedOnly) {
    return NextResponse.next();
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};