import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
  align?: "left" | "center";
  action?: ReactNode;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  className,
  align = "left",
  action,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
        {eyebrow ? (
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent">{eyebrow}</p>
        ) : null}
        <h2 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">{title}</h2>
        {description ? (
          <p className="mt-2 text-muted leading-relaxed md:text-lg">{description}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
