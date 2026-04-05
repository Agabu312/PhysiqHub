"use client";

import type { ComponentType } from "react";
import {
  Activity,
  ArrowRight,
  BookOpen,
  Dumbbell,
  Droplets,
  Dumbbell as CoachIcon,
  Gauge,
  LineChart,
  MessageSquareHeart,
  PieChart,
  Quote,
  Ruler,
  Sparkles,
  Target,
  UserRound,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AdSlot } from "@/components/ad-slot";
import { CelebrationToast } from "@/components/dashboard/celebration-toast";
import { StatCard } from "@/components/dashboard/stat-card";
import { toolAccent } from "@/components/tool/tool-accent";
import { Card } from "@/components/ui/card";
import { dashboardAd } from "@/config/ads.config";
import { adaptiveSuggestion, readinessFromJournal, weeklyWeightDeltaKg } from "@/lib/insights";
import { cn } from "@/lib/cn";
import { getDailyMotivationCompanion, getDailyMotivationLine } from "@/lib/motivation";
import { computeMacroResults, goalLabel } from "@/lib/nutrition";
import { loadProfileFromStorage } from "@/lib/profile";
import { loadJournalEntries, sortEntriesByDateDesc } from "@/lib/journal-storage";
import { getItem, STORAGE_KEYS } from "@/lib/storage";
import type {
  Climate,
  JournalEntry,
  MacroResults,
  ToolCategory,
  UserProfile,
  WaterDailyLog,
} from "@/lib/types";
import { localDateKey, waterTargetMl } from "@/lib/water";

const quickActions: {
  href: string;
  title: string;
  icon: ComponentType<{ className?: string }>;
  category: ToolCategory;
}[] = [
  { href: "/tools/calorie-macro", title: "Calories & macros", icon: PieChart, category: "macros" },
  { href: "/tools/water-intake", title: "Water", icon: Droplets, category: "water" },
  { href: "/tools/progress-journal", title: "Journal", icon: LineChart, category: "journal" },
  { href: "/tools/one-rep-max", title: "1RM", icon: Gauge, category: "oneRm" },
  { href: "/tools/workout-split", title: "Split", icon: Dumbbell, category: "split" },
  { href: "/tools/body-fat", title: "Body fat", icon: Ruler, category: "bodyFat" },
];

function parseMacroResults(raw: string | null): MacroResults | null {
  if (!raw) return null;
  try {
    const o = JSON.parse(raw) as MacroResults;
    if (typeof o.bmr === "number" && typeof o.tdee === "number") return o;
    return null;
  } catch {
    return null;
  }
}

function parseWaterLog(raw: string | null): WaterDailyLog | null {
  if (!raw) return null;
  try {
    const o = JSON.parse(raw) as WaterDailyLog;
    if (typeof o.date === "string" && typeof o.targetMl === "number") return o;
    return null;
  } catch {
    return null;
  }
}

function humanizeActivity(level: UserProfile["activityLevel"]): string {
  return level.replace(/_/g, " ");
}

function humanizeTraining(exp: UserProfile["trainingExperience"]): string {
  return exp.charAt(0).toUpperCase() + exp.slice(1);
}

function homeSummary(profile: UserProfile | null): string {
  if (!profile) {
    return "Finish onboarding once and this space becomes a calm command center—targets, tools, and signals in one glance.";
  }
  const g = goalLabel(profile.goal).toLowerCase();
  return `You’re training toward ${g}, with ${humanizeActivity(profile.activityLevel)} day-to-day movement and ${humanizeTraining(profile.trainingExperience).toLowerCase()} lifting experience—use the quick actions below when you’re ready to work.`;
}

