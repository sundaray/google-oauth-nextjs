import { getCurrentSession } from "@/lib/get-current-session";

export default async function Server() {
  const { user } = await getCurrentSession();

  return (
    <div className="px-4 text-center">
      <h1 className="text-lg font-bold">
        {user ? "User Authenticated" : "User Not Authenticated"}
      </h1>
      <p className="mt-2 text-sm">Email: {user ? user.email : "N/A"}</p>
      <p className="mt-4 font-medium text-muted-foreground">
        This is a Server Component
      </p>
    </div>
  );
}
