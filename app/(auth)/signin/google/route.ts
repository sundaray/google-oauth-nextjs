import { google } from "@/lib/oauth2/auth";
import { generateState } from "@/lib/oauth2/utils";
import { generateCodeVerifier } from "@/lib/oauth2/pkce";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const state = generateState();
  const codeVerifier = generateCodeVerifier();
  const url = await google.createAuthorizationURLWithPKCE(state, codeVerifier, [
    "openid",
    "profile",
  ]);

  const cookieStore = await cookies();

  cookieStore.set("google_oauth_state", state, {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 10, // 10 minutes
    sameSite: "lax",
  });

  cookieStore.set("google_code_verifier", codeVerifier, {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 10, // 10 minutes
    sameSite: "lax",
  });

  return NextResponse.redirect(url.toString());
}
