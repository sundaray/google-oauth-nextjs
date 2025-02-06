import Link from "next/link";

import { Icons } from "@/components/icons";
import { notFound } from "next/navigation";

export default async function RateLimitErrorPage() {
  return (
    <div className="mx-auto px-4 text-center">
      <h1 className="text-xl font-bold text-red-600">Rate Limit Error</h1>
      <p className="mt-2 text-sm text-secondary-foreground">
        Too many sign in attempts. Please try again later.
      </p>
      <div>
        <Link
          href="/signin"
          className="mt-4 inline-flex items-center gap-1 rounded bg-blue-50 px-2 py-1 text-sm font-semibold text-blue-500 hover:text-blue-600"
        >
          Return to sign in
          <Icons.arrowRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}
