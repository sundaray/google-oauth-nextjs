import "server-only";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/session";

interface User {
  userId: string;
  name: string;
  email: string;
  picture: string;
}

interface SessionResult {
  user: User | null;
}

export async function getCurrentSession(): Promise<SessionResult> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session");

  if (!sessionCookie) {
    return { user: null };
  }

  const decryptedSession = await decrypt(sessionCookie.value);

  if (!decryptedSession) {
    return { user: null };
  }

  return { user: decryptedSession as unknown as User };
}
