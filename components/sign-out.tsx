"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { signOut } from "@/app/actions";

export function SignOut() {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    try {
      setIsLoading(true);
      await signOut();
    } catch (error) {
      console.error("Unable to sign out:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button onClick={handleClick} variant="ghost" size="sm">
      {isLoading ? (
        <>
          <Icons.loader className="size-3.5 animate-spin text-muted-foreground" />
          Sign out
        </>
      ) : (
        "Sign out"
      )}
    </Button>
  );
}
