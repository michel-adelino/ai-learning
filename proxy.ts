import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that require authentication
const protectedRoutes = [
  "/dashboard",
  "/teacher",
  "/lessons",
];

// Routes only for teachers/admins
const teacherRoutes = [
  "/teacher",
];

// Routes that should redirect if already authenticated
const authRoutes = [
  "/auth/login",
  "/auth/signup",
];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authToken = request.cookies.get("xano_auth_token")?.value;

  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Check if it's an auth route
  const isAuthRoute = authRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Redirect to login if accessing protected route without auth
  if (isProtectedRoute && !authToken) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect to dashboard if accessing auth routes while logged in
  if (isAuthRoute && authToken) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // For teacher routes, we can't check role in middleware (requires API call)
  // Role check is done on the page level instead

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all routes except static files and api
    "/((?!_next/static|_next/image|favicon.ico|api|.*\\.).*)",
  ],
};
