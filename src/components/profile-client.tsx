"use client";

import type { ComponentType } from "react";
import {
  Activity,
  ArrowRight,
  BookOpen,
  Droplets,
  Globe,
  Languages,
  LineChart,
  PieChart,
  Ruler,
  Scale,
  Sparkles,
  Target,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { AdSlot } from "@/components/ad-slot";
import { BodyInsightsCenterpiece } from "@/components/profile/body-insights";
import { ToolPageHeader, toolAccent } from "@/components/tool/tool-accent";
import { Card } from "@/components/ui/card";
import { profileAd } from "@/config/ads.config";
import { adaptiveSuggestion, readinessFromJournal, weeklyWeightDeltaKg } from "@/lib/insights";
import { cn } from "@/lib/cn";
import { goalLabel, scenarioForGoal } from "@/lib/nutrition";
import {
  loadProfileInsightsBundle,
  macroDisplayForProfile,
  resolveWaterToday,
} from "@/lib/profile-insights-data";
import type { ToolCategory, UserProfile } from "@/lib/types";

function humanizeActivity(level: UserProfile["activityLevel"]): string {
  return level.replace(/_/g, " ");
}

function humanizeTraining(exp: UserProfile["trainingExperience"]): string {
  return exp.charAt(0).toUpperCase() + exp.slice(1);
}

function visibilityLabel(v: UserProfile["profileVisibility"]): string {
  return v === "public" ? "Public (future)" : "Private";
}

function DetailChip({
  icon: Icon,
  label,
  value,
  accent,
  muted,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
  accent: ToolCategory;
  muted?: boolean;
}) {
  const a = toolAccent(accent);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition",
        muted ? "border-border bg-surface-elevated/50 text-muted" : cn(a.border, a.soft, "text-foreground"),
      )}
    >
      <Icon className={cn("h-3.5 w-3.5 shrink-0", muted ? "text-muted" : a.text)} aria-hidden />
      <span className="text-muted">{label}</span>
      <span className="max-w-[160px] truncate font-semibold text-foreground">{value}</span>
    </span>
  );
}

function PersonalSummaryCard({
  label,
  value,
  sub,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string;
  sub?: string;
  icon: ComponentType<{ className?: string }>;
  accent: ToolCategory;
}) {
  const a = toolAccent(accent);
  return (
    <Card
      className={cn(
        "group relative overflow-hidden p-4 transition duration-300",
        "hover:-translate-y-0.5 hover:shadow-lg",
        a.border,
        "bg-background/30",
        a.glow,
      )}
    >
      <div className="flex items-start gap-3">
        <span
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-1 ring-white/10 transition group-hover:scale-105",
            a.soft,
            a.text,
          )}
        >
          <Icon className="h-5 w-5" aria-hidden />
        </span>
        <div className="min-w-0">
          <p className={cn("text-[10px] font-bold uppercase tracking-widest", a.text)}>{label}</p>
          <p className="mt-1 text-lg font-semibold tabular-nums text-foreground">{value}</p>
          {sub ? <p className="mt-0.5 text-xs text-muted leading-snug">{sub}</p> : null}
        </div>
      </div>
    </Card>
  );
}

