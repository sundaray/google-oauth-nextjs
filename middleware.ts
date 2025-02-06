import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { updateSession } from "./lib/session";
import { getCurrentSession } from "@/lib/get-current-session";

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const authRoutes = ["/signin"];
  const privateRoutes = ["/admin"];

  const { nextUrl } = request;
  const path = nextUrl.pathname;

  const { user } = await getCurrentSession();

  // Redirect unauthenticated users attempting to access private pages to the sign-in page
  if (!user && privateRoutes.includes(path)) {
    const signInUrl = new URL("/signin", nextUrl);
    signInUrl.searchParams.set("next", path);
    return NextResponse.redirect(signInUrl);
  }

  // Redirect authenticated users attempting to access the sign-in page to the home page
  if (user && path === "/signin") {
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  // Update session on GET requests ONLY since we can be sure
  // a new session wasn't set when handling the request
  if (request.method === "GET") {
    const response = NextResponse.next();
    const sessionToken = request.cookies.get("session")?.value ?? null;

    if (sessionToken) {
      const updatedSession = await updateSession(sessionToken);

      if (updatedSession) {
        response.cookies.set(
          "session",
          updatedSession.token,
          updatedSession.options,
        );
      }
    }

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip all static files and Next.js internals
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
};
