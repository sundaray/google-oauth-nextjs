import { base64url } from "jose";

export function generateCodeVerifier(): string {
  const randomValues = new Uint8Array(32);
  crypto.getRandomValues(randomValues);
  return base64url.encode(randomValues);
}

export async function generateS256CodeChallenge(
  codeverifier: string,
): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(codeverifier);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return base64url.encode(new Uint8Array(hash));
}