export function ProfileClient() {
  const [bundle, setBundle] = useState(() => loadProfileInsightsBundle());

  const refresh = () => setBundle(loadProfileInsightsBundle());

  const profile = bundle.profile;
  const entries = bundle.entries;

  const macros = useMemo(
    () => (profile ? macroDisplayForProfile(profile, bundle.macrosStored) : null),
    [profile, bundle.macrosStored],
  );

  const waterToday = useMemo(
    () => resolveWaterToday(profile, bundle.waterLog, bundle.climate),
    [profile, bundle.waterLog, bundle.climate],
  );

  const readiness = useMemo(() => readinessFromJournal(entries), [entries]);
  const suggestion = useMemo(
    () => adaptiveSuggestion({ profile, water: waterToday, entries }),
    [profile, waterToday, entries],
  );
  const weeklyDelta = useMemo(() => weeklyWeightDeltaKg(entries), [entries]);

  const bodyFatStored = bundle.bodyFat;

  const displayName = profile?.displayName?.trim() || (profile ? "Athlete" : null);

  if (!profile) {
    return (
      <div>
        <ToolPageHeader
          category="profile"
          title="Profile"
          subtitle="Your training identity and body insights live here once onboarding is complete."
        />
        <Card className="p-8">
          <p className="text-muted">No profile on this device yet.</p>
          <Link
            href="/onboarding"
            className="mt-4 inline-flex rounded-full bg-accent px-6 py-2 text-sm font-semibold text-background"
          >
            Start onboarding
          </Link>
        </Card>
      </div>
    );
  }

  const macroScenario = macros ? scenarioForGoal(macros, profile.goal) : null;
  const bfDisplay =
    bodyFatStored != null
      ? `${bodyFatStored.bodyFatPercent.toFixed(1)}%`
      : profile.bodyFatPercent != null && !Number.isNaN(profile.bodyFatPercent as number)
        ? `~${profile.bodyFatPercent}%`
        : "—";
  const bfSub =
    bodyFatStored != null
      ? `Lean ${bodyFatStored.leanMassKg.toFixed(1)} kg · Fat ${bodyFatStored.fatMassKg.toFixed(1)} kg`
      : "Navy tool or profile field";

  const hydrationValue =
    waterToday && waterToday.targetMl > 0
      ? `${waterToday.targetMl} ml`
      : "—";
  const hydrationSub =
    waterToday && waterToday.targetMl > 0
      ? `${Math.round((waterToday.consumedMl / waterToday.targetMl) * 100)}% logged today · ${waterToday.climate}`
      : "Open water tool";

  return (
    <div className="space-y-12 pb-8">
      <ToolPageHeader
        category="profile"
        title="Profile"
        subtitle="Local identity, personal metrics, and an interactive map tied to your saved tools—nothing leaves this device."
      />

      <Card
        variant="strong"
        className={cn(
          "relative overflow-hidden p-6 md:p-8",
          "border-accent-secondary/25 shadow-[0_0_72px_-36px_rgba(167,139,250,0.35)]",
        )}
      >
        <div
          className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-accent-secondary/10 blur-3xl"
          aria-hidden
        />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent-secondary/90">Identity</p>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                {displayName}
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-muted leading-relaxed">
                {profile.gender === "male" ? "Male" : "Female"} · {goalLabel(profile.goal)} ·{" "}
                {humanizeActivity(profile.activityLevel)} · {humanizeTraining(profile.trainingExperience)}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <DetailChip icon={Target} label="Goal" value={goalLabel(profile.goal)} accent="macros" />
              <DetailChip
                icon={Activity}
                label="Activity"
                value={humanizeActivity(profile.activityLevel)}
                accent="water"
              />
              <DetailChip
                icon={Sparkles}
                label="Training"
                value={humanizeTraining(profile.trainingExperience)}
                accent="split"
              />
              <DetailChip
                icon={Scale}
                label="Visibility"
                value={visibilityLabel(profile.profileVisibility)}
                accent="settings"
              />
              {profile.region ? (
                <DetailChip icon={Globe} label="Region" value={profile.region} accent="community" />
              ) : (
                <DetailChip icon={Globe} label="Region" value="Not set" accent="settings" muted />
              )}
              {profile.language ? (
                <DetailChip icon={Languages} label="Language" value={profile.language} accent="community" />
              ) : (
                <DetailChip icon={Languages} label="Language" value="Default" accent="settings" muted />
              )}
            </div>
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row lg:flex-col">
            <Link
              href="/settings"
              className="rounded-full border border-border-strong bg-background/40 px-5 py-2.5 text-center text-sm font-semibold text-accent transition hover:border-accent/40 hover:text-teal-200"
            >
              Edit in settings
            </Link>
            <button
              type="button"
              onClick={refresh}
              className="rounded-full border border-border px-5 py-2.5 text-sm font-medium text-muted transition hover:bg-surface-elevated hover:text-foreground"
            >
              Refresh data
            </button>
          </div>
        </div>
      </Card>

      <section className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted">Personal summary</p>
            <h2 className="mt-1 text-lg font-semibold text-foreground">At a glance</h2>
          </div>
          {weeklyDelta != null ? (
            <span className="rounded-full border border-cat-journal/30 bg-cat-journal/10 px-3 py-1 text-xs font-medium text-cat-journal">
              Weight trend ~{weeklyDelta > 0 ? "+" : ""}
              {weeklyDelta.toFixed(1)} kg/wk
            </span>
          ) : null}
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <PersonalSummaryCard
            label="Weight"
            value={`${profile.weightKg} kg`}
            accent="neutral"
            icon={Scale}
          />
          <PersonalSummaryCard
            label="Height"
            value={`${profile.heightCm} cm`}
            accent="neutral"
            icon={Ruler}
          />
          <PersonalSummaryCard label="Age" value={`${profile.age}`} sub="years" accent="settings" icon={Sparkles} />
          <PersonalSummaryCard
            label="Body fat"
            value={bfDisplay}
            sub={bfSub}
            accent="bodyFat"
            icon={Ruler}
          />
          <PersonalSummaryCard
            label="Calories & macros"
            value={macroScenario ? `${macroScenario.calories} kcal` : "—"}
            sub={
              macroScenario
                ? `P ${macroScenario.proteinG}g · C ${macroScenario.carbG}g · F ${macroScenario.fatG}g · ${macroScenario.label}`
                : "Run calorie & macro tool"
            }
            accent="macros"
            icon={PieChart}
          />
          <PersonalSummaryCard
            label="Hydration target"
            value={hydrationValue}
            sub={hydrationSub}
            accent="water"
            icon={Droplets}
          />
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        <Card
          className={cn(
            "p-5 transition duration-300 hover:-translate-y-0.5",
            "border-emerald-500/15 shadow-[0_0_48px_-28px_rgba(74,222,128,0.35)]",
          )}
        >
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cat-journal/15 text-cat-journal ring-1 ring-cat-journal/20">
              <Activity className="h-5 w-5" aria-hidden />
            </span>
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-widest text-cat-journal/90">Readiness</p>
              <p
                className={cn(
                  "mt-1 text-xl font-bold tracking-tight",
                  readiness.status === "recover" && "text-amber-300",
                  readiness.status === "maintain" && "text-foreground",
                  readiness.status === "push" && "text-emerald-300",
                )}
              >
                {readiness.title}
              </p>
              <p className="mt-2 text-sm text-muted leading-relaxed">{readiness.detail}</p>
            </div>
          </div>
        </Card>
        <Card
          className={cn(
            "p-5 transition duration-300 hover:-translate-y-0.5",
            "border-violet-500/20 shadow-[0_0_48px_-28px_rgba(167,139,250,0.3)]",
          )}
        >
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/15 text-violet-300 ring-1 ring-violet-400/25">
              <Target className="h-5 w-5" aria-hidden />
            </span>
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-widest text-violet-300/90">Adaptive signal</p>
              <p className="mt-1 text-lg font-semibold text-foreground">{suggestion.title}</p>
              <p className="mt-2 text-sm text-muted leading-relaxed">{suggestion.body}</p>
            </div>
          </div>
        </Card>
      </div>

      <BodyInsightsCenterpiece profile={profile} bundle={bundle} waterToday={waterToday} macros={macros} />

      {profileAd.enabled ? (
        <section className="space-y-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted">Sponsored</p>
          <AdSlot creative={profileAd.creative} className="max-w-lg p-4" />
        </section>
      ) : null}

      <Card className="p-6 transition duration-300">
        <div className="flex items-center justify-between gap-2 border-b border-border/80 pb-4">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Recent journal</h3>
            <p className="text-xs text-muted">Newest entries on this device</p>
          </div>
          <BookOpen className="h-5 w-5 text-cat-journal" aria-hidden />
        </div>
        {entries[0] ? (
          <ul className="mt-4 divide-y divide-border/50">
            {entries.slice(0, 4).map((e) => (
              <li key={e.id} className="flex gap-3 py-3 first:pt-0">
                <span
                  className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-cat-journal shadow-[0_0_10px_rgba(74,222,128,0.45)]"
                  aria-hidden
                />
                <div className="min-w-0">
                  <p className="font-medium text-foreground">{e.date}</p>
                  <p className="text-sm text-muted">
                    Mood {e.mood}/5 · Energy {e.energy}/5
                    {e.weightKg != null ? ` · ${e.weightKg} kg` : ""}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-6 rounded-xl border border-dashed border-cat-journal/30 bg-cat-journal/5 py-8 text-center">
            <LineChart className="mx-auto h-7 w-7 text-cat-journal" aria-hidden />
            <p className="mt-2 text-sm text-muted">No check-ins yet.</p>
          </div>
        )}
        <Link
          href="/tools/progress-journal"
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-cat-journal hover:underline"
        >
          Open progress journal
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </Card>
    </div>
  );
}
