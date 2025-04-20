import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decodeJwt } from 'jose';



export async function middleware(request: NextRequest) {
  const res = await checkAuth(request);
  console.log("Middleware executed for path:", request.nextUrl.pathname);
  if (res != null) {
    if (!res) {
      // User is not logged in, redirect to login
      if (request.nextUrl.pathname !== '/login') {
        return NextResponse.redirect(new URL('/login', request.url));
      }
    } else if (res === true) {
      // User is logged in, prevent access to /login
      if (request.nextUrl.pathname === '/login') {
        return NextResponse.redirect(new URL('/', request.url));
      }
    }
  }

  return NextResponse.next();
}

async function checkAuth(request: NextRequest){
  const path = request.nextUrl.pathname;
  const loggedIn = await isLoggedIn(request);
  console.log(loggedIn)
  if (!loggedIn) {
    console.log("Redirecting to login page");
    return false;
  }
  return true;
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
        console.error("Error decoding JWT:", error);
        return false;
      }
}


export const config = {
  matcher: ['/((?!_next|static).*)'],
};