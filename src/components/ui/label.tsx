import type { LabelHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Label({
  className,
  children,
  ...props
}: LabelHTMLAttributes<HTMLLabelElement> & { children: ReactNode }) {
  return (
    <label
      className={cn("block text-xs font-medium uppercase tracking-wide text-muted", className)}
      {...props}
    >
      {children}
    </label>
  );
}
