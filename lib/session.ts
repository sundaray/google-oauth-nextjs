import "server-only";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { EncryptJWT, jwtDecrypt, base64url } from "jose";

const string = process.env.JWT_ENCRYPTION_KEY ?? "";
const secret = base64url.decode(string);

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

export async function createSession(
  userId: string,
  name: string,
  email: string,
  picture: string,
) {
  const session = await encrypt({ userId, name, email, picture });

  const cookieStore = await cookies();
  cookieStore.set("session", session, {
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
