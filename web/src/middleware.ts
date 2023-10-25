import { NextRequest, NextResponse } from 'next/server'

export default function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value

  const signinURL = new URL('/signin', request.url)
  const homeURL = new URL('/', request.url)

  // User not authenticated
  if (!token) {
    if (request.nextUrl.pathname === '/signin') {
      return NextResponse.next()
    }

    if (request.nextUrl.pathname === '/register/user') {
      return NextResponse.next()
    }

    return NextResponse.redirect(signinURL)
  }

  // User authenticated
  if (request.nextUrl.pathname === '/signin') {
    return NextResponse.redirect(homeURL)
  }
}

// Router where middleware will be applied
export const config = {
  matcher: [
    '/',
    '/home',
    '/signin',
    '/register/:path*',
    '/meal/:path*',
    '/summary/:path*',
    '/update/:path*',
  ],
}
