"use client";

import { Info, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AdSlot } from "@/components/ad-slot";
import { ToolPageHeader } from "@/components/tool/tool-accent";
import {
  computeMacroResults,
  goalLabel,
  scenarioForGoal,
} from "@/lib/nutrition";
import { loadProfileFromStorage } from "@/lib/profile";
import { getItem, setItem, STORAGE_KEYS } from "@/lib/storage";
import type { Goal, MacroResults, MacroScenario, UserProfile } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toolInlineAd } from "@/config/ads.config";
import { cn } from "@/lib/cn";
import Link from "next/link";

function parseStored(raw: string | null): MacroResults | null {
  if (!raw) return null;
  try {
    const o = JSON.parse(raw) as MacroResults;
    if (typeof o.bmr === "number" && o.fatLoss && o.maintenance && o.muscleGain) return o;
    return null;
  } catch {
    return null;
  }
}

function macroBar(scenario: MacroScenario) {
  const total = scenario.proteinKcal + scenario.carbKcal + scenario.fatKcal || 1;
  const p = (scenario.proteinKcal / total) * 100;
  const c = (scenario.carbKcal / total) * 100;
  const f = (scenario.fatKcal / total) * 100;
  return { p, c, f };
}

function explanationForGoal(goal: Goal): string {
  switch (goal) {
    case "lose_fat":
      return "Fat loss prioritizes higher protein to protect lean mass while calories sit below maintenance. Carbs flex around training days; fats stay adequate for hormones and satiety.";
    case "muscle_gain":
      return "Muscle gain pairs a modest surplus with strong protein distribution so new tissue has amino acid availability without excessive fat spillover.";
    case "recomp":
      return "Recomposition favors maintenance calories with disciplined training. Protein stays elevated; carbs and fats balance adherence and performance.";
    case "general_health":
      return "General health targets sustainable protein, enough fat for essential needs, and carbs that support daily energy without sharp restriction.";
    default:
      return "Maintenance keeps intake aligned with estimated expenditure—ideal for performance testing blocks or short diet breaks.";
  }
}

