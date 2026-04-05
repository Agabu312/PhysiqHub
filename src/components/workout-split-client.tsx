"use client";

import { RefreshCw, Save, Trash2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AdSlot } from "@/components/ad-slot";
import { ToolPageHeader } from "@/components/tool/tool-accent";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { createId } from "@/lib/id";
import { loadProfileFromStorage } from "@/lib/profile";
import { generateWorkoutSplit } from "@/lib/workout-split-generator";
import { getItem, setItem, STORAGE_KEYS } from "@/lib/storage";
import type {
  GeneratedWorkoutSplit,
  Goal,
  SavedWorkoutSplit,
  SplitEmphasis,
  TrainingExperience,
} from "@/lib/types";
import { toolInlineAd } from "@/config/ads.config";
import { cn } from "@/lib/cn";

const GOAL_OPTS: { value: Goal; label: string }[] = [
  { value: "lose_fat", label: "Lose fat" },
  { value: "maintain", label: "Maintain" },
  { value: "muscle_gain", label: "Build muscle" },
  { value: "recomp", label: "Recomposition" },
  { value: "general_health", label: "General health" },
];

const EXP_OPTS: { value: TrainingExperience; label: string }[] = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

const DAY_OPTS = [2, 3, 4, 5, 6] as const;

const EMPHASIS_OPTS: { value: SplitEmphasis; label: string }[] = [
  { value: "balanced", label: "Balanced" },
  { value: "upper", label: "Upper emphasis" },
  { value: "lower", label: "Lower emphasis" },
  { value: "push_strength", label: "Push / strength" },
  { value: "aesthetics", label: "Aesthetics" },
  { value: "fat_loss_support", label: "Fat loss support" },
];

function loadSaved(): SavedWorkoutSplit[] {
  const raw = getItem(STORAGE_KEYS.workoutSplitsSaved);
  if (!raw) return [];
  try {
    const arr = JSON.parse(raw) as unknown;
    if (!Array.isArray(arr)) return [];
    return arr.filter((x): x is SavedWorkoutSplit => typeof x?.id === "string");
  } catch {
    return [];
  }
}

function saveSaved(list: SavedWorkoutSplit[]) {
  setItem(STORAGE_KEYS.workoutSplitsSaved, JSON.stringify(list.slice(0, 12)));
}

