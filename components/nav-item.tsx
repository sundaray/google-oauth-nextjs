"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

type NavItemProps = {
  href: string;
  title: string;
};

export function NavItem({ href, title }: NavItemProps) {
  const pathname = usePathname();
  const isActive = href === pathname;

  return (
    <Link
      className={cn(
        "relative py-12 text-sm font-medium text-muted-foreground transition-colors hover:text-primary",
        isActive && "text-primary",
      )}
      href={href}
    >
      {title}
    </Link>
  );
}
