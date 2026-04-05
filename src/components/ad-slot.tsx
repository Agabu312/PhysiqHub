import Link from "next/link";
import type { AdCreative } from "@/config/ads.config";
import { cn } from "@/lib/cn";

const ACCENT_RING: Record<AdCreative["accentKey"], string> = {
  macros: "border-cat-macros/30 shadow-[0_0_36px_-18px_var(--color-cat-macros)]",
  water: "border-cat-hydration/30 shadow-[0_0_36px_-18px_var(--color-cat-hydration)]",
  neutral: "border-border-strong shadow-none",
};

/**
 * Sponsored placement — config lives in src/config/ads.config.ts (local only).
 */
export function AdSlot({
  creative,
  className,
}: {
  creative: AdCreative;
  className?: string;
}) {
  return (
    <aside
      className={cn(
        "rounded-2xl border glass-panel p-5 transition hover:border-border-strong",
        ACCENT_RING[creative.accentKey],
        className,
      )}
      aria-label="Sponsored content"
    >
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted">Sponsored</p>
      <p className="mt-2 text-xs font-semibold text-muted">{creative.brandName}</p>
      <h3 className="mt-1 text-base font-semibold text-foreground">{creative.headline}</h3>
      <p className="mt-2 text-sm text-muted leading-relaxed">{creative.body}</p>
      <Link
        href={creative.href}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex min-h-9 items-center justify-center rounded-full border border-border-strong bg-surface-elevated/60 px-4 text-sm font-medium text-foreground transition hover:bg-surface-elevated"
      >
        {creative.ctaLabel}
      </Link>
    </aside>
  );
}
