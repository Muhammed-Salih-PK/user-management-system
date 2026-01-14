
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  // 1. Get the 'registered' cookie
  const isRegistered = request.cookies.get('registered');

  // 2. Define the path we want to protect
  const isDashboardPage = request.nextUrl.pathname.startsWith('/dashboard');

  // 3. If trying to access dashboard without the cookie, redirect to register
  if (isDashboardPage && !isRegistered) {
    return NextResponse.redirect(new URL('/register', request.url));
  }

  return NextResponse.next();
}

// Ensure middleware only runs on specific routes to save performance
export const config = {
  matcher: ['/dashboard/:path*'],
};