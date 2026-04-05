import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary";

export function ButtonLink({
  href,
  children,
  className,
  variant = "primary",
}: {
  href: string;
  children: ReactNode;
  className?: string;
  variant?: Variant;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex min-h-10 items-center justify-center rounded-full px-6 py-2.5 text-sm font-semibold transition duration-200 active:scale-[0.98]",
        variant === "primary" &&
          "bg-accent text-background shadow-lg shadow-teal-500/20 hover:brightness-110",
        variant === "secondary" &&
          "border border-border-strong bg-surface-elevated/60 text-foreground hover:bg-surface-elevated",
        className,
      )}
    >
      {children}
    </Link>
  );
}
