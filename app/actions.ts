"use server";

import { redirect } from "next/navigation";

/************************************************
 * Sign In With Google
 ************************************************/

export async function signInWithGoogle(next: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/signin/google`,
    { method: "GET", redirect: "manual" },
  );

  if (response.status === 307) {
    const redirectUrl = response.headers.get("location");
    if (redirectUrl) {
      redirect(redirectUrl);
    }
  }

  return {
    error: true,
    message: "Something went wrong. Please try signing in again.",
  };
}

/************************************************
 * Sign Out Handler
 ************************************************/
