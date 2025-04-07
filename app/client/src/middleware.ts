import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isLoginPage = path === '/login';
  const loggedIn = await isLoggedIn(request); // Replace with actual login check logic

  if (!isLoginPage && !loggedIn) {
    console.log("Redirecting to login page");
    return NextResponse.redirect(new URL('/login', request.url));
  }
  return NextResponse.next();
}

async function isLoggedIn(request: NextRequest) {
    const token = request.cookies.get('jwt-token')?.value;
    if (!token) return false;
    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET); 
        await jwtVerify(token, secret);
        return true;
    } catch (error) {
        console.error('JWT verification failed:', error);
        return false;
    }
}

export const config = {
  matcher: ['/((?!_next|static).*)'],
};