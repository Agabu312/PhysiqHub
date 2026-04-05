"use client";

import type { FormEvent } from "react";
import { Flame, HeartPulse, MoonStar, Trash2, TrendingUp } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AdSlot } from "@/components/ad-slot";
import { ToolPageHeader } from "@/components/tool/tool-accent";
import { pushCelebration } from "@/lib/celebration-queue";
import { createId } from "@/lib/id";
import { loadJournalEntries, saveJournalEntries, sortEntriesByDateDesc } from "@/lib/journal-storage";
import { randomCelebration } from "@/lib/motivation";
import type { JournalEntry } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toolInlineAd } from "@/config/ads.config";
import { cn } from "@/lib/cn";

const performancePresets = ["Easy", "OK", "Solid", "Tough but finished", "PR / breakthrough"];

function todayInputValue(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function ProgressJournalClient() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [date, setDate] = useState(todayInputValue);
  const [weight, setWeight] = useState("");
  const [mood, setMood] = useState(3);
  const [energy, setEnergy] = useState(3);
  const [performance, setPerformance] = useState(performancePresets[1]);
  const [notes, setNotes] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const reload = useCallback(() => {
    setEntries(sortEntriesByDateDesc(loadJournalEntries()));
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const addEntry = (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);
    const w = weight.trim() === "" ? null : Number(weight);
    if (weight.trim() !== "" && (Number.isNaN(w) || w! < 30 || w! > 300)) {
      setFormError("Weight should be between 30 and 300 kg, or leave blank.");
      return;
    }
    const entry: JournalEntry = {
      id: createId(),
      date,
      weightKg: w,
      mood,
      energy,
      workoutPerformance: performance,
      notes: notes.trim(),
      createdAt: new Date().toISOString(),
    };
    const next = sortEntriesByDateDesc([...loadJournalEntries(), entry]);
    saveJournalEntries(next);
    pushCelebration(randomCelebration());
    setEntries(next);
    setWeight("");
    setNotes("");
    setMood(3);
    setEnergy(3);
    setPerformance(performancePresets[1]);
    setDate(todayInputValue());
  };

  const remove = (id: string) => {
    const next = loadJournalEntries().filter((x) => x.id !== id);
    saveJournalEntries(next);
    setEntries(sortEntriesByDateDesc(next));
  };

  const weighed = useMemo(
    () => [...entries].filter((e) => e.weightKg != null).sort((a, b) => a.date.localeCompare(b.date)),
    [entries],
  );

  const trend = useMemo(() => {
    if (weighed.length < 2) return null;
    const first = weighed[0].weightKg!;
    const last = weighed[weighed.length - 1].weightKg!;
    const delta = last - first;
    return { delta, n: weighed.length };
  }, [weighed]);

  const latest = entries[0];

  return (
    <div className="space-y-8">
      <ToolPageHeader
        category="journal"
        title="Progress journal"
        subtitle="A fast, local recovery log for mood, energy, performance, and notes—quietly useful, never noisy."
      />

      <div className="grid gap-6 xl:grid-cols-12">
        <Card
          variant="strong"
          className={cn(
            "overflow-hidden p-0 xl:col-span-5",
            "border-cat-journal/20 bg-gradient-to-br from-cat-journal/[0.05] via-transparent to-transparent",
          )}
        >
          <div className="border-b border-white/[0.06] px-6 py-6 md:px-8">
            <div className="flex items-start gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cat-journal/15 text-cat-journal ring-1 ring-cat-journal/20">
                <MoonStar className="h-6 w-6" aria-hidden />
              </span>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cat-journal/85">
                  Daily check-in
                </p>
                <h2 className="mt-1 text-xl font-semibold tracking-tight text-foreground">New entry</h2>
                <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted">
                  Takes under a minute. The goal is honest signal, not perfect journaling.
                </p>
              </div>
            </div>
          </div>

          <form className="space-y-6 px-6 py-6 md:px-8 md:py-8" onSubmit={addEntry}>
            {formError ? (
              <p className="rounded-2xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {formError}
              </p>
            ) : null}

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="j-date">Date</Label>
                <Input
                  id="j-date"
                  type="date"
                  className="mt-2"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="j-weight">Weight (kg, optional)</Label>
                <Input
                  id="j-weight"
                  inputMode="decimal"
                  className="mt-2"
                  placeholder="e.g. 75.4"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <MoodEnergyCard
                title="Mood"
                value={mood}
                onChange={setMood}
                icon={HeartPulse}
                accentClass="text-pink-300"
                subtitle="How steady do you feel?"
              />
              <MoodEnergyCard
                title="Energy"
                value={energy}
                onChange={setEnergy}
                icon={Flame}
                accentClass="text-emerald-300"
                subtitle="How much drive do you have?"
              />
            </div>

            <div>
              <Label>Workout performance</Label>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {performancePresets.map((preset) => {
                  const active = performance === preset;
                  return (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setPerformance(preset)}
                      className={cn(
                        "rounded-2xl border px-4 py-3 text-left transition-all duration-200",
                        "hover:-translate-y-0.5 hover:border-cat-journal/35 hover:bg-cat-journal/8",
                        active
                          ? "border-cat-journal/35 bg-cat-journal/10 text-foreground shadow-[0_0_28px_-18px_rgba(74,222,128,0.35)]"
                          : "border-border bg-surface-elevated/25 text-muted",
                      )}
                    >
                      <span className="text-sm font-medium">{preset}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <Label htmlFor="j-notes">Notes</Label>
              <div className="mt-2 rounded-2xl border border-border bg-surface-elevated/30 p-3 transition focus-within:border-cat-journal/35 focus-within:ring-2 focus-within:ring-cat-journal/15">
                <textarea
                  id="j-notes"
                  className="min-h-[120px] w-full resize-none bg-transparent px-1 py-1 text-sm text-foreground placeholder:text-muted/70 focus:outline-none"
                  placeholder="Sleep, stress, soreness, nutrition, session quality…"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
              <p className="mt-2 text-xs text-muted">
                Keep it short. A few honest lines beat a perfect essay.
              </p>
            </div>

            <Button type="submit" className="w-full">
              Save entry
            </Button>
          </form>
        </Card>

        <div className="space-y-6 xl:col-span-7">
          <div className="grid gap-4 md:grid-cols-3">
            <SignalMiniCard
              label="Latest mood"
              value={`${latest?.mood ?? "—"}/5`}
              hint={latest ? "Most recent check-in" : "No entries yet"}
              color="pink"
            />
            <SignalMiniCard
              label="Latest energy"
              value={`${latest?.energy ?? "—"}/5`}
              hint={latest ? "Most recent check-in" : "No entries yet"}
              color="green"
            />
            <SignalMiniCard
              label="Current trend"
              value={
                trend ? `${trend.delta >= 0 ? "+" : ""}${trend.delta.toFixed(1)} kg` : "—"
              }
              hint={trend ? `${trend.n} weigh-ins logged` : "Need at least 2 weigh-ins"}
              color="journal"
            />
          </div>

          <Card className="overflow-hidden p-0">
            <div className="border-b border-white/[0.06] px-6 py-5">
              <CardTitle>Weight trend</CardTitle>
              <CardDescription className="mt-1">
                {trend
                  ? `Across ${trend.n} logged weigh-ins: ${trend.delta >= 0 ? "+" : ""}${trend.delta.toFixed(1)} kg from oldest to newest.`
                  : "Log weight on two separate days to unlock the trend view."}
              </CardDescription>
            </div>

            <div className="px-6 py-6">
              {weighed.length >= 2 ? (
                <WeightSparkline points={weighed.map((e) => ({ date: e.date, w: e.weightKg! }))} />
              ) : (
                <div className="rounded-2xl border border-dashed border-cat-journal/30 bg-gradient-to-br from-cat-journal/[0.08] to-transparent py-14 text-center">
                  <TrendingUp className="mx-auto h-8 w-8 text-cat-journal/80" aria-hidden />
                  <p className="mt-4 text-sm font-medium text-foreground">Trend view unlocks automatically</p>
                  <p className="mt-2 px-6 text-sm text-muted leading-relaxed">
                    Log weight on two different days and this panel becomes a sparkline with a simple direction signal.
                  </p>
                </div>
              )}
            </div>
          </Card>

          <Card className="overflow-hidden p-0">
            <div className="border-b border-white/[0.06] px-6 py-5">
              <CardTitle>History</CardTitle>
              <CardDescription className="mt-1">Newest first. Quiet, fast, readable.</CardDescription>
            </div>

            <div className="px-6 py-6">
              {entries.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-cat-journal/35 bg-cat-journal/5 px-6 py-14 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-cat-journal/15 text-cat-journal ring-1 ring-cat-journal/25">
                    <span className="text-2xl font-bold" aria-hidden>
                      +
                    </span>
                  </div>
                  <p className="mt-4 text-sm font-medium text-foreground">Start your log</p>
                  <p className="mt-2 text-sm text-muted leading-relaxed">
                    One honest check-in is enough to begin. Momentum beats overthinking.
                  </p>
                </div>
              ) : (
                <ul className="space-y-4">
                  {entries.map((e) => (
                    <li
                      key={e.id}
                      className={cn(
                        "rounded-2xl border border-border bg-surface-elevated/35 p-4 transition duration-300",
                        "hover:-translate-y-0.5 hover:border-cat-journal/30 hover:bg-surface-elevated/45",
                      )}
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-base font-semibold text-foreground">{e.date}</p>
                            {e.weightKg != null ? (
                              <span className="rounded-full border border-cat-journal/25 bg-cat-journal/10 px-2.5 py-1 text-[11px] font-medium text-cat-journal">
                                {e.weightKg} kg
                              </span>
                            ) : null}
                          </div>

                          <div className="mt-3 flex flex-wrap gap-2">
                            <HistoryChip label={`Mood ${e.mood}/5`} tone="pink" />
                            <HistoryChip label={`Energy ${e.energy}/5`} tone="green" />
                            <HistoryChip label={e.workoutPerformance} tone="journal" />
                          </div>

                          {e.notes ? (
                            <div className="mt-4 rounded-xl border border-white/[0.05] bg-background/20 px-4 py-3">
                              <p className="text-sm leading-relaxed text-foreground/90">{e.notes}</p>
                            </div>
                          ) : (
                            <p className="mt-4 text-sm italic text-muted">No note added for this check-in.</p>
                          )}
                        </div>

                        <Button
                          variant="danger"
                          type="button"
                          className="shrink-0 self-start"
                          onClick={() => remove(e.id)}
                          aria-label="Delete entry"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Card>

          {toolInlineAd.enabled ? <AdSlot creative={toolInlineAd.creative} /> : null}
        </div>
      </div>
    </div>
  );
}

function MoodEnergyCard({
  title,
  subtitle,
  value,
  onChange,
  icon: Icon,
  accentClass,
}: {
  title: string;
  subtitle: string;
  value: number;
  onChange: (n: number) => void;
  icon: typeof HeartPulse;
  accentClass: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface-elevated/25 p-4">
      <div className="flex items-start gap-3">
        <span className={cn("flex h-10 w-10 items-center justify-center rounded-2xl bg-background/35 ring-1 ring-white/10", accentClass)}>
          <Icon className="h-5 w-5" aria-hidden />
        </span>
        <div>
          <p className="text-sm font-semibold text-foreground">{title}</p>
          <p className="mt-1 text-xs text-muted">{subtitle}</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-5 gap-2">
        {[1, 2, 3, 4, 5].map((n) => {
          const active = value === n;
          return (
            <button
              key={n}
              type="button"
              onClick={() => onChange(n)}
              className={cn(
                "rounded-xl border px-0 py-3 text-sm font-semibold transition-all duration-200",
                "hover:-translate-y-0.5 hover:border-cat-journal/30",
                active
                  ? "border-cat-journal bg-cat-journal/12 text-cat-journal shadow-[0_0_22px_-14px_rgba(74,222,128,0.35)]"
                  : "border-border bg-background/25 text-muted",
              )}
            >
              {n}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SignalMiniCard({
  label,
  value,
  hint,
  color,
}: {
  label: string;
  value: string;
  hint: string;
  color: "pink" | "green" | "journal";
}) {
  const tone =
    color === "pink"
      ? "border-pink-400/20 bg-pink-500/[0.06] text-pink-200"
      : color === "green"
        ? "border-emerald-400/20 bg-emerald-500/[0.06] text-emerald-200"
        : "border-cat-journal/20 bg-cat-journal/[0.06] text-cat-journal";

  return (
    <Card className={cn("p-4", tone)}>
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">{value}</p>
      <p className="mt-1 text-xs text-muted">{hint}</p>
    </Card>
  );
}

function HistoryChip({
  label,
  tone,
}: {
  label: string;
  tone: "pink" | "green" | "journal";
}) {
  const cls =
    tone === "pink"
      ? "border-pink-400/20 bg-pink-500/10 text-pink-200"
      : tone === "green"
        ? "border-emerald-400/20 bg-emerald-500/10 text-emerald-200"
        : "border-cat-journal/20 bg-cat-journal/10 text-cat-journal";

  return <span className={cn("rounded-full border px-2.5 py-1 text-[11px] font-medium", cls)}>{label}</span>;
}

function WeightSparkline({ points }: { points: { date: string; w: number }[] }) {
  const wMin = Math.min(...points.map((p) => p.w));
  const wMax = Math.max(...points.map((p) => p.w));
  const pad = Math.max(0.2, (wMax - wMin) * 0.08);
  const min = wMin - pad;
  const max = wMax + pad;
  const w = 320;
  const h = 120;
  const coords = points.map((p, i) => {
    const x = (i / Math.max(1, points.length - 1)) * w;
    const y = h - ((p.w - min) / (max - min || 1)) * h;
    return `${x},${y}`;
  });
  const polyline = coords.join(" ");

  return (
    <div>
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="w-full overflow-visible text-cat-journal"
        role="img"
        aria-label="Weight trend line chart"
      >
        <defs>
          <linearGradient id="wjFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgb(74 222 128)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="rgb(74 222 128)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polyline
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinejoin="round"
          strokeLinecap="round"
          points={polyline}
        />
        <polygon fill="url(#wjFill)" points={`0,${h} ${polyline} ${w},${h}`} opacity={0.9} />
      </svg>
      <div className="mt-3 flex justify-between text-[10px] text-muted">
        <span>{points[0]?.date}</span>
        <span>{points[points.length - 1]?.date}</span>
      </div>
    </div>
  );
}