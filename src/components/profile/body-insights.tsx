"use client";

import type { LucideIcon } from "lucide-react";
import {
  Brain,
  ChevronRight,
  Droplets,
  Dumbbell,
  Gauge,
  PieChart,
  Ruler,
  Sparkles,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState, type CSSProperties } from "react";
import { Card } from "@/components/ui/card";
import { toolAccent } from "@/components/tool/tool-accent";
import { bodyFatCategory } from "@/lib/body-fat-navy";
import { cn } from "@/lib/cn";
import {
  categoryMicroSummary,
  journalMoodEnergyInsight,
  oneRepHighlights,
  pickWorkoutSplitHighlights,
  type InsightCategoryId,
  type ProfileInsightsBundle,
} from "@/lib/profile-insights-data";
import { goalLabel, scenarioForGoal } from "@/lib/nutrition";
import type { MacroResults, UserProfile, WaterDailyLog } from "@/lib/types";

const MAP_SRC = {
  male: ["/body-map-male.png", "/body-map-male.webp"] as const,
  female: ["/body-map-female.png", "/body-map-female.webp"] as const,
};

/** Neutral fallback: male asset first (single canonical silhouette if only one file exists). */
const FALLBACK_CHAIN = ["/body-map-male.png", "/body-map-male.webp", "/body-map-female.png", "/body-map-female.webp"] as const;

const ZONE_GLOW: Record<
  InsightCategoryId,
  { top: string; left: string; w: string; opacity: number; color: string }
> = {
  mood: { top: "8%", left: "50%", w: "min(62%, 240px)", opacity: 0.42, color: "rgba(74,222,128,0.55)" },
  nutrition: { top: "20%", left: "74%", w: "min(50%, 200px)", opacity: 0.38, color: "rgba(34,211,238,0.5)" },
  hydration: { top: "34%", left: "26%", w: "min(55%, 220px)", opacity: 0.36, color: "rgba(56,189,248,0.5)" },
  strength: { top: "38%", left: "76%", w: "min(48%, 190px)", opacity: 0.4, color: "rgba(249,115,22,0.5)" },
  split: { top: "70%", left: "24%", w: "min(52%, 210px)", opacity: 0.36, color: "rgba(192,132,252,0.5)" },
  composition: { top: "52%", left: "72%", w: "min(50%, 200px)", opacity: 0.38, color: "rgba(251,191,36,0.5)" },
};

type AnchorAlign = "left" | "right" | "center";

const CATEGORIES: {
  id: InsightCategoryId;
  title: string;
  shortLabel: string;
  accent: Parameters<typeof toolAccent>[0];
  icon: LucideIcon;
  anchor: { top: string; align: AnchorAlign; inset: string };
}[] = [
  {
    id: "mood",
    title: "Mood / Mindset",
    shortLabel: "Mindset",
    accent: "journal",
    icon: Brain,
    anchor: { top: "6%", align: "center", inset: "0" },
  },
  {
    id: "nutrition",
    title: "Nutrition / Calories",
    shortLabel: "Fuel",
    accent: "macros",
    icon: PieChart,
    anchor: { top: "16%", align: "right", inset: "2%" },
  },
  {
    id: "hydration",
    title: "Hydration",
    shortLabel: "Hydration",
    accent: "water",
    icon: Droplets,
    anchor: { top: "32%", align: "left", inset: "0%" },
  },
  {
    id: "strength",
    title: "Strength / 1RM",
    shortLabel: "Strength",
    accent: "oneRm",
    icon: Gauge,
    anchor: { top: "36%", align: "right", inset: "0%" },
  },
  {
    id: "split",
    title: "Workout split",
    shortLabel: "Split",
    accent: "split",
    icon: Dumbbell,
    anchor: { top: "66%", align: "left", inset: "2%" },
  },
  {
    id: "composition",
    title: "Body composition",
    shortLabel: "Composition",
    accent: "bodyFat",
    icon: Ruler,
    anchor: { top: "52%", align: "right", inset: "2%" },
  },
];

function useBodyMapSrc(gender: UserProfile["gender"] | null): {
  src: string;
  imageBroken: boolean;
  onImgError: () => void;
} {
  const primary = gender === "female" ? MAP_SRC.female : MAP_SRC.male;
  const [chain, setChain] = useState<string[]>(() => [...primary, ...FALLBACK_CHAIN]);
  const [idx, setIdx] = useState(0);
  const [broken, setBroken] = useState(false);

  useEffect(() => {
    const nextPrimary = gender === "female" ? MAP_SRC.female : MAP_SRC.male;
    setChain([...new Set([...nextPrimary, ...FALLBACK_CHAIN])]);
    setIdx(0);
    setBroken(false);
  }, [gender]);

  const onImgError = useCallback(() => {
    setIdx((i) => {
      const next = i + 1;
      if (next >= chain.length) {
        setBroken(true);
        return i;
      }
      return next;
    });
  }, [chain.length]);

  return { src: chain[idx] ?? chain[0], imageBroken: broken, onImgError };
}

function anchorPositionClass(align: AnchorAlign, inset: string): string {
  if (align === "center") return "left-1/2 -translate-x-1/2";
  if (align === "left") return cn("left-0", inset === "0%" ? "translate-x-0" : "");
  return cn("right-0", inset === "0%" ? "translate-x-0" : "");
}

function anchorInsetStyle(align: AnchorAlign, inset: string): CSSProperties | undefined {
  if (align === "left" && inset !== "0%") return { left: inset };
  if (align === "right" && inset !== "0%") return { right: inset };
  return undefined;
}

function ZoneAnchor({
  title,
  shortLabel,
  accent,
  icon: Icon,
  micro,
  active,
  dimmed,
  onSelect,
  onHover,
  onLeave,
  anchor,
}: {
  title: string;
  shortLabel: string;
  accent: Parameters<typeof toolAccent>[0];
  icon: LucideIcon;
  micro: string;
  active: boolean;
  dimmed: boolean;
  onSelect: () => void;
  onHover: () => void;
  onLeave: () => void;
  anchor: { top: string; align: AnchorAlign; inset: string };
}) {
  const a = toolAccent(accent);

  return (
    <button
      type="button"
      title={title}
      onClick={onSelect}
      onMouseEnter={onHover}
      onFocus={onHover}
      onMouseLeave={onLeave}
      onBlur={onLeave}
      style={{ top: anchor.top, ...anchorInsetStyle(anchor.align, anchor.inset) }}
      className={cn(
        "group absolute z-20 max-w-[min(46vw,200px)] motion-safe:transition-all motion-safe:duration-300",
        anchorPositionClass(anchor.align, anchor.inset),
        dimmed && "scale-[0.96] opacity-[0.38]",
        active && "z-30 scale-[1.02]",
      )}
    >
      <span
        className={cn(
          "pointer-events-none absolute h-px w-8 bg-gradient-to-r from-transparent opacity-0 motion-safe:transition-opacity motion-safe:duration-300 group-hover:opacity-100 group-focus-visible:opacity-100",
          anchor.align === "left" && "left-full ml-1 from-cat-macros/0 to-white/25",
          anchor.align === "right" && "right-full mr-1 from-white/25 to-transparent",
          anchor.align === "center" && "top-full left-1/2 mt-1 h-6 w-px -translate-x-1/2 bg-gradient-to-b from-white/20 to-transparent",
        )}
        aria-hidden
      />
      <span
        className={cn(
          "flex flex-col gap-0.5 rounded-2xl border px-2.5 py-2 text-left shadow-lg backdrop-blur-md motion-safe:transition-all motion-safe:duration-300",
          "hover:-translate-y-0.5 hover:shadow-xl",
          active
            ? cn(
                a.border,
                "bg-background/75 ring-2 ring-white/15",
                a.glow,
                "shadow-[0_0_40px_-12px_rgba(255,255,255,0.12)]",
              )
            : "border-white/10 bg-background/45 hover:border-white/18 hover:bg-background/60",
        )}
      >
        <span className="flex items-center gap-2">
          <span
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ring-1 ring-white/10 motion-safe:transition-transform motion-safe:duration-300",
              "group-hover:scale-105",
              active ? cn(a.soft, a.text) : "bg-surface-elevated/60 text-muted group-hover:text-foreground",
            )}
          >
            <Icon className="h-4 w-4" aria-hidden />
          </span>
          <span className="min-w-0">
            <span className={cn("block text-[11px] font-bold uppercase tracking-wide", active ? a.text : "text-foreground")}>
              {shortLabel}
            </span>
            <span
              className={cn(
                "text-[10px] leading-snug text-muted motion-safe:transition-all",
                active ? "line-clamp-3" : "line-clamp-2 group-hover:line-clamp-none",
              )}
            >
              {micro}
            </span>
          </span>
        </span>
      </span>
    </button>
  );
}

