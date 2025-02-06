"use server";

import { redirect } from "next/navigation";
import { headers, cookies } from "next/headers";
import { google } from "@/lib/oauth2/auth";
import { generateState } from "@/lib/oauth2/utils";
import { generateCodeVerifier } from "@/lib/oauth2/pkce";
import { storeOAuthState } from "@/lib/session";
import { authRateLimit } from "@/lib/rate-limit";

/************************************************
 * Sign in with Google
 **************** ********************************/

export async function signInWithGoogle(next: string) {
  const headersList = await headers();
  const clientIP = (await headersList).get("x-forwarded-for") ?? "127.0.0.1";

  // check rate limit
  const rateLimitResult = await authRateLimit(clientIP);

  if (rateLimitResult.limited) {
    return {
      error: rateLimitResult.message,
      retryAfter: rateLimitResult.retryAfter,
    };
  }

  // Proceed with normal sign-in flow
  const state = generateState();
  const codeVerifier = generateCodeVerifier();

  const url = await google.createAuthorizationURLWithPKCE(state, codeVerifier, [
    "openid",
    "email",
    "profile",
  ]);

  await storeOAuthState(state, codeVerifier, next);

  redirect(url.toString());
}

/************************************************
 * Sign out
 ************************************************/

export async function signOut() {
  (await cookies()).delete("session");
  redirect("/");
}
