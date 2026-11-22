import { NextRequest, NextResponse } from "next/server";
import { dashboardHome } from "./lib/roles";

type Role = "Customer" | "Owner" | "Admin";

function isRole(value: string | undefined): value is Role {
  return value === "Customer" || value === "Owner" || value === "Admin";
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("equiply_token")?.value;
  const roleCookie = request.cookies.get("equiply_role")?.value;
  const role = isRole(roleCookie) ? roleCookie : null;
  const isAuthed = Boolean(token && role);

  const needsAuth =
    pathname.startsWith("/dashboard")
    || pathname.startsWith("/payment")
    || /^\/equipment\/[^/]+$/.test(pathname);

  if (needsAuth && !isAuthed) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (!isAuthed || !role) return NextResponse.next();

  if ((pathname === "/login" || pathname === "/register") && isAuthed) {
    return NextResponse.redirect(new URL(dashboardHome(role), request.url));
  }

  if (pathname.startsWith("/dashboard/admin") && role !== "Admin") {
    return NextResponse.redirect(new URL(dashboardHome(role), request.url));
  }

  if (pathname.startsWith("/dashboard/owner") && role !== "Owner" && role !== "Admin") {
    return NextResponse.redirect(new URL(dashboardHome(role), request.url));
  }

  if (
    (pathname === "/dashboard" || pathname.startsWith("/dashboard/rentals") || pathname.startsWith("/dashboard/favorites"))
    && role !== "Customer"
  ) {
    return NextResponse.redirect(new URL(dashboardHome(role), request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/payment/:path*",
    "/equipment/:path*",
    "/login",
    "/register"
  ]
};
