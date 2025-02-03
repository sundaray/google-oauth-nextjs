"use client";

import { useActionState } from "react";

import { Icons } from "@/components/icons";
import { signInWithGoogle } from "@/app/actions";
import { useSearchParams } from "next/navigation";

export function SignInGoogleForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/";

  const boundGoogleSignIn = signInWithGoogle.bind(null, next);

  const [formState, formAction, isPending] = useActionState(
    boundGoogleSignIn,
    undefined,
  );

  return (
    <form action={formAction} className="grid gap-2">
      {formState !== undefined && formState?.error && (
        <div className="text-pretty py-2 text-sm text-red-600">
          {formState?.message}
        </div>
      )}
      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-md border border-gray-300 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-100"
      >
        <Icons.google className="mr-2 inline-block size-5" />
        Sign in with Google
      </button>
    </form>
  );
}
