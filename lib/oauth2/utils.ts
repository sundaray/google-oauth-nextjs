import { base64url } from "jose";

export function generateState(): string {
  const randomValues = new Uint8Array(32);
  crypto.getRandomValues(randomValues);
  return base64url.encode(randomValues);
}

export function encodeBasicCredentials(clientId: string, clientSecret: string) {
  const bytes = new TextEncoder().encode(`${clientId}:${clientSecret}`);
  return base64url.encode(bytes);
}
