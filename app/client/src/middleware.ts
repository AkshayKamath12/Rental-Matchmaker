import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify, decodeJwt } from 'jose';



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
        const decodedToken = decodeJwt(token);
        const currentTime = Math.floor(Date.now() / 1000);
  
        if (decodedToken.exp && decodedToken.exp > currentTime) {
          return true;
        } else {
          return false;
        }
      } catch (error) {
        return false;
      }
}

export const config = {
  matcher: ['/((?!_next|static).*)'],
};