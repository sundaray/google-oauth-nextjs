"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { google } from "@/lib/oauth2/auth";
import { generateState } from "@/lib/oauth2/utils";
import { generateCodeVerifier } from "@/lib/oauth2/pkce";
import { storeOAuthState } from "@/lib/session";

/************************************************
 * Sign in with Google
 ************************************************/

export async function signInWithGoogle(next: string) {
  const state = generateState();
  const codeVerifier = generateCodeVerifier();

  const url = await google.createAuthorizationURLWithPKCE(state, codeVerifier, [
    "openid",
    "email",
    "profile",
  ]);

  // Let's add some debug logs here
  console.log("Starting OAuth flow...");
  await storeOAuthState(state, codeVerifier, next);
  console.log("OAuth state stored, redirecting...");

  redirect(url.toString());
}

/************************************************
 * Sign out
 ************************************************/

export async function signOut() {
  (await cookies()).delete("session");
  redirect("/");
}
