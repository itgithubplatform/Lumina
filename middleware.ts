import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get user data from cookies/headers (you'll implement proper auth)
  const userRole = request.cookies.get('user-role')?.value;
  const accessibilityType = request.cookies.get('accessibility-type')?.value;
  
  // Public routes that don't need authentication
  const publicRoutes = ['/', '/auth/signin', '/auth/signup'];
  
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Redirect unauthenticated users to signin
  if (!userRole) {
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }

  // Teacher access control
  if (pathname.startsWith('/dashboard/teacher')) {
    if (userRole !== 'teacher') {
      return NextResponse.redirect(new URL('/dashboard/student', request.url));
    }
    return NextResponse.next();
  }

  // Student access control with accessibility routing
  if (pathname.startsWith('/dashboard/student')) {
    if (userRole !== 'student') {
      return NextResponse.redirect(new URL('/dashboard/teacher', request.url));
    }
    
    // Redirect students to their accessibility-specific repository
    if (pathname === '/dashboard/student') {
      switch (accessibilityType) {
        case 'hearing':
          return NextResponse.redirect(new URL('/repository/hearing', request.url));
        case 'visual':
          return NextResponse.redirect(new URL('/repository/visual', request.url));
        case 'cognitive':
          return NextResponse.redirect(new URL('/repository/cognitive', request.url));
        default:
          return NextResponse.redirect(new URL('/repository/general', request.url));
      }
    }
    return NextResponse.next();
  }

  // Repository access control
  if (pathname.startsWith('/repository/')) {
    if (userRole !== 'student') {
      return NextResponse.redirect(new URL('/dashboard/teacher', request.url));
    }
    
    // Students can only access their designated accessibility section
    const requestedSection = pathname.split('/')[2];
    if (accessibilityType && requestedSection !== accessibilityType && requestedSection !== 'general') {
      return NextResponse.redirect(new URL(`/repository/${accessibilityType}`, request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|logo.png).*)',
  ],
};