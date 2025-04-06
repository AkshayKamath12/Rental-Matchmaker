import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isLoginPage = path === '/login';
  const isLoggedIn = () =>{
    const token = request.cookies.get('token')?.value || null;
    return token !== null;
  };

  if (!isLoginPage && !isLoggedIn) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|static).*)'],
};