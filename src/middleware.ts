// middleware.js

import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const secret = process.env.AUTH_SECRET;
  const token = await getToken({ secret, req });

  // Paths that do not require authentication
  const publicPaths = ['/login', '/signup'];

  // Check if the user is authenticated
  if (token) {
    // User is authenticated, redirect to the dashboard if trying to access login or signup
    if (publicPaths.includes(req.nextUrl.pathname)) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  } else {
    // User is not authenticated
    if (
      !publicPaths.includes(req.nextUrl.pathname) &&
      req.nextUrl.pathname === '/dashboard'
    ) {
      // Redirect to login if trying to access dashboard without being authenticated
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  // Allow the request to proceed for other paths
  return NextResponse.next();
}

export const config = {
  matcher: ['/login', '/signup', '/dashboard'], // Adjust paths to apply middleware
};