export function DashboardClient() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [macros, setMacros] = useState<MacroResults | null>(null);
  const [water, setWater] = useState<WaterDailyLog | null>(null);
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [now, setNow] = useState<string>("");
  const [climate, setClimate] = useState<Climate>("temperate");

  useEffect(() => {
    setProfile(loadProfileFromStorage());
    setMacros(parseMacroResults(getItem(STORAGE_KEYS.macroResults)));
    setWater(parseWaterLog(getItem(STORAGE_KEYS.waterDaily)));
    setEntries(sortEntriesByDateDesc(loadJournalEntries()));
    setNow(localDateKey());
    const cRaw = getItem(STORAGE_KEYS.waterClimate);
    if (cRaw === "hot" || cRaw === "cold" || cRaw === "temperate") setClimate(cRaw);
  }, []);

  const macroFresh = useMemo(() => {
    if (!profile) return null;
    return computeMacroResults(profile);
  }, [profile]);

  const displayMacros = macros ?? macroFresh;

  const waterToday = useMemo(() => {
    if (!profile) return null;
    const target = waterTargetMl(profile, climate);
    const today = localDateKey();
    const log = water;
    if (!log || log.date !== today) {
      return { date: today, targetMl: target, consumedMl: 0, climate } satisfies WaterDailyLog;
    }
    if (log.targetMl !== target) {
      return { ...log, targetMl: target };
    }
    return log;
  }, [profile, water, climate]);

  const readiness = useMemo(() => readinessFromJournal(entries), [entries]);
  const suggestion = useMemo(
    () => adaptiveSuggestion({ profile, water: waterToday, entries }),
    [profile, waterToday, entries],
  );

  const weeklyDelta = useMemo(() => weeklyWeightDeltaKg(entries), [entries]);
  const latestEntry = entries[0];

  const date = useMemo(() => new Date(), []);
  const dailyLine = useMemo(() => getDailyMotivationLine(date), [date]);
  const dailyCompanion = useMemo(() => getDailyMotivationCompanion(date), [date]);
  const dashAccent = toolAccent("neutral");

  const displayName =
    profile?.displayName?.trim() ||
    (profile ? "Athlete" : null);

  const summary = useMemo(() => homeSummary(profile), [profile]);

  return (
    <div className="w-full space-y-14 pb-8 sm:space-y-16 lg:space-y-20">
      <CelebrationToast />

      <section className="relative -mx-4 overflow-hidden rounded-3xl border border-border-strong/80 bg-surface-elevated/30 px-4 py-10 shadow-[0_0_120px_-48px_var(--color-accent-glow)] sm:-mx-6 sm:px-8 sm:py-12 lg:-mx-10 lg:px-12 lg:py-14 xl:-mx-14">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_20%_0%,rgba(45,212,191,0.14),transparent),radial-gradient(ellipse_50%_45%_at_100%_20%,rgba(167,139,250,0.12),transparent)]"
          aria-hidden
        />
        <div className="pointer-events-none absolute -right-32 top-0 h-72 w-72 rounded-full bg-accent/10 blur-3xl" aria-hidden />
        <div className="relative grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="space-y-8 lg:col-span-7 xl:col-span-6">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-widest",
                  dashAccent.border,
                  dashAccent.soft,
                  dashAccent.text,
                )}
              >
                <Zap className="h-3 w-3" aria-hidden />
                Today
              </span>
              <span className="rounded-full border border-border bg-background/30 px-3 py-1 text-xs font-medium text-muted backdrop-blur-sm">
                {now || "—"}
              </span>
            </div>

            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-[2.75rem] lg:leading-[1.08]">
                {profile ? (
                  <>
                    <span className="text-muted">Hey </span>
                    <span className="bg-gradient-to-r from-foreground via-foreground to-accent-secondary bg-clip-text text-transparent">
                      {displayName}
                    </span>
                  </>
                ) : (
                  "Welcome in"
                )}
              </h1>
              <p className="mt-4 max-w-xl text-base text-muted leading-relaxed sm:text-[1.05rem]">
                {summary}
              </p>
            </div>

            {profile ? (
              <div className="flex flex-wrap gap-2">
                <HeroChip icon={Target} label="Goal" value={goalLabel(profile.goal)} accent="macros" />
                <HeroChip
                  icon={Activity}
                  label="Activity"
                  value={humanizeActivity(profile.activityLevel)}
                  accent="water"
                />
                <HeroChip
                  icon={Sparkles}
                  label="Training"
                  value={humanizeTraining(profile.trainingExperience)}
                  accent="split"
                />
              </div>
            ) : (
              <Link
                href="/onboarding"
                className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-5 py-2.5 text-sm font-semibold text-accent transition hover:bg-accent/15 active:scale-[0.98]"
              >
                Complete onboarding
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <Card
                className={cn(
                  "relative overflow-hidden p-5 transition duration-300",
                  "border-violet-500/25 bg-gradient-to-br from-violet-500/[0.07] to-transparent",
                  "hover:-translate-y-0.5 hover:shadow-[0_0_52px_-24px_rgba(167,139,250,0.4)]",
                )}
              >
                <div className="flex items-start gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-violet-500/15 text-violet-200 ring-1 ring-violet-400/25">
                    <Target className="h-5 w-5" aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-violet-200/90">
                      Today’s focus
                    </p>
                    <p className="mt-1 text-lg font-semibold leading-snug text-foreground">
                      {suggestion.title}
                    </p>
                    <p className="mt-2 text-sm text-muted leading-relaxed">{suggestion.body}</p>
                  </div>
                </div>
              </Card>
              <Card
                className={cn(
                  "relative overflow-hidden p-5 transition duration-300",
                  "border-emerald-500/20 bg-gradient-to-br from-emerald-500/[0.06] to-transparent",
                  "hover:-translate-y-0.5 hover:shadow-[0_0_48px_-26px_rgba(74,222,128,0.35)]",
                )}
              >
                <div className="flex items-start gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-cat-journal/15 text-cat-journal ring-1 ring-cat-journal/20">
                    <Activity className="h-5 w-5" aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-cat-journal/90">
                      Readiness
                    </p>
                    <p
                      className={cn(
                        "mt-1 text-lg font-semibold tracking-tight",
                        readiness.status === "recover" && "text-amber-200",
                        readiness.status === "maintain" && "text-foreground",
                        readiness.status === "push" && "text-emerald-200",
                      )}
                    >
                      {readiness.title}
                    </p>
                    <p className="mt-2 text-sm text-muted leading-relaxed">{readiness.detail}</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <div className="flex flex-col justify-end gap-4 lg:col-span-5 xl:col-span-6">
            <Link href="/coach" className="group block animate-fade-up">
              <Card
                className={cn(
                  "relative overflow-hidden p-5 transition duration-300",
                  "border-accent-secondary/25 bg-gradient-to-br from-accent-secondary/[0.10] via-accent/[0.05] to-transparent",
                  "hover:-translate-y-1 hover:border-accent-secondary/45",
                  "hover:shadow-[0_0_60px_-26px_rgba(167,139,250,0.35)]",
                )}
              >
                <div className="pointer-events-none absolute right-0 top-0 h-24 w-24 rounded-full bg-accent-secondary/10 blur-2xl" aria-hidden />
                <div className="relative flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent-secondary/85">
                      Coach
                    </p>
                    <h3 className="mt-2 text-lg font-semibold text-foreground">Ask Coach</h3>
                    <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">
                      Get smart guidance based on your saved profile, hydration, journal trends, and recent calculator data.
                    </p>
                    <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-accent-secondary transition group-hover:text-violet-200">
                      Open coach
                      <ArrowRight className="h-4 w-4" aria-hidden />
                    </span>
                  </div>
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent-secondary/15 text-accent-secondary ring-1 ring-white/10">
                    <MessageSquareHeart className="h-6 w-6" aria-hidden />
                  </span>
                </div>
              </Card>
            </Link>

            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted">Quick actions</p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
              {quickActions.map((q, i) => {
                const Icon = q.icon;
                const a = toolAccent(q.category);
                return (
                  <Link
                    key={q.href}
                    href={q.href}
                    className={cn("group block animate-fade-up")}
                    style={{ animationDelay: `${i * 45}ms` }}
                  >
                    <Card
                      className={cn(
                        "flex h-full flex-col items-start gap-3 p-4 transition duration-300",
                        "border-border-strong/60 bg-background/20 backdrop-blur-sm",
                        "hover:-translate-y-1 hover:border-border-strong",
                        a.border,
                        "hover:shadow-[0_20px_50px_-28px_rgba(0,0,0,0.85)]",
                        a.glow,
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-xl ring-1 ring-white/5 transition duration-200 group-hover:scale-105",
                          a.soft,
                          a.text,
                        )}
                      >
                        <Icon className="h-5 w-5" aria-hidden />
                      </span>
                      <span className="text-sm font-semibold text-foreground">{q.title}</span>
                      <span className={cn("text-xs font-medium opacity-0 transition group-hover:opacity-100", a.text)}>
                        Open →
                      </span>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted">Pulse</p>
            <h2 className="mt-1 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
              Progress & signals
            </h2>
            <p className="mt-1 max-w-lg text-sm text-muted">
              Heuristic snapshots from your local logs—steer the week, don’t fixate on one number.
            </p>
          </div>
          <Link
            href="/profile"
            className="text-sm font-semibold text-accent-secondary transition hover:text-violet-200"
          >
            View profile overview →
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Estimated BMR"
            value={displayMacros ? `${displayMacros.bmr}` : "—"}
            hint="kcal / day"
            category="macros"
          />
          <StatCard
            label="Estimated TDEE"
            value={displayMacros ? `${displayMacros.tdee}` : "—"}
            hint="kcal / day"
            category="macros"
          />
          <StatCard
            label="Hydration"
            value={
              waterToday && waterToday.targetMl > 0
                ? `${Math.round((waterToday.consumedMl / waterToday.targetMl) * 100)}%`
                : "—"
            }
            hint="of today’s target"
            category="water"
          />
          <StatCard
            label="Weight trend"
            value={
              weeklyDelta == null
                ? "—"
                : weeklyDelta > 0
                  ? `+${weeklyDelta.toFixed(1)}`
                  : weeklyDelta.toFixed(1)
            }
            hint="kg / week (approx)"
            category="journal"
          />
        </div>
      </section>

      <section className="space-y-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted">Motivation</p>
        <Card
          variant="strong"
          className={cn(
            "relative overflow-hidden p-8 transition duration-300 sm:p-10",
            "border-accent/20 hover:-translate-y-0.5 hover:shadow-[0_0_64px_-28px_var(--color-accent-glow)]",
          )}
        >
          <Quote className="absolute right-6 top-6 h-20 w-20 text-accent/[0.07] sm:h-24 sm:w-24" aria-hidden />
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-accent/80">Daily lines</p>
          <p className="mt-5 max-w-3xl text-lg font-medium leading-snug text-foreground sm:text-xl">
            {dailyLine}
          </p>
          <p className="mt-4 max-w-3xl border-l-2 border-accent-secondary/40 pl-4 text-base leading-relaxed text-muted sm:text-[1.05rem]">
            {dailyCompanion}
          </p>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-12 lg:gap-8">
        <Card
          className={cn(
            "relative overflow-hidden p-6 transition duration-300 lg:col-span-4",
            "border-accent-secondary/25 bg-gradient-to-br from-accent-secondary/[0.08] via-transparent to-accent/[0.05]",
            "hover:-translate-y-0.5 hover:shadow-[0_0_56px_-28px_rgba(167,139,250,0.35)]",
          )}
        >
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent-secondary/15 text-accent-secondary ring-1 ring-white/10">
              <UserRound className="h-6 w-6" aria-hidden />
            </span>
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-widest text-accent-secondary/90">
                Profile
              </p>
              <h3 className="mt-1 text-lg font-semibold text-foreground">Your training identity</h3>
              <p className="mt-2 text-sm text-muted leading-relaxed">
                Demographics, visibility, and the deeper snapshot cards moved here so the home screen stays
                open.
              </p>
              <Link
                href="/profile"
                className="mt-5 inline-flex items-center gap-2 rounded-full border border-accent-secondary/35 bg-background/30 px-4 py-2 text-sm font-semibold text-accent-secondary transition hover:border-accent-secondary/55 hover:bg-background/50"
              >
                Open profile
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </div>
        </Card>

        <Card className="p-6 transition duration-300 hover:-translate-y-0.5 lg:col-span-8">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/80 pb-4">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Recent activity</h3>
              <p className="text-xs text-muted">Latest check-ins · pulls from your journal</p>
            </div>
            <BookOpen className="h-5 w-5 text-cat-journal" aria-hidden />
          </div>
          {latestEntry ? (
            <ul className="mt-4 divide-y divide-border/50">
              {entries.slice(0, 4).map((e) => (
                <li key={e.id} className="flex gap-4 py-3.5 first:pt-0">
                  <span
                    className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-cat-journal shadow-[0_0_10px_rgba(74,222,128,0.5)]"
                    aria-hidden
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline gap-2">
                      <span className="font-semibold text-foreground">{e.date}</span>
                      <span className="text-xs text-muted">
                        E{e.energy} · M{e.mood}
                        {e.weightKg != null ? ` · ${e.weightKg} kg` : ""}
                      </span>
                    </div>
                    {e.notes ? (
                      <p className="mt-1 line-clamp-2 text-sm text-muted">{e.notes}</p>
                    ) : (
                      <p className="mt-1 text-sm text-muted italic">No note — tap journal to add context.</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-8 flex flex-col items-center rounded-2xl border border-dashed border-border-strong py-10 text-center">
              <LineChart className="h-8 w-8 text-cat-journal/80" aria-hidden />
              <p className="mt-3 text-sm font-medium text-foreground">Nothing logged yet</p>
              <p className="mt-1 max-w-sm text-sm text-muted">One line after training makes this row feel alive.</p>
              <Link
                href="/tools/progress-journal"
                className="mt-5 text-sm font-semibold text-cat-journal hover:underline"
              >
                Log something small →
              </Link>
            </div>
          )}
          <div className="mt-5 flex flex-wrap items-center gap-4 border-t border-border/60 pt-4">
            <Link
              href="/tools/progress-journal"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-cat-journal hover:underline"
            >
              Journal
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <span className="hidden text-muted sm:inline">·</span>
            <p className="text-sm text-muted">
              Insight: <span className="font-medium text-foreground/90">{suggestion.title}</span>
            </p>
          </div>
        </Card>
      </section>

      <section className="space-y-5">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted">Sponsored</p>
          <h2 className="mt-1 text-lg font-semibold text-foreground">Partner placement</h2>
          <p className="mt-1 max-w-xl text-sm text-muted">
            Kept subtle—toggle in config when you have a partner to show.
          </p>
        </div>
        {dashboardAd.enabled ? (
          <div className="max-w-3xl animate-fade-up">
            <AdSlot creative={dashboardAd.creative} />
          </div>
        ) : (
          <Card className="border-dashed border-border-strong p-8 text-center">
            <p className="text-sm text-muted">No active sponsor slot. When enabled, it appears here.</p>
          </Card>
        )}
      </section>
    </div>
  );
}

function HeroChip({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
  accent: ToolCategory;
}) {
  const a = toolAccent(accent);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition duration-200",
        a.border,
        a.soft,
        "text-foreground shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]",
        "hover:-translate-y-0.5 hover:shadow-md",
      )}
    >
      <Icon className={cn("h-3.5 w-3.5 shrink-0", a.text)} aria-hidden />
      <span className="text-muted">{label}</span>
      <span className="max-w-[140px] truncate font-semibold">{value}</span>
    </span>
  );
}