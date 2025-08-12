import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Basic Auth middleware protecting /admin and write operations on /api/dashboard
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const protect =
    pathname.startsWith("/admin") ||
    (pathname.startsWith("/api/dashboard") && request.method !== "GET");

  if (!protect) return NextResponse.next();

  const user = process.env.ADMIN_BASIC_AUTH_USER;
  const pass = process.env.ADMIN_BASIC_AUTH_PASS;

  if (!user || !pass) return NextResponse.next(); // auth disabled if not configured

  const authHeader = request.headers.get("authorization") || "";
  const [scheme, encoded] = authHeader.split(" ");
  if (scheme !== "Basic" || !encoded) {
    return unauthorized();
  }

  const decoded = Buffer.from(encoded, "base64").toString();
  const [givenUser, givenPass] = decoded.split(":");

  if (givenUser === user && givenPass === pass) {
    return NextResponse.next();
  }

  return unauthorized();
}

function unauthorized() {
  return new NextResponse("Unauthorized", {
    status: 401,
    headers: { "WWW-Authenticate": "Basic realm=\"Secure Area\"" },
  });
}

export const config = {
  matcher: ["/admin/:path*", "/api/dashboard"],
};


