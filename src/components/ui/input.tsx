import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "w-full rounded-xl border border-border bg-surface-elevated/50 px-4 py-2.5 text-sm text-foreground placeholder:text-muted/70 transition focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/20",
        className,
      )}
      {...props}
    />
  );
}
