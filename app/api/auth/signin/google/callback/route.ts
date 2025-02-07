import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { google } from "@/lib/oauth2/auth";
import { decodeJwt, JWTPayload } from "jose";
import { v4 as uuidv4 } from "uuid";
import { createSession, decrypt } from "@/lib/session";
import { assignUserRole } from "@/lib/assign-user-role";
import { authRateLimit } from "@/lib/rate-limit";
import { createUser } from "@/lib/create-user";

interface GoogleJWTClaims extends JWTPayload {
  name: string;
  email: string;
  picture: string;
}

export async function GET(request: NextRequest) {
  const url = request.nextUrl;

  const clientIP = request.headers.get("x-forwarded-for") ?? "127.0.0.1";
  const rateLimitResult = await authRateLimit(clientIP);

  if (rateLimitResult.limited) {
    return NextResponse.redirect(new URL("/rate-limit-error", url));
  }

  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  const cookieStore = await cookies();
  const encryptedState = cookieStore.get("google_oauth_state")?.value ?? null;
  const encryptedCodeVerifier =
    cookieStore.get("google_code_verifier")?.value ?? null;
  const encryptedRedirect = cookieStore.get("redirect")?.value ?? null;

  const authErrorUrl = new URL("/auth-error", url);

  if (
    code === null ||
    state === null ||
    encryptedState === null ||
    encryptedCodeVerifier === null ||
    encryptedRedirect === null
  ) {
    return NextResponse.redirect(authErrorUrl);
  }

  // Decrypt our stored values
  const storedState = await decrypt(encryptedState);
  const codeVerifier = (await decrypt(encryptedCodeVerifier)) as string;
  const redirect = (await decrypt(encryptedRedirect)) as string;

  // Additional null check after decryption
  if (!storedState || !codeVerifier || !redirect) {
    return NextResponse.redirect(authErrorUrl);
  }

  // Now compare the decrypted state with the one from Google
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

  const claims = decodeJwt(data.id_token) as GoogleJWTClaims;

  const id = uuidv4();
  const name = claims.name;
  const email = claims.email;
  const picture = claims.picture;

  const role = assignUserRole(email);

  await createUser(id, name, email, role, picture);
  await createSession(id, name, email, role, picture);

  return NextResponse.redirect(new URL(redirect, url));
}
