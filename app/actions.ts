"use server";

import { redirect } from "next/navigation";

/************************************************
 * Sign In With Google
 ************************************************/

export async function signInWithGoogle(next: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/login/google`,
    { method: "GET" },
  );

  if (!response.ok) {
    return { error: true, message: "Something went wrong. Please try again." };
  }

  const location = response.headers.get("Location");

  if (!location) {
    return { error: true, message: "Something went wrong. Please try again." };
  }
  redirect(location);
}

/************************************************
 * Sign Out Handler
 ************************************************/
