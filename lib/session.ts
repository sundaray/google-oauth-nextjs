import "server-only";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { EncryptJWT, jwtDecrypt, base64url } from "jose";

const key = process.env.JWT_ENCRYPTION_KEY ?? "";
const secret = base64url.decode(key);

/************************************************
 * Encrypt payload
 ************************************************/

export async function encrypt(payload: any) {
  // If payload is a string, wrap it in an object
  const dataToEncrypt =
    typeof payload === "string" ? { value: payload } : payload;
  return await new EncryptJWT(dataToEncrypt)
    .setProtectedHeader({ alg: "dir", enc: "A128CBC-HS256" })
    .setExpirationTime("1hr")
    .encrypt(secret);
}

/************************************************
 * Decrypt payload
 ************************************************/

export async function decrypt(jwe: string) {
  try {
    const { payload } = await jwtDecrypt(jwe, secret);
    return "value" in payload ? payload.value : payload;
  } catch (error) {
    return null;
  }
}

/************************************************
 * Store OAuth state in cookies
 ************************************************/

export async function storeOAuthState(
  state: string,
  codeVerifier: string,
  redirect: string,
) {
  const cookieStore = await cookies();

  const cookieOptions = {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 10,
    sameSite: "lax",
  } as const;

  const encryptedState = await encrypt(state);
  const encryptedCodeVerifier = await encrypt(codeVerifier);
  const encryptedRedirect = await encrypt(redirect);

  cookieStore.set("google_oauth_state", encryptedState, cookieOptions);
  cookieStore.set("google_code_verifier", encryptedCodeVerifier, cookieOptions);
  cookieStore.set("redirect", encryptedRedirect, cookieOptions);
}

/************************************************
 * Create session
 ************************************************/

export async function createSession(
  userId: string,
  name: string,
  email: string,
  role: string,
  picture: string,
) {
  const encryptedUser = await encrypt({ userId, name, email, role, picture });

  const cookieStore = await cookies();
  cookieStore.set("session", encryptedUser, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60,
    sameSite: "lax",
    path: "/",
  });
}

/************************************************
 * Delete session
 ************************************************/

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
  redirect("/");
}
