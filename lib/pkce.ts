import { base64url } from "jose";

export function generateCodeVerifier() {
  const randomValues = new Uint8Array(32);
  crypto.getRandomValues(randomValues);
  return base64url.encode(randomValues);
}
