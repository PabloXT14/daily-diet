import { NextRequest, NextResponse } from 'next/server'
import { decode } from 'jsonwebtoken'

export default async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value

  const signinURL = new URL('/signin', request.url)
  const homeURL = new URL('/', request.url)

  try {
    if (!token) throw new Error('JWT token missing')

    const decoded = decode(token)
    const currentTimeInSeconds = Math.floor(Date.now() / 1000)

    if (!decoded) throw new Error('Invalid JWT token')

    if (decoded.exp <= currentTimeInSeconds)
      throw new Error('JWT token expired')

    if (request.nextUrl.pathname === '/signin') {
      return NextResponse.redirect(homeURL)
    }
  } catch (error) {
    console.log(error)

    if (request.nextUrl.pathname === '/signin') {
      return NextResponse.next()
    }

    if (request.nextUrl.pathname === '/register/user') {
      return NextResponse.next()
    }

    return NextResponse.redirect(signinURL)
  }

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
