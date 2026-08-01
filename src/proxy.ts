import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function proxy(request: NextRequest) {
  const token = request.cookies.get("token")?.value
  const { pathname } = request.nextUrl

  const isMaintenanceMode = process.env.NEXT_PUBLIC_MAINTERNANCE === "TRUE"

  if (isMaintenanceMode) {
    if (!request.nextUrl.pathname.startsWith("/maintenance")) {
      return NextResponse.redirect(new URL("/maintenance", request.url))
    }
  } else {
    if (request.nextUrl.pathname.startsWith("/maintenance")) {
      return NextResponse.redirect(new URL("/", request.url))
    }
  }

  // if (pathname.startsWith("/analysis/")) {
  //   return NextResponse.redirect(new URL("/dashboard", request.url))
  // }

  // Define public routes
  const isPublicRoute = pathname === "/"

  if (isPublicRoute) {
    // If user is on a public route (e.g., login page) and already has a token, redirect to dashboard
    if (token) {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
  } else {
    // If user is on a protected route and doesn't have a token, redirect to login
    if (!token) {
      return NextResponse.redirect(new URL("/", request.url))
    }
  }

  // Allow the request to proceed if no redirect conditions were met
  return NextResponse.next()
}

export const config = {
  // Match all request paths except for the ones starting with:
  // - api (API routes)
  // - _next/static (static files)
  // - _next/image (image optimization files)
  // - favicon.ico (favicon file)
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
