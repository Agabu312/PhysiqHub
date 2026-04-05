"use client";

import { Droplets, Minus, Plus } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AdSlot } from "@/components/ad-slot";
import { ToolPageHeader } from "@/components/tool/tool-accent";
import { loadProfileFromStorage } from "@/lib/profile";
import { getItem, setItem, STORAGE_KEYS } from "@/lib/storage";
import type { Climate, UserProfile, WaterDailyLog } from "@/lib/types";
import { pushCelebration } from "@/lib/celebration-queue";
import { randomCelebration } from "@/lib/motivation";
import { GLASS_ML, localDateKey, unitsForTarget, waterTargetMl } from "@/lib/water";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toolInlineAd } from "@/config/ads.config";
import Link from "next/link";
import { cn } from "@/lib/cn";

function parseLog(raw: string | null): WaterDailyLog | null {
  if (!raw) return null;
  try {
    const o = JSON.parse(raw) as WaterDailyLog;
    if (typeof o.date === "string" && typeof o.targetMl === "number" && typeof o.consumedMl === "number")
      return o;
    return null;
  } catch {
    return null;
  }
}

function maybeCelebrateWaterTargetMet(prev: WaterDailyLog | null, next: WaterDailyLog) {
  if (!prev || prev.targetMl <= 0) return;
  const wasBelow = prev.consumedMl < prev.targetMl;
  const nowMet = next.consumedMl >= next.targetMl;
  if (!wasBelow || !nowMet) return;
  const key = `ph-water-hit-${next.date}`;
  try {
    if (typeof window === "undefined" || sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
  } catch {
    return;
  }
  pushCelebration(randomCelebration());
}

const climates: { value: Climate; label: string; hint: string }[] = [
  { value: "temperate", label: "Temperate", hint: "Typical indoor / mild outdoor" },
  { value: "hot", label: "Hot / humid", hint: "Summer heat or heavy sweating" },
  { value: "cold", label: "Cold / dry", hint: "Winter air, more indoor heat" },
];

export function WaterIntakeClient() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [climate, setClimate] = useState<Climate>("temperate");
  const [log, setLog] = useState<WaterDailyLog | null>(null);

  const hydrate = useCallback((p: UserProfile, c: Climate) => {
    const today = localDateKey();
    const target = waterTargetMl(p, c);
    const raw = getItem(STORAGE_KEYS.waterDaily);
    const prev = parseLog(raw);
    if (!prev || prev.date !== today) {
      const next: WaterDailyLog = { date: today, targetMl: target, consumedMl: 0, climate: c };
      setLog(next);
      setItem(STORAGE_KEYS.waterDaily, JSON.stringify(next));
      return;
    }
    const next: WaterDailyLog = {
      ...prev,
      targetMl: target,
      climate: c,
    };
    setLog(next);
    setItem(STORAGE_KEYS.waterDaily, JSON.stringify(next));
  }, []);

  useEffect(() => {
    const p = loadProfileFromStorage();
    setProfile(p);
    const cRaw = getItem(STORAGE_KEYS.waterClimate);
    const c: Climate =
      cRaw === "hot" || cRaw === "cold" || cRaw === "temperate" ? cRaw : "temperate";
    setClimate(c);
    if (p) hydrate(p, c);
  }, [hydrate]);

  const setClimateAndSave = (c: Climate) => {
    setClimate(c);
    setItem(STORAGE_KEYS.waterClimate, c);
    if (profile) hydrate(profile, c);
  };

  const persistLog = (next: WaterDailyLog) => {
    maybeCelebrateWaterTargetMet(log, next);
    setLog(next);
    setItem(STORAGE_KEYS.waterDaily, JSON.stringify(next));
  };

  const addGlass = () => {
    if (!log) return;
    const maxExtra = GLASS_ML * 2;
    const nextMl = Math.min(log.consumedMl + GLASS_ML, log.targetMl + maxExtra);
    persistLog({ ...log, consumedMl: nextMl });
  };

  const removeGlass = () => {
    if (!log) return;
    persistLog({ ...log, consumedMl: Math.max(0, log.consumedMl - GLASS_ML) });
  };

  const setLevel = (glasses: number) => {
    if (!log) return;
    const nextMl = Math.max(0, Math.min(glasses * GLASS_ML, log.targetMl + GLASS_ML * 4));
    persistLog({ ...log, consumedMl: nextMl });
  };

  const units = useMemo(() => {
    if (!log) return 8;
    return unitsForTarget(log.targetMl);
  }, [log]);

  const filledGlasses = log ? Math.round(log.consumedMl / GLASS_ML) : 0;
  const pct = log && log.targetMl > 0 ? Math.min(100, (log.consumedMl / log.targetMl) * 100) : 0;

  if (!profile) {
    return (
      <div>
        <ToolPageHeader
          category="water"
          title="Water intake"
          subtitle="Uses your profile weight and activity for a daily target."
        />
        <Card variant="strong" className="p-8 md:p-10">
        <CardHeader>
          <CardTitle>Profile required</CardTitle>
          <CardDescription>
            We use your weight and activity level from onboarding to estimate a daily hydration
            target.
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

  if (!log) {
    return (
      <div>
        <ToolPageHeader category="water" title="Water intake" subtitle="Loading…" />
        <p className="text-muted">Loading hydration data…</p>
      </div>
    );
  }

  const liters = (log.targetMl / 1000).toFixed(2);
  const consumedL = (log.consumedMl / 1000).toFixed(2);

  return (
    <div className="space-y-6">
      <ToolPageHeader
        category="water"
        title="Water intake"
        subtitle="Target refreshes at the start of each local day. Tap units to match how much you have actually drank."
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="border-cat-hydration/25 p-6 transition duration-300 hover:-translate-y-0.5 lg:col-span-1">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-cat-hydration">
            <Droplets className="h-4 w-4" aria-hidden />
            Daily target
          </div>
          <p className="mt-3 text-4xl font-semibold tabular-nums text-foreground">{log.targetMl.toLocaleString()}</p>
          <p className="text-sm text-muted">ml · about {liters} L</p>
          <p className="mt-4 text-xs text-muted leading-relaxed">
            Based on {profile.weightKg} kg, {profile.activityLevel.replace("_", " ")} activity, and
            selected climate.
          </p>
        </Card>

        <Card
          variant="strong"
          className="p-6 transition duration-300 hover:-translate-y-0.5 lg:col-span-2"
        >
          <Label>Climate context</Label>
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            {climates.map((c) => (
              <button
                key={c.value}
                type="button"
                onClick={() => setClimateAndSave(c.value)}
                className={cn(
                  "rounded-xl border px-3 py-3 text-left text-sm transition",
                  climate === c.value
                    ? "border-cat-hydration bg-cat-hydration/12 text-cat-hydration"
                    : "border-border bg-surface-elevated/50 hover:border-cat-hydration/25",
                )}
              >
                <span className="font-semibold text-foreground">{c.label}</span>
                <span className="mt-1 block text-xs text-muted">{c.hint}</span>
              </button>
            ))}
          </div>
        </Card>
      </div>

      <Card className="border-cat-hydration/20 p-6 transition duration-300 hover:-translate-y-0.5 md:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="!text-lg">Today&apos;s intake</CardTitle>
            <CardDescription>
              {log.consumedMl.toLocaleString()} ml ({consumedL} L) logged ·{" "}
              {Math.round(pct)}% of target
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" type="button" onClick={removeGlass} aria-label="Remove 250 ml">
              <Minus className="h-4 w-4" />
            </Button>
            <Button type="button" onClick={addGlass}>
              <Plus className="h-4 w-4" aria-hidden />
              Add 250 ml
            </Button>
          </div>
        </div>

        <div
          className="mt-8 rounded-2xl border border-border bg-surface-elevated/40 p-4"
          role="group"
          aria-label="Hydration units"
        >
          <div className="mb-3 flex items-center gap-2 text-xs text-muted">
            <Droplets className="h-4 w-4 text-cat-hydration" aria-hidden />
            Tap a cell to set progress ({GLASS_ML} ml each)
          </div>
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: units }).map((_, i) => {
              const glasses = i + 1;
              const filled = filledGlasses >= glasses;
              return (
                <button
                  key={glasses}
                  type="button"
                  onClick={() => setLevel(glasses)}
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-xl border text-xs font-semibold transition duration-200",
                    filled
                      ? "border-cat-hydration bg-cat-hydration/12 text-cat-hydration shadow-[0_0_20px_-8px_var(--color-cat-hydration)]"
                      : "border-border bg-background/40 text-muted hover:border-cat-hydration/25",
                  )}
                  aria-label={`${filled ? "Filled" : "Empty"} up to ${glasses} glasses`}
                >
                  {glasses}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6 h-3 overflow-hidden rounded-full bg-surface-elevated ring-1 ring-border">
          <div
            className="h-full rounded-full bg-gradient-to-r from-sky-400 to-blue-500 transition-[width] duration-700 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>
      </Card>

      {toolInlineAd.enabled ? <AdSlot creative={toolInlineAd.creative} /> : null}
    </div>
  );
}
