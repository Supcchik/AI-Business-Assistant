import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for login and dev pages
  if (pathname === '/admin/login' || pathname === '/admin/dev') {
    return NextResponse.next();
  }
  
  // Simple password gate for other admin routes
  if (pathname.startsWith('/admin')) {
    const password = request.nextUrl.searchParams.get('pass');
    
    // For demo purposes, use 'demo123' as password
    // In production, this should be an environment variable
    if (password !== 'demo123') {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};