function MobileInsightStrip({
  summaries,
  active,
  setActive,
  setHovered,
}: {
  summaries: Record<InsightCategoryId, string>;
  active: InsightCategoryId | null;
  setActive: (id: InsightCategoryId | null) => void;
  setHovered: (id: InsightCategoryId | null) => void;
}) {
  return (
    <div className="relative lg:hidden">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-[color-mix(in_oklab,var(--color-surface-elevated)_70%,transparent)] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-[color-mix(in_oklab,var(--color-surface-elevated)_70%,transparent)] to-transparent" />
      <div className="flex snap-x snap-mandatory gap-2 overflow-x-auto pb-1 pt-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {CATEGORIES.map((c) => {
          const a = toolAccent(c.accent);
          const on = active === c.id;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => setActive(active === c.id ? null : c.id)}
              onMouseEnter={() => setHovered(c.id)}
              onMouseLeave={() => setHovered(null)}
              className={cn(
                "snap-center shrink-0 rounded-full border px-3 py-2 text-left motion-safe:transition-all motion-safe:duration-200",
                on
                  ? cn(a.border, a.soft, a.text, "shadow-md", a.glow)
                  : "border-border/60 bg-background/40 hover:border-border-strong hover:bg-background/55",
              )}
            >
              <span className="flex items-center gap-2">
                <c.icon className={cn("h-4 w-4 shrink-0", on ? a.text : "text-muted")} aria-hidden />
                <span className="max-w-[140px]">
                  <span className="block text-xs font-semibold text-foreground">{c.shortLabel}</span>
                  <span className="block truncate text-[10px] text-muted">{summaries[c.id]}</span>
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SignalDockEmpty({ onPick }: { onPick: (id: InsightCategoryId) => void }) {
  return (
    <div className="flex min-h-[280px] flex-col justify-center px-5 py-8 sm:px-7 lg:min-h-[min(72vh,640px)] lg:py-10">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-accent/20 via-accent-secondary/15 to-transparent ring-1 ring-white/10">
        <Sparkles className="h-7 w-7 text-accent" aria-hidden />
      </div>
      <h3 className="mt-5 text-center text-lg font-semibold tracking-tight text-foreground">Signal console</h3>
      <p className="mx-auto mt-2 max-w-[260px] text-center text-sm leading-relaxed text-muted">
        Choose a zone on the map—or a channel below—to stream live data from this device.
      </p>
      <div className="mx-auto mt-8 grid max-w-sm grid-cols-3 gap-2 sm:gap-3">
        {CATEGORIES.map((c) => {
          const a = toolAccent(c.accent);
          const Icon = c.icon;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => onPick(c.id)}
              className={cn(
                "flex flex-col items-center gap-2 rounded-2xl border border-border/50 bg-background/30 px-2 py-3 motion-safe:transition-all motion-safe:duration-200",
                "hover:-translate-y-0.5 hover:border-border-strong hover:bg-background/50",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/40",
              )}
            >
              <span className={cn("flex h-10 w-10 items-center justify-center rounded-xl ring-1 ring-white/10", a.soft)}>
                <Icon className={cn("h-5 w-5", a.text)} aria-hidden />
              </span>
              <span className="text-center text-[10px] font-semibold uppercase tracking-wide text-muted">{c.shortLabel}</span>
            </button>
          );
        })}
      </div>
      <p className="mt-8 text-center text-[11px] text-muted/90">Journal · macros · water · 1RM · splits · composition</p>
    </div>
  );
}

