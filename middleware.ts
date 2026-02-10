import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const secret = new TextEncoder().encode(process.env.JWT_SECRET)

  // 1. If user is on a protected route (like dashboard)
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!token) {
      return NextResponse.redirect(new URL('/signin', request.url))
    }
    try {
      await jwtVerify(token, secret)
      return NextResponse.next()
    } catch (error) {
      return NextResponse.redirect(new URL('/signin', request.url))
    }
  }

  // 2. If user is already logged in but tries to go to signin/signup
  if ((request.nextUrl.pathname === '/signin' || request.nextUrl.pathname === '/signup') && token) {
    try {
      await jwtVerify(token, secret)
      return NextResponse.redirect(new URL('/dashboard', request.url))
    } catch (error) {
      // Token invalid, let them stay on signin
    }
  }

  return NextResponse.next()
}

// Configure which paths the middleware runs on
export const config = {
  matcher: ['/dashboard/:path*', '/signin', '/signup'],
}