import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  variant?: "default" | "strong" | "ghost";
};

export function Card({ className, children, variant = "default", ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-card)] transition duration-300",
        variant === "strong" && "glass-panel-strong",
        variant === "default" && "glass-panel",
        variant === "ghost" && "border border-transparent bg-transparent",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return <div className={cn("mb-4 flex flex-col gap-1", className)}>{children}</div>;
}

export function CardTitle({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <h3 className={cn("text-base font-semibold tracking-tight text-foreground", className)}>
      {children}
    </h3>
  );
}

export function CardDescription({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return <p className={cn("text-sm text-muted leading-relaxed", className)}>{children}</p>;
}
