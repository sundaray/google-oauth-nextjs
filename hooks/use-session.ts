import { useEffect, useState } from "react";

interface User {
  userId: string;
  name: string;
  email: string;
  picture: string;
}

interface SessionResponse {
  user: User | null;
}

export function useSession() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchSession() {
      try {
        const response = await fetch("/api/auth/session");

        if (!response.ok) {
          throw new Error("Failed to fetch session");
        }
        const data: SessionResponse = await response.json();
        setUser(data.user);
      } catch (error) {
        setError(error instanceof Error ? error : new Error("Unknown error"));
      } finally {
        setLoading(false);
      }
    }

    fetchSession();
  }, []);

  return { user, loading, error };
}
