import Link from "next/link";

import { Icons } from "@/components/icons";
import { notFound } from "next/navigation";

export default async function AuthError() {
  return (
    <div className="mx-auto max-w-lg px-4 text-center">
      <h1 className="mb-4 text-lg font-bold text-red-600">
        Sign-in Unsuccessful
      </h1>
      <p className="mb-2 text-sm text-secondary-foreground">Please try again</p>
      <div>
        <Link
          href="/signin"
          className="inline-flex items-center gap-1 text-sm font-semibold text-blue-500 hover:text-blue-600"
        >
          Return to sign in
          <Icons.arrowRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}
