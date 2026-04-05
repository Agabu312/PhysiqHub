import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "danger";

const variants: Record<Variant, string> = {
  primary:
    "bg-accent text-background font-semibold shadow-lg shadow-teal-500/15 hover:brightness-110 active:scale-[0.98]",
  secondary:
    "border border-border-strong bg-surface-elevated/60 text-foreground hover:bg-surface-elevated hover:border-border-strong active:scale-[0.98]",
  ghost: "text-muted hover:text-foreground hover:bg-surface-elevated/80 active:scale-[0.98]",
  danger: "bg-red-500/15 text-danger border border-red-500/25 hover:bg-red-500/25 active:scale-[0.98]",
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  children: ReactNode;
};

export function Button({
  className,
  variant = "primary",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex min-h-10 items-center justify-center gap-2 rounded-full px-5 py-2 text-sm transition duration-200 disabled:pointer-events-none disabled:opacity-40",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
