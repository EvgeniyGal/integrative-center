import { auth } from "@/auth";
import { NextResponse } from "next/server";

const publicAdminPaths = [
  "/admin/login",
  "/admin/accept-invite",
  "/admin/forgot-password",
  "/admin/reset-password",
];

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-pathname", pathname);

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next({
      request: { headers: requestHeaders },
    });
  }

  const isPublic = publicAdminPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );

  if (isPublic) {
    if (
      req.auth?.user?.status === "active" &&
      pathname === "/admin/login"
    ) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
    return NextResponse.next({
      request: { headers: requestHeaders },
    });
  }

  if (!req.auth?.user || req.auth.user.status !== "active") {
    const login = new URL("/admin/login", req.url);
    login.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(login);
  }

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
});

export const config = {
  matcher: ["/admin/:path*"],
};
