import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const authCookie = request.cookies.get("car-rental-auth")
  const { pathname } = request.nextUrl

  // Protected routes
  const isProtectedRoute = pathname.startsWith("/dashboard") || pathname.startsWith("/admin")
  const isAuthRoute = pathname.startsWith("/login") || pathname.startsWith("/register")

  if (isProtectedRoute && !authCookie) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  if (isAuthRoute && authCookie) {
    try {
      const user = JSON.parse(authCookie.value)
      if (user.role === "admin") {
        return NextResponse.redirect(new URL("/admin", request.url))
      }
      return NextResponse.redirect(new URL("/dashboard", request.url))
    } catch {
      // Invalid cookie, continue to auth page
    }
  }

  // Admin routes
  if (pathname.startsWith("/admin") && authCookie) {
    try {
      const user = JSON.parse(authCookie.value)
      if (user.role !== "admin") {
        return NextResponse.redirect(new URL("/dashboard", request.url))
      }
    } catch {
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/login", "/register"],
}
