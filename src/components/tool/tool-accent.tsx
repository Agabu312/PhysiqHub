import type { ToolCategory } from "@/lib/types";
import { cn } from "@/lib/cn";

/** Maps tool categories to Tailwind classes backed by @theme colors in globals.css */
const ACCENT: Record<
  ToolCategory,
  { text: string; soft: string; border: string; glow: string }
> = {
  macros: {
    text: "text-cat-macros",
    soft: "bg-cat-macros/12",
    border: "border-cat-macros/35",
    glow: "shadow-[0_0_40px_-16px_var(--color-cat-macros)]",
  },
  water: {
    text: "text-cat-hydration",
    soft: "bg-cat-hydration/12",
    border: "border-cat-hydration/35",
    glow: "shadow-[0_0_40px_-16px_var(--color-cat-hydration)]",
  },
  journal: {
    text: "text-cat-journal",
    soft: "bg-cat-journal/12",
    border: "border-cat-journal/35",
    glow: "shadow-[0_0_40px_-16px_var(--color-cat-journal)]",
  },
  oneRm: {
    text: "text-cat-strength",
    soft: "bg-cat-strength/12",
    border: "border-cat-strength/35",
    glow: "shadow-[0_0_40px_-16px_var(--color-cat-strength)]",
  },
  split: {
    text: "text-cat-program",
    soft: "bg-cat-program/12",
    border: "border-cat-program/35",
    glow: "shadow-[0_0_40px_-16px_var(--color-cat-program)]",
  },
  bodyFat: {
    text: "text-cat-composition",
    soft: "bg-cat-composition/12",
    border: "border-cat-composition/35",
    glow: "shadow-[0_0_40px_-16px_var(--color-cat-composition)]",
  },
  settings: {
    text: "text-cat-settings",
    soft: "bg-cat-settings/12",
    border: "border-cat-settings/35",
    glow: "shadow-[0_0_36px_-18px_var(--color-cat-settings)]",
  },
  community: {
    text: "text-cat-community",
    soft: "bg-cat-community/12",
    border: "border-cat-community/35",
    glow: "shadow-[0_0_40px_-16px_var(--color-cat-community)]",
  },
  neutral: {
    text: "text-accent",
    soft: "bg-accent-soft",
    border: "border-accent/30",
    glow: "shadow-[0_0_40px_-16px_var(--color-accent)]",
  },
  profile: {
    text: "text-accent-secondary",
    soft: "bg-accent-secondary/12",
    border: "border-accent-secondary/35",
    glow: "shadow-[0_0_44px_-18px_rgba(167,139,250,0.45)]",
  },
};

export function toolAccent(category: ToolCategory) {
  return ACCENT[category] ?? ACCENT.neutral;
}

const HEADER_BADGE: Partial<Record<ToolCategory, string>> = {
  profile: "Profile",
  settings: "Settings",
  community: "Community",
  neutral: "Home",
};

export function ToolPageHeader({
  category,
  title,
  subtitle,
  className,
}: {
  category: ToolCategory;
  title: string;
  subtitle?: string;
  className?: string;
}) {
  const a = toolAccent(category);
  const badge = HEADER_BADGE[category] ?? "Tool";
  return (
    <div
      className={cn(
        "mb-8 border-b pb-6 transition-colors duration-300",
        a.border,
        "shadow-[0_24px_48px_-36px_color-mix(in_oklab,var(--color-border)_80%,transparent)]",
        className,
      )}
    >
      <span
        className={cn(
          "inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-widest shadow-sm",
          a.border,
          a.soft,
          a.text,
          a.glow,
        )}
      >
        {badge}
      </span>
      <h1 className="mt-4 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
        {title}
      </h1>
      {subtitle ? <p className="mt-2 max-w-2xl text-sm text-muted leading-relaxed">{subtitle}</p> : null}
    </div>
  );
}
