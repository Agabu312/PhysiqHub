import Image from "next/image";
import Link from "next/link";
import type { AdCreative } from "@/config/ads.config";
import { cn } from "@/lib/cn";

const ACCENT_RING: Record<AdCreative["accentKey"], string> = {
  macros: "border-cat-macros/25 shadow-[0_0_42px_-22px_var(--color-cat-macros)]",
  water: "border-cat-hydration/25 shadow-[0_0_42px_-22px_var(--color-cat-hydration)]",
  neutral: "border-white/10 shadow-[0_0_42px_-24px_rgba(255,255,255,0.08)]",
};

const ACCENT_BG: Record<AdCreative["accentKey"], string> = {
  macros: "from-cat-macros/[0.10] via-transparent to-transparent",
  water: "from-cat-hydration/[0.10] via-transparent to-transparent",
  neutral: "from-white/[0.05] via-transparent to-transparent",
};

/**
 * Sponsored placement — config lives in src/config/ads.config.ts (local only).
 * Supports text, image, or video placements.
 */
export function AdSlot({
  creative,
  className,
}: {
  creative: AdCreative;
  className?: string;
}) {
  const hasImage = creative.mediaType === "image" && creative.mediaSrc;
  const hasVideo = creative.mediaType === "video" && creative.mediaSrc;

  return (
    <aside
      className={cn(
        "group relative overflow-hidden rounded-3xl border bg-surface-elevated/35 backdrop-blur-xl transition duration-300",
        "hover:-translate-y-0.5 hover:border-border-strong",
        ACCENT_RING[creative.accentKey],
        className,
      )}
      aria-label="Sponsored content"
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-0 bg-gradient-to-br opacity-100",
          ACCENT_BG[creative.accentKey],
        )}
        aria-hidden
      />
      <div className="pointer-events-none absolute -right-12 top-0 h-32 w-32 rounded-full bg-white/[0.03] blur-3xl" aria-hidden />

      <div
        className={cn(
          "relative z-10 grid gap-6 p-6 md:p-7",
          hasImage || hasVideo ? "lg:grid-cols-[1.15fr_0.85fr]" : "grid-cols-1",
        )}
      >
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-muted">Sponsored</p>
          <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-muted/90">
            {creative.brandName}
          </p>
          <h3 className="mt-2 text-xl font-semibold tracking-tight text-foreground">
            {creative.headline}
          </h3>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
            {creative.body}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Link
              href={creative.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-10 items-center justify-center rounded-full border border-border-strong bg-background/45 px-5 text-sm font-semibold text-foreground transition hover:bg-background/65"
            >
              {creative.ctaLabel}
            </Link>

            <span className="text-xs text-muted/80">
              Paid placement
            </span>
          </div>
        </div>

        {hasImage ? (
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-background/30">
            <div className="relative aspect-[16/10] w-full">
              <Image
                src={creative.mediaSrc!}
                alt={creative.mediaAlt || creative.headline}
                fill
                className="object-cover"
              />
            </div>
          </div>
        ) : null}

        {hasVideo ? (
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-background/30">
            <video
              src={creative.mediaSrc}
              controls
              playsInline
              className="aspect-[16/10] w-full object-cover"
            />
          </div>
        ) : null}
      </div>
    </aside>
  );
}