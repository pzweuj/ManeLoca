import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 如果访问根路径，重定向到 /grch37
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/grch37', request.url))
  }

  // 如果访问的是无效的版本路径，重定向到 /grch37
  if (pathname.match(/^\/[^\/]+$/) && !pathname.match(/^\/(grch37|grch38)$/)) {
    return NextResponse.redirect(new URL('/grch37', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - data (data files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|data|icon).*)',
  ],
}