export function CalorieMacroClient() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [results, setResults] = useState<MacroResults | null>(null);
  const [selected, setSelected] = useState<"fatLoss" | "maintenance" | "muscleGain">("maintenance");

  const refresh = useCallback(() => {
    const p = loadProfileFromStorage();
    setProfile(p);
    if (!p) {
      setResults(null);
      return;
    }
    const computed = computeMacroResults(p);
    setResults(computed);
    setItem(STORAGE_KEYS.macroResults, JSON.stringify(computed));
  }, []);

  useEffect(() => {
    const p = loadProfileFromStorage();
    setProfile(p);
    if (!p) {
      setResults(null);
      return;
    }
    const stored = parseStored(getItem(STORAGE_KEYS.macroResults));
    const computed = stored ?? computeMacroResults(p);
    setResults(computed);
    if (!stored) {
      setItem(STORAGE_KEYS.macroResults, JSON.stringify(computed));
    }
  }, []);

  useEffect(() => {
    if (!profile) return;
    if (profile.goal === "lose_fat") setSelected("fatLoss");
    else if (profile.goal === "muscle_gain") setSelected("muscleGain");
    else setSelected("maintenance");
  }, [profile]);

  const primaryScenario = profile && results ? scenarioForGoal(results, profile.goal) : null;

  const activeScenario: MacroScenario | null = useMemo(() => {
    if (!results) return null;
    if (selected === "fatLoss") return results.fatLoss;
    if (selected === "muscleGain") return results.muscleGain;
    return results.maintenance;
  }, [results, selected]);

  if (!profile || !results) {
    return (
      <div>
        <ToolPageHeader
          category="macros"
          title="Calorie & macro calculator"
          subtitle="Requires onboarding data for BMR and TDEE."
        />
        <Card variant="strong" className="p-8 md:p-10">
        <CardHeader>
          <CardTitle>Profile required</CardTitle>
          <CardDescription>
            The macro calculator uses your onboarding data for Mifflin–St Jeor BMR and activity-based
            TDEE.
          </CardDescription>
        </CardHeader>
        <Link
          href="/onboarding"
          className="mt-6 inline-flex min-h-10 items-center justify-center rounded-full bg-accent px-6 text-sm font-semibold text-background"
        >
          Complete onboarding
        </Link>
        </Card>
      </div>
    );
  }

  const bar = activeScenario ? macroBar(activeScenario) : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <ToolPageHeader
          className="mb-0 border-0 pb-0"
          category="macros"
          title="Calorie & macro calculator"
          subtitle={`Estimates for ${goalLabel(profile.goal)} · synced from your saved profile`}
        />
        <Button variant="secondary" onClick={refresh} type="button" className="shrink-0">
          <RefreshCw className="h-4 w-4" aria-hidden />
          Recalculate
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatTile label="BMR" value={`${results.bmr}`} sub="kcal / day · Mifflin–St Jeor" />
        <StatTile label="TDEE (maint.)" value={`${results.tdee}`} sub="kcal / day · activity-adjusted" />
        <StatTile
          label="Primary target"
          value={`${primaryScenario?.calories ?? "—"}`}
          sub="kcal / day · matches your goal band"
        />
      </div>

      <Card variant="strong" className="p-6 md:p-8">
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-cat-macros" aria-hidden />
          <div>
            <h2 className="text-sm font-semibold text-foreground">Guidance for your goal</h2>
            <p className="mt-2 text-sm text-muted leading-relaxed">
              {explanationForGoal(profile.goal)}
            </p>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        {(
          [
            { key: "fatLoss" as const, title: "Fat loss", s: results.fatLoss },
            { key: "maintenance" as const, title: "Maintenance", s: results.maintenance },
            { key: "muscleGain" as const, title: "Muscle gain", s: results.muscleGain },
          ] as const
        ).map(({ key, title, s }) => (
          <button
            key={key}
            type="button"
            onClick={() => setSelected(key)}
            className={cn(
              "rounded-2xl border p-5 text-left transition duration-200",
              selected === key
                ? "border-cat-macros bg-cat-macros/12 shadow-[inset_0_0_0_1px_rgba(34,211,238,0.22)]"
                : "border-border glass-panel hover:border-cat-macros/25",
            )}
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">{title}</p>
            <p className="mt-2 text-3xl font-semibold text-foreground">{s.calories}</p>
            <p className="text-xs text-muted">kcal / day</p>
            <ul className="mt-4 space-y-2 text-sm text-muted">
              <li className="flex justify-between gap-2">
                <span>Protein</span>
                <span className="font-medium text-foreground">
                  {s.proteinG} g <span className="text-muted">({s.proteinKcal} kcal)</span>
                </span>
              </li>
              <li className="flex justify-between gap-2">
                <span>Carbs</span>
                <span className="font-medium text-foreground">
                  {s.carbG} g <span className="text-muted">({s.carbKcal} kcal)</span>
                </span>
              </li>
              <li className="flex justify-between gap-2">
                <span>Fats</span>
                <span className="font-medium text-foreground">
                  {s.fatG} g <span className="text-muted">({s.fatKcal} kcal)</span>
                </span>
              </li>
            </ul>
          </button>
        ))}
      </div>

      {activeScenario && bar ? (
        <Card className="p-6 md:p-8">
          <CardHeader className="!mb-4">
            <CardTitle>Macro energy mix · {activeScenario.label}</CardTitle>
            <CardDescription>Approximate calorie share from each macronutrient.</CardDescription>
          </CardHeader>
          <div className="flex h-4 overflow-hidden rounded-full bg-surface-elevated ring-1 ring-border">
            <div
              className="bg-cyan-400/90 transition-all duration-500"
              style={{ width: `${bar.p}%` }}
              title="Protein"
            />
            <div
              className="bg-violet-400/90 transition-all duration-500"
              style={{ width: `${bar.c}%` }}
              title="Carbs"
            />
            <div
              className="bg-amber-300/90 transition-all duration-500"
              style={{ width: `${bar.f}%` }}
              title="Fat"
            />
          </div>
          <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted">
            <span className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-cyan-400" /> Protein ~{Math.round(bar.p)}%
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-violet-400" /> Carbs ~{Math.round(bar.c)}%
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-amber-300" /> Fat ~{Math.round(bar.f)}%
            </span>
          </div>
        </Card>
      ) : null}

      {toolInlineAd.enabled ? <AdSlot creative={toolInlineAd.creative} /> : null}
    </div>
  );
}

function StatTile({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <Card className="border-cat-macros/20 p-5 transition duration-300 hover:-translate-y-1 hover:border-cat-macros/35 hover:shadow-[0_0_48px_-24px_var(--color-cat-macros)]">
      <p className="text-[10px] font-bold uppercase tracking-widest text-cat-macros">{label}</p>
      <p className="mt-2 text-2xl font-semibold tabular-nums text-foreground">{value}</p>
      <p className="text-xs text-muted">{sub}</p>
    </Card>
  );
}