function EmptyHint({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="mt-4 inline-flex items-center gap-1 rounded-full border border-border-strong bg-surface-elevated/40 px-4 py-2 text-sm font-semibold text-accent transition hover:border-accent/40"
    >
      {label}
      <ChevronRight className="h-4 w-4" aria-hidden />
    </Link>
  );
}

function InsightPanelBody({
  active,
  profile,
  bundle,
  waterToday,
  macros,
  onClose,
}: {
  active: InsightCategoryId;
  profile: UserProfile;
  bundle: ProfileInsightsBundle;
  waterToday: WaterDailyLog | null;
  macros: MacroResults | null;
  onClose: () => void;
}) {
  const meta = CATEGORIES.find((c) => c.id === active)!;
  const a = toolAccent(meta.accent);
  const journal = journalMoodEnergyInsight(bundle.entries);
  const { recent: oneRepRecent, bestAverage } = oneRepHighlights(bundle.oneRepHistory);
  const { latest: splitLatest, labeled: splitLabeled } = pickWorkoutSplitHighlights(bundle.splits);
  const bf = bundle.bodyFat;

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div
        className={cn(
          "relative flex items-start justify-between gap-3 border-b border-white/[0.06] pb-4",
          "after:absolute after:bottom-0 after:left-0 after:h-px after:w-24 after:bg-gradient-to-r after:from-white/25 after:to-transparent",
        )}
      >
        <div className="min-w-0">
          <p className={cn("text-[10px] font-bold uppercase tracking-[0.2em]", a.text)}>Live channel</p>
          <h3 className="mt-1 text-lg font-semibold tracking-tight text-foreground">{meta.title}</h3>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 rounded-xl p-2 text-muted transition hover:bg-white/5 hover:text-foreground"
          aria-label="Close panel"
        >
          <X className="h-5 w-5" aria-hidden />
        </button>
      </div>

      <div className="mt-5 min-h-0 flex-1 space-y-5 overflow-y-auto overscroll-contain pr-1">
        {active === "mood" ? (
          <>
            {journal.hasData && journal.lastNAvg ? (
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full border border-cat-journal/35 bg-cat-journal/10 px-3 py-1 text-xs font-medium text-cat-journal">
                  Last window · mood {journal.lastNAvg.mood}/5
                </span>
                <span className="rounded-full border border-cat-journal/35 bg-cat-journal/10 px-3 py-1 text-xs font-medium text-cat-journal">
                  Energy {journal.lastNAvg.energy}/5
                </span>
              </div>
            ) : null}
            {journal.trendLabel ? (
              <p className="text-sm leading-relaxed text-muted">{journal.trendLabel}</p>
            ) : null}
            {journal.recent.length ? (
              <ul className="space-y-2">
                {journal.recent.slice(0, 5).map((e) => (
                  <li
                    key={e.id}
                    className="rounded-xl border border-border/60 bg-background/30 px-3 py-2.5 text-sm"
                  >
                    <span className="font-medium text-foreground">{e.date}</span>
                    <span className="ml-2 text-muted">
                      mood {e.mood}/5 · energy {e.energy}/5
                    </span>
                    {e.notes ? <p className="mt-1 line-clamp-2 text-xs text-muted">{e.notes}</p> : null}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="rounded-2xl border border-dashed border-cat-journal/35 bg-cat-journal/5 p-6 text-center">
                <p className="text-sm text-muted">No journal entries on this device yet.</p>
                <EmptyHint href="/tools/progress-journal" label="Log a check-in" />
              </div>
            )}
          </>
        ) : null}

        {active === "nutrition" ? (
          <>
            {macros ? (
              <>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full border border-cat-macros/35 bg-cat-macros/10 px-3 py-1 text-xs font-medium text-cat-macros">
                    BMR {macros.bmr} kcal
                  </span>
                  <span className="rounded-full border border-cat-macros/35 bg-cat-macros/10 px-3 py-1 text-xs font-medium text-cat-macros">
                    TDEE {macros.tdee} kcal
                  </span>
                </div>
                <p className="text-sm text-muted">
                  Goal: <span className="font-medium text-foreground">{goalLabel(profile.goal)}</span> — macro scenario
                  aligned to that goal below.
                </p>
                {(() => {
                  const s = scenarioForGoal(macros, profile.goal);
                  return (
                    <div className="rounded-2xl border border-border/70 bg-surface-elevated/30 p-4">
                      <p className="text-xs font-bold uppercase tracking-wider text-cat-macros">{s.label}</p>
                      <p className="mt-2 text-2xl font-semibold tabular-nums text-foreground">{s.calories} kcal</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <span className="rounded-lg bg-background/40 px-2 py-1 text-xs text-muted">
                          P {s.proteinG}g
                        </span>
                        <span className="rounded-lg bg-background/40 px-2 py-1 text-xs text-muted">
                          C {s.carbG}g
                        </span>
                        <span className="rounded-lg bg-background/40 px-2 py-1 text-xs text-muted">
                          F {s.fatG}g
                        </span>
                      </div>
                    </div>
                  );
                })()}
                <EmptyHint href="/tools/calorie-macro" label="Open calorie & macros" />
              </>
            ) : (
              <div className="rounded-2xl border border-dashed border-cat-macros/35 bg-cat-macros/5 p-6 text-center">
                <p className="text-sm text-muted">No macro run saved yet. The calculator can stamp results to storage.</p>
                <EmptyHint href="/tools/calorie-macro" label="Run calculator" />
              </div>
            )}
          </>
        ) : null}

        {active === "hydration" ? (
          <>
            {waterToday && waterToday.targetMl > 0 ? (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-cat-hydration/30 bg-cat-hydration/10 p-4">
                    <p className="text-[10px] font-bold uppercase text-cat-hydration">Target</p>
                    <p className="mt-1 text-xl font-semibold text-foreground">{waterToday.targetMl} ml</p>
                  </div>
                  <div className="rounded-2xl border border-cat-hydration/30 bg-cat-hydration/10 p-4">
                    <p className="text-[10px] font-bold uppercase text-cat-hydration">Logged</p>
                    <p className="mt-1 text-xl font-semibold text-foreground">{waterToday.consumedMl} ml</p>
                  </div>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-surface-elevated">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-sky-500 to-cyan-400 transition-all duration-500"
                    style={{
                      width: `${Math.min(100, Math.round((waterToday.consumedMl / waterToday.targetMl) * 100))}%`,
                    }}
                  />
                </div>
                <p className="text-sm text-muted">
                  Climate factor in tracker: <span className="text-foreground">{waterToday.climate}</span>
                </p>
                <EmptyHint href="/tools/water-intake" label="Update water log" />
              </>
            ) : (
              <div className="rounded-2xl border border-dashed border-cat-hydration/35 bg-cat-hydration/5 p-6 text-center">
                <p className="text-sm text-muted">No hydration target for today yet—open the tool once to initialize.</p>
                <EmptyHint href="/tools/water-intake" label="Water intake" />
              </div>
            )}
          </>
        ) : null}

        {active === "strength" ? (
          <>
            {oneRepRecent.length ? (
              <>
                {bestAverage ? (
                  <div className="rounded-2xl border border-cat-strength/35 bg-cat-strength/10 p-4">
                    <p className="text-[10px] font-bold uppercase text-cat-strength">Strongest saved estimate</p>
                    <p className="mt-1 text-lg font-semibold text-foreground">{bestAverage.entry.exerciseName}</p>
                    <p className="text-2xl font-bold tabular-nums text-cat-strength">
                      {bestAverage.value.toFixed(1)} kg
                    </p>
                    <p className="mt-1 text-xs text-muted">
                      From {bestAverage.entry.reps} reps @ {bestAverage.entry.weightKg} kg
                    </p>
                  </div>
                ) : null}
                <p className="text-xs font-bold uppercase tracking-wider text-muted">Recent saves</p>
                <ul className="space-y-2">
                  {oneRepRecent.map((e) => (
                    <li
                      key={e.id}
                      className="flex items-center justify-between gap-2 rounded-xl border border-border/60 bg-background/30 px-3 py-2 text-sm"
                    >
                      <span className="min-w-0 truncate font-medium text-foreground">{e.exerciseName}</span>
                      <span className="shrink-0 tabular-nums text-cat-strength">{e.average.toFixed(1)} kg</span>
                    </li>
                  ))}
                </ul>
                <EmptyHint href="/tools/one-rep-max" label="1RM calculator" />
              </>
            ) : (
              <div className="rounded-2xl border border-dashed border-cat-strength/35 bg-cat-strength/5 p-6 text-center">
                <p className="text-sm text-muted">No 1RM history on this device.</p>
                <EmptyHint href="/tools/one-rep-max" label="Save a lift" />
              </div>
            )}
          </>
        ) : null}

        {active === "split" ? (
          <>
            {splitLatest ? (
              <div className="space-y-4">
                <div className="rounded-2xl border border-cat-program/35 bg-cat-program/10 p-4">
                  <p className="text-[10px] font-bold uppercase text-cat-program">Latest saved split</p>
                  <p className="mt-1 font-semibold text-foreground">{splitLatest.title}</p>
                  <p className="mt-2 text-sm text-muted leading-relaxed">{splitLatest.summary}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="rounded-full bg-background/40 px-2.5 py-1 text-xs text-foreground">
                      {splitLatest.daysPerWeek} days / week
                    </span>
                    <span className="rounded-full bg-background/40 px-2.5 py-1 text-xs text-muted">
                      Saved {new Date(splitLatest.savedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                {splitLabeled && splitLabeled.id !== splitLatest.id ? (
                  <div className="rounded-xl border border-border/60 bg-surface-elevated/30 p-3">
                    <p className="text-[10px] font-bold uppercase text-muted">Labeled favorite</p>
                    <p className="mt-1 text-sm font-medium text-foreground">{splitLabeled.label}</p>
                    <p className="text-xs text-muted">{splitLabeled.title}</p>
                  </div>
                ) : splitLabeled?.label ? (
                  <p className="text-xs text-muted">
                    Label: <span className="text-foreground">{splitLabeled.label}</span>
                  </p>
                ) : null}
                <p className="text-xs text-muted">
                  Only splits you save in the tool persist locally—live previews are not stored.
                </p>
                <EmptyHint href="/tools/workout-split" label="Workout split tool" />
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-cat-program/35 bg-cat-program/5 p-6 text-center">
                <p className="text-sm text-muted">No saved workout split yet.</p>
                <EmptyHint href="/tools/workout-split" label="Generate & save" />
              </div>
            )}
          </>
        ) : null}

        {active === "composition" ? (
          <>
            {bf ? (
              <>
                {(() => {
                  const cat = bodyFatCategory(bf.gender, bf.bodyFatPercent);
                  return (
                    <div className="rounded-2xl border border-cat-composition/35 bg-cat-composition/10 p-4">
                      <p className="text-[10px] font-bold uppercase text-cat-composition">Latest Navy estimate</p>
                      <p className="mt-1 text-3xl font-bold tabular-nums text-foreground">
                        {bf.bodyFatPercent.toFixed(1)}%
                      </p>
                      <p className="mt-2 text-sm text-muted">
                        Lean {bf.leanMassKg.toFixed(1)} kg · Fat {bf.fatMassKg.toFixed(1)} kg
                      </p>
                      <p className="mt-2 text-xs font-medium text-cat-composition">{cat.label}</p>
                      <p className="mt-2 line-clamp-3 text-xs text-muted leading-relaxed">{cat.explanation}</p>
                    </div>
                  );
                })()}
                <EmptyHint href="/tools/body-fat" label="Re-run estimator" />
              </>
            ) : profile.bodyFatPercent != null && !Number.isNaN(profile.bodyFatPercent as number) ? (
              <div className="rounded-2xl border border-border/70 bg-surface-elevated/30 p-4">
                <p className="text-sm text-muted">Optional body fat % from profile settings (not a fresh measurement).</p>
                <p className="mt-2 text-2xl font-semibold text-foreground">~{profile.bodyFatPercent}%</p>
                <EmptyHint href="/tools/body-fat" label="Add Navy estimate" />
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-cat-composition/35 bg-cat-composition/5 p-6 text-center">
                <p className="text-sm text-muted">No composition estimate saved.</p>
                <EmptyHint href="/tools/body-fat" label="Body fat tool" />
              </div>
            )}
          </>
        ) : null}
      </div>
    </div>
  );
}

export function BodyInsightsCenterpiece({
  profile,
  bundle,
  waterToday,
  macros,
}: {
  profile: UserProfile;
  bundle: ProfileInsightsBundle;
  waterToday: WaterDailyLog | null;
  macros: MacroResults | null;
}) {
  const [active, setActive] = useState<InsightCategoryId | null>(null);
  const [hovered, setHovered] = useState<InsightCategoryId | null>(null);
  const highlight = active ?? hovered;
  const { src, imageBroken, onImgError } = useBodyMapSrc(profile.gender);

  const summaries = useMemo(() => {
    const out: Record<InsightCategoryId, string> = {} as Record<InsightCategoryId, string>;
    for (const c of CATEGORIES) {
      out[c.id] = categoryMicroSummary(c.id, bundle, waterToday, macros);
    }
    return out;
  }, [bundle, waterToday, macros]);

  const dockAccent = active ? toolAccent(CATEGORIES.find((c) => c.id === active)!.accent) : null;

  return (
    <Card
      variant="strong"
      className={cn(
        "relative overflow-hidden border-white/[0.08] p-0 shadow-[0_0_120px_-48px_rgba(167,139,250,0.35)]",
        "ring-1 ring-white/[0.04]",
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_50%_0%,rgba(45,212,191,0.09),transparent_55%),radial-gradient(ellipse_60%_50%_at_85%_40%,rgba(167,139,250,0.1),transparent),radial-gradient(ellipse_50%_45%_at_10%_60%,rgba(34,211,238,0.06),transparent)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_50%_at_50%_48%,transparent_35%,rgba(0,0,0,0.5)_100%)]"
        aria-hidden
      />

      <div className="relative z-10">
        <div className="flex flex-col gap-2 border-b border-white/[0.06] px-5 pb-5 pt-7 sm:px-8 sm:pt-9">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-accent-secondary/85">
                Body insights
              </p>
              <h2 className="mt-1.5 text-2xl font-semibold tracking-tight text-foreground sm:text-[1.65rem]">
                Signal map
              </h2>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">
                One silhouette, six channels—each tied to real data on this device.
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-black/25 px-3 py-1.5 text-[11px] text-muted backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-accent" aria-hidden />
              Local · private
            </span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-stretch">
          <div className="relative flex-1 px-4 pb-5 pt-2 sm:px-6 lg:pb-8 lg:pl-7 lg:pr-4 lg:pt-3">
            <div
              className={cn(
                "relative mx-auto overflow-visible rounded-[2rem] border border-white/[0.07] bg-gradient-to-b from-white/[0.06] via-transparent to-black/20 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] sm:p-4 lg:p-5",
                "motion-safe:animate-body-insight-reveal motion-reduce:animate-none",
              )}
            >
              <div
                className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-90"
                style={{
                  background:
                    "radial-gradient(ellipse 50% 40% at 50% 35%, rgba(45,212,191,0.07), transparent 60%), radial-gradient(ellipse 35% 30% at 70% 70%, rgba(167,139,250,0.08), transparent 55%)",
                }}
                aria-hidden
              />

              <div className="relative mx-auto aspect-[3/5.1] w-full max-w-[250px] sm:max-w-[300px] lg:max-w-[360px]">
                {highlight ? (
                  <>
                    <div
                      className="pointer-events-none absolute z-0 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[48px] motion-safe:transition-all motion-safe:duration-500"
                      style={{
                        top: ZONE_GLOW[highlight].top,
                        left: ZONE_GLOW[highlight].left,
                        width: ZONE_GLOW[highlight].w,
                        height: ZONE_GLOW[highlight].w,
                        opacity: ZONE_GLOW[highlight].opacity,
                        background: `radial-gradient(circle, ${ZONE_GLOW[highlight].color} 0%, transparent 72%)`,
                      }}
                      aria-hidden
                    />
                    <div
                      className="pointer-events-none absolute inset-[4%] z-[1] rounded-[1.5rem] ring-1 ring-inset ring-white/10 motion-safe:transition-opacity motion-safe:duration-500"
                      style={{
                        opacity: active ? 0.5 : 0.22,
                        boxShadow: `inset 0 0 32px -8px ${ZONE_GLOW[highlight].color}`,
                      }}
                      aria-hidden
                    />
                  </>
                ) : null}

                <div className="hidden lg:block">
                  {CATEGORIES.map((c) => {
                    const dimmed =
                      (active != null && active !== c.id && hovered == null) ||
                      (hovered != null && hovered !== c.id && active !== c.id);
                    return (
                      <ZoneAnchor
                        key={c.id}
                        title={c.title}
                        shortLabel={c.shortLabel}
                        accent={c.accent}
                        icon={c.icon}
                        micro={summaries[c.id]}
                        active={active === c.id}
                        dimmed={dimmed}
                        anchor={c.anchor}
                        onSelect={() => setActive((x) => (x === c.id ? null : c.id))}
                        onHover={() => setHovered(c.id)}
                        onLeave={() => setHovered(null)}
                      />
                    );
                  })}
                </div>

                <div className="relative z-10 flex h-full w-full items-center justify-center">
                  {!imageBroken ? (
                    <div className="relative h-full w-full drop-shadow-[0_12px_48px_rgba(45,212,191,0.12)]">
                      <Image
                        src={src}
                        alt="Body map for training insights"
                        fill
                        className="object-contain object-center motion-safe:transition-transform motion-safe:duration-700 motion-safe:ease-out"
                        sizes="(max-width: 640px) 90vw, (max-width: 1024px) 70vw, 360px"
                        priority
                        onError={onImgError}
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center rounded-[1.5rem] border border-dashed border-cyan-400/20 bg-gradient-to-b from-cyan-500/[0.08] to-violet-500/[0.06] p-6 text-center">
                      <Ruler className="h-10 w-10 text-cyan-400/55" aria-hidden />
                      <p className="mt-3 text-sm font-medium text-foreground">Body map assets</p>
                      <p className="mt-1 text-xs text-muted leading-relaxed">
                        Add <code className="text-cat-macros">body-map-male.png</code> and{" "}
                        <code className="text-cat-macros">body-map-female.png</code> (or .webp) under{" "}
                        <code className="text-cat-macros">public/</code>.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-5 sm:mt-6">
              <MobileInsightStrip
                summaries={summaries}
                active={active}
                setActive={setActive}
                setHovered={setHovered}
              />
            </div>
          </div>

          <div
            className={cn(
              "relative flex min-h-[320px] flex-col border-t border-white/[0.06] lg:min-h-0 lg:w-[min(100%,420px)] lg:shrink-0 lg:border-l lg:border-t-0",
              "bg-[color-mix(in_oklab,var(--color-background)_55%,transparent)] backdrop-blur-xl lg:bg-[color-mix(in_oklab,var(--color-background)_40%,transparent)]",
              dockAccent && "lg:border-l-transparent",
            )}
          >
            {dockAccent ? (
              <div
                className={cn(
                  "pointer-events-none absolute left-0 top-[12%] hidden h-[76%] w-1 rounded-full lg:block",
                  dockAccent.soft,
                  dockAccent.glow,
                )}
                aria-hidden
              />
            ) : null}

            <div className="relative flex min-h-0 flex-1 flex-col">
              {active ? (
                <div
                  key={active}
                  className={cn(
                    "flex min-h-0 flex-1 flex-col p-5 sm:p-7",
                    "motion-safe:animate-body-insight-reveal motion-reduce:animate-none",
                  )}
                >
                  <InsightPanelBody
                    active={active}
                    profile={profile}
                    bundle={bundle}
                    waterToday={waterToday}
                    macros={macros}
                    onClose={() => setActive(null)}
                  />
                </div>
              ) : (
                <SignalDockEmpty onPick={(id) => setActive(id)} />
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}