import { cn } from "@/lib/cn";

export function DashboardSectionHeading({
  eyebrow,
  title,
  description,
  className,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <div className={cn("scroll-mt-8", className)}>
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border/80 pb-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-accent/90">{eyebrow}</p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-foreground md:text-2xl">{title}</h2>
          {description ? (
            <p className="mt-2 max-w-2xl text-sm text-muted leading-relaxed">{description}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
