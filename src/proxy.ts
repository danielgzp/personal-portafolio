import createMiddleware from "next-intl/middleware"
import { routing } from "./lang/routing"
import { updateSession } from "./lib/supabase/middleware"
import { NextResponse, type NextRequest } from "next/server"

const ADMIN_PREFIX = "/d4sh-ctrl"
const ADMIN_LOGIN = `${ADMIN_PREFIX}/login`

const intlMiddleware = createMiddleware(routing)

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Admin routes: auth guard
  if (pathname.startsWith(ADMIN_PREFIX)) {
    const { user, supabaseResponse } = await updateSession(request)

    // Allow login page without auth
    if (pathname === ADMIN_LOGIN) {
      // If already authenticated, redirect to dashboard
      if (user) {
        const url = request.nextUrl.clone()
        url.pathname = ADMIN_PREFIX
        return NextResponse.redirect(url)
      }
      return supabaseResponse
    }

    // Protect all other admin routes
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = ADMIN_LOGIN
      return NextResponse.redirect(url)
    }

    return supabaseResponse
  }

  // Public routes: i18n
  return intlMiddleware(request)
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
}
