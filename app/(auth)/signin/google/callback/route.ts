import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { google } from "@/lib/oauth2/auth";
import { decodeJwt } from "jose";

export async function GET(request: NextRequest) {
  const url = request.nextUrl;
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  const cookieStore = await cookies();
  const storedState = cookieStore.get("google_oauth_state")?.value ?? null;
  const codeVerifier = cookieStore.get("google_code_verifier")?.value ?? null;
  const redirect = cookieStore.get("redirect")?.value ?? null;

  const authErrorUrl = new URL("/auth-error", url);

  if (
    code === null ||
    state === null ||
    storedState === null ||
    codeVerifier === null ||
    redirect === null
  ) {
    return NextResponse.redirect(authErrorUrl);
  }

  if (state !== storedState) {
    return NextResponse.redirect(authErrorUrl);
  }

  const { data, error } = await google.exchangeCodeForTokens(
    code,
    codeVerifier,
  );

  if (error) {
    return NextResponse.redirect(authErrorUrl);
  }

  const claims = decodeJwt(data.id_token);

  const name = claims.name;
  const email = claims.email;
  const picture = claims.picture;

  const user = createUser();

  return NextResponse.redirect(new URL(redirect, url));
}
