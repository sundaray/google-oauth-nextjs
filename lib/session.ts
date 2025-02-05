import "server-only";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { EncryptJWT, jwtDecrypt, base64url } from "jose";

const key = process.env.JWT_ENCRYPTION_KEY ?? "";
const secret = base64url.decode(key);

export async function encrypt(payload: any) {
  return await new EncryptJWT(payload)
    .setProtectedHeader({ alg: "dir", enc: "A128CBC-HS256" })
    .setExpirationTime("1hr")
    .encrypt(secret);
}

export async function decrypt(jwt: string) {
  try {
    const { payload } = await jwtDecrypt(jwt, secret);
    return payload;
  } catch (error) {
    return null;
  }
}

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

  cookieStore.set("google_oauth_state", state, cookieOptions);
  cookieStore.set("google_code_verifier", codeVerifier, cookieOptions);
  cookieStore.set("redirect", redirect, cookieOptions);
}

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

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
  redirect("/");
}
