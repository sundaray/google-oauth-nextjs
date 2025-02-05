import { getCurrentSession } from "@/lib/get-current-session";

export default async function AdminPage() {
  const { user } = await getCurrentSession();

  if (user && user?.role !== "admin") {
    return (
      <div className="px-4 text-center">
        <h1 className="text-lg font-semibold text-red-600">Access Denied</h1>
        <p className="mt-4 text-pretty font-medium text-muted-foreground">
          This page is only accessible to authenticated users having
          &quot;admin&quot; status.
        </p>
      </div>
    );
  }

  return (
    <div className="px-4 text-center">
      <h1 className="text-lg font-bold text-green-600">Welcome Admin</h1>
      <p className="mt-2 text-sm">Email: {user?.email}</p>
    </div>
  );
}
