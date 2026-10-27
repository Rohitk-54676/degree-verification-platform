import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

const ROLE_ROUTES = {
  "/admin": "ADMIN",
  "/issuer": "UNIVERSITY",
  "/student": "STUDENT",
};

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

  for (const [prefix, requiredRole] of Object.entries(ROLE_ROUTES)) {
    if (pathname.startsWith(prefix) && session.user.role !== requiredRole) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};