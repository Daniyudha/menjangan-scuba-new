import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Middleware sekarang hanya memeriksa 'cookie sinyal'
  const authSignal = request.cookies.get('auth-signal')?.value;
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/admin') && !authSignal) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (pathname.startsWith('/login') && authSignal) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/login'],
}