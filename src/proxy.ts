
import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export function proxy(request: NextRequest) {
  // Check whether a Better Auth session cookie exists
  const sessionCookie = getSessionCookie(request);

  // Redirect guests to the Login page
  if (!sessionCookie) {
    const loginURL = new URL("/login", request.url);

    // Preserve the requested dashboard page
    const returnTo =
      request.nextUrl.pathname +
      request.nextUrl.search;

    loginURL.searchParams.set("next", returnTo);

    return NextResponse.redirect(loginURL);
  }

  return NextResponse.next();
}

// Apply proxy to Dashboard and its nested pages
export const config = {
  matcher: ["/dashboard/:path*"],
};
