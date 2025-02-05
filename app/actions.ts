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
