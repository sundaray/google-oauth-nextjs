import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { google } from "@/lib/oauth2/auth";

export async function GET(request: NextRequest) {
  const url = request.nextUrl;
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  const cookieStore = await cookies();
  const storedState = cookieStore.get("google_oauth_state")?.value ?? null;
  const codeVerifier = cookieStore.get("google_code_verifier")?.value ?? null;

  console.log("Cookie store: ", cookieStore);
  console.log("Authoriation code: ", code);
  console.log("State: ", state);
  console.log("Stored state: ", storedState);
  console.log("Code verifier: ", codeVerifier);

  const authErrorUrl = new URL("/auth-error", url);
  if (
    code === null ||
    state === null ||
    storedState === null ||
    codeVerifier === null
  ) {
    return NextResponse.redirect(authErrorUrl);
  }

  const response = await google.exchangeCodeForTokens(code, codeVerifier);

  console.log("Access Token Response Data: ", response);

  return NextResponse.redirect(new URL("/", url));
}
