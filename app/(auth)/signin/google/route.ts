import { google } from "@/lib/oauth2/auth";
import { generateState } from "@/lib/oauth2/utils";
import { generateCodeVerifier } from "@/lib/oauth2/pkce";
import { cookies } from "next/headers";

export async function GET(): Promise<Response> {
  const state = generateState();
  const codeVerifier = generateCodeVerifier();
  const url = google.createAuthorizationURLWithPKCE(state, codeVerifier, [
    "openid",
    "profile",
  ]);

  return new Response(null, {
    status: 302,
    headers: { Location: url.toString() },
  });
}
