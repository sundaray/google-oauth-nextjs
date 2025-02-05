import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SignOut } from "@/components/sign-out";
import { getCurrentSession } from "@/lib/get-current-session";

export async function UserAccountNav() {
  const { user } = await getCurrentSession();

  if (!user) {
    return (
      <Link
        href="/signin"
        className={cn(
          buttonVariants({
            size: "sm",
          }),
          "h-8 rounded-full",
        )}
      >
        Sign in
      </Link>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src={user?.picture || undefined} />
          <AvatarFallback>
            {user?.email.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem className="cursor-pointer">
          <SignOut />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