export function WorkoutSplitClient() {
  const profile = useMemo(() => loadProfileFromStorage(), []);
  const [goal, setGoal] = useState<Goal>(profile?.goal ?? "maintain");
  const [experience, setExperience] = useState<TrainingExperience>(
    profile?.trainingExperience ?? "intermediate",
  );
  const [days, setDays] = useState<(typeof DAY_OPTS)[number]>(4);
  const [emphasis, setEmphasis] = useState<SplitEmphasis>("balanced");
  const [injury, setInjury] = useState("");
  const [regen, setRegen] = useState(0);
  const [split, setSplit] = useState<GeneratedWorkoutSplit | null>(null);
  const [saved, setSaved] = useState<SavedWorkoutSplit[]>([]);

  useEffect(() => {
    setSaved(loadSaved());
  }, []);

  const run = useCallback(() => {
    const gen = generateWorkoutSplit({
      goal,
      experience,
      daysPerWeek: days,
      emphasis,
      injuryNotes: injury,
      regenIndex: regen,
    });
    setSplit(gen);
  }, [goal, experience, days, emphasis, injury, regen]);

  useEffect(() => {
    run();
  }, [run]);

  const regenerate = () => {
    setRegen((r) => r + 1);
  };

  const favorite = () => {
    if (!split) return;
    const entry: SavedWorkoutSplit = {
      ...split,
      id: createId(),
      savedAt: new Date().toISOString(),
      label: `${split.title} · ${days}d`,
    };
    const next = [entry, ...loadSaved()];
    saveSaved(next);
    setSaved(next);
  };

  const removeSaved = (savedId: string) => {
    const next = loadSaved().filter((x) => x.id !== savedId);
    saveSaved(next);
    setSaved(next);
  };

  return (
    <div className="space-y-8">
      <ToolPageHeader
        category="split"
        title="Workout split generator"
        subtitle="Heuristic weekly structures from your goal, experience, and available days—then tune to how you actually recover."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card variant="strong" className="border-cat-program/20 p-6 transition duration-300 hover:-translate-y-0.5 lg:col-span-1">
          <CardHeader className="!mb-4">
            <CardTitle>Inputs</CardTitle>
            <CardDescription>Defaults pull from your saved profile when available.</CardDescription>
          </CardHeader>
          <div className="space-y-4">
            <div>
              <Label>Goal</Label>
              <div className="mt-2 flex flex-wrap gap-2">
                {GOAL_OPTS.map((g) => (
                  <button
                    key={g.value}
                    type="button"
                    onClick={() => setGoal(g.value)}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-xs font-medium transition",
                      goal === g.value
                        ? "border-cat-program bg-cat-program/15 text-cat-program"
                        : "border-border text-muted hover:border-border-strong",
                    )}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label>Experience</Label>
              <div className="mt-2 flex flex-wrap gap-2">
                {EXP_OPTS.map((g) => (
                  <button
                    key={g.value}
                    type="button"
                    onClick={() => setExperience(g.value)}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-xs font-medium transition",
                      experience === g.value
                        ? "border-cat-program bg-cat-program/15 text-cat-program"
                        : "border-border text-muted hover:border-border-strong",
                    )}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label>Days per week</Label>
              <div className="mt-2 flex flex-wrap gap-2">
                {DAY_OPTS.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDays(d)}
                    className={cn(
                      "h-10 w-10 rounded-xl border text-sm font-semibold transition",
                      days === d
                        ? "border-cat-program bg-cat-program/15 text-cat-program"
                        : "border-border text-muted hover:border-border-strong",
                    )}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label>Emphasis</Label>
              <select
                className="mt-2 w-full rounded-xl border border-border bg-surface-elevated/50 px-4 py-2.5 text-sm text-foreground"
                value={emphasis}
                onChange={(e) => setEmphasis(e.target.value as SplitEmphasis)}
              >
                {EMPHASIS_OPTS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="inj">Injury / constraint notes (optional)</Label>
              <textarea
                id="inj"
                className="mt-2 min-h-[72px] w-full rounded-xl border border-border bg-surface-elevated/50 px-4 py-2.5 text-sm text-foreground placeholder:text-muted/70 focus:border-cat-program/40 focus:outline-none focus:ring-2 focus:ring-cat-program/20"
                placeholder="e.g. sensitive left shoulder — prefer neutral-grip pressing"
                value={injury}
                onChange={(e) => setInjury(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="secondary" onClick={regenerate}>
                <RefreshCw className="h-4 w-4" aria-hidden />
                Regenerate
              </Button>
              <Button type="button" onClick={favorite} disabled={!split}>
                <Save className="h-4 w-4" aria-hidden />
                Save favorite
              </Button>
            </div>
          </div>
        </Card>

        <div className="space-y-6 lg:col-span-2">
          {split ? (
            <>
              <Card className="p-6 md:p-8">
                <p className="text-xs font-semibold uppercase tracking-wider text-cat-program">
                  Generated plan
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-foreground">{split.title}</h2>
                <p className="mt-2 text-sm text-muted leading-relaxed">{split.summary}</p>
              </Card>
              <div className="grid gap-4">
                {split.days.map((d) => (
                  <Card
                    key={d.dayLabel}
                    className="p-5 transition duration-300 hover:-translate-y-0.5 hover:border-cat-program/30"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-muted">
                          {d.dayLabel}
                        </p>
                        <h3 className="text-lg font-semibold text-foreground">{d.focus}</h3>
                      </div>
                    </div>
                    <ul className="mt-4 space-y-2">
                      {d.exercises.map((ex) => (
                        <li
                          key={ex.name}
                          className="flex flex-col gap-0.5 rounded-xl border border-border bg-surface-elevated/40 px-3 py-2 sm:flex-row sm:items-center sm:justify-between"
                        >
                          <span className="font-medium text-foreground">{ex.name}</span>
                          <span className="text-sm text-cat-program">{ex.setsReps}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-3 text-sm text-muted leading-relaxed">{d.guidance}</p>
                  </Card>
                ))}
              </div>
            </>
          ) : null}

          {toolInlineAd.enabled ? <AdSlot creative={toolInlineAd.creative} /> : null}

          <Card className="p-6">
            <CardHeader className="!mb-4">
              <CardTitle>Saved splits</CardTitle>
              <CardDescription>Favorites stored locally (up to 12).</CardDescription>
            </CardHeader>
            {saved.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-cat-program/35 bg-cat-program/5 py-12 text-center">
                <p className="text-sm font-medium text-foreground">No saved splits</p>
                <p className="mt-2 px-4 text-sm text-muted leading-relaxed">
                  When a week looks right, tap save favorite—it lands here for quick recall.
                </p>
              </div>
            ) : (
              <ul className="space-y-3">
                {saved.map((s) => (
                  <li
                    key={s.id}
                    className="flex flex-col gap-2 rounded-2xl border border-border bg-surface-elevated/40 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-semibold text-foreground">{s.label ?? s.title}</p>
                      <p className="text-xs text-muted">{new Date(s.savedAt).toLocaleString()}</p>
                    </div>
                    <Button variant="danger" type="button" onClick={() => removeSaved(s.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
