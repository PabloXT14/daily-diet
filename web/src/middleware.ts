import { NextRequest, NextResponse } from 'next/server'

export default function middleware(request: NextRequest) {
  const token = request.cookies.get('sessionId')?.value

  const loginURL = new URL('/login', request.url)
  const homeURL = new URL('/', request.url)

  // User not authenticated
  if (!token) {
    if (request.nextUrl.pathname === '/login') {
      return NextResponse.next()
    }

    return NextResponse.redirect(loginURL)
  }

  // User authenticated
  if (request.nextUrl.pathname === '/login') {
    return NextResponse.redirect(homeURL)
  }
}

// Router where middleware will be applied
export const config = {
  matcher: [
    '/',
    '/home',
    '/login',
    '/register/:path*',
    '/meal/:path*',
    '/summary/:path*',
    '/update/:path*',
  ],
}
