"use client";

import { useSession } from "@/hooks/use-session";
import { Icons } from "@/components/icons";

export default function ClientPage() {
  const { loading, error, user } = useSession();

  if (loading) {
    return (
      <div className="mx-auto flex w-fit items-center gap-2 px-4 text-center text-muted-foreground">
        <Icons.loader className="inline-block size-3.5 animate-spin" />
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 text-center">
        <h1 className="text-lg font-semibold text-red-600">
          Something Went Wrong
        </h1>
        <p className="mt-4 font-medium text-muted-foreground">
          This is a Client Component.
        </p>
      </div>
    );
  }
  return (
    <div className="px-4 text-center">
      <h1 className="text-xl font-bold">
        {user ? "User Authenticated" : "User Not Authenticated"}
      </h1>
      <p className="mt-2 text-sm">
        Email: {user ? user.email : "Not available"}
      </p>
      <p className="mt-4 text-sm font-medium text-muted-foreground">
        (This is a Client Component)
      </p>
    </div>
  );
}
