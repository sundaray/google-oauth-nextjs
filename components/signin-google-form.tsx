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
    <form action={formAction} className="mx-auto grid max-w-[320px] gap-2">
      {formState !== undefined && formState.error && (
        <div className="text-pretty py-4 text-sm text-red-600">
          {formState.error}
        </div>
      )}
      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-md border border-input py-2 text-sm font-medium text-secondary-foreground shadow-sm transition-all hover:bg-accent active:scale-[0.98]"
      >
        <Icons.google className="mr-2 inline-block size-5" />
        Sign in with Google
      </button>
    </form>
  );
}
