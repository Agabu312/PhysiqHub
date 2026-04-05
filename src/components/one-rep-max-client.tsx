"use client";

import { Gauge, Trash2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AdSlot } from "@/components/ad-slot";
import { ToolPageHeader } from "@/components/tool/tool-accent";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createId } from "@/lib/id";
import {
  oneRmAverage,
  oneRmBrzycki,
  oneRmEpley,
  oneRmLombardi,
  STRENGTH_ZONES,
  TRAINING_PERCENT_ROWS,
  weightAtPercent,
} from "@/lib/one-rep";
import { getItem, setItem, STORAGE_KEYS } from "@/lib/storage";
import type { OneRepHistoryEntry } from "@/lib/types";
import { toolInlineAd } from "@/config/ads.config";

function loadHistory(): OneRepHistoryEntry[] {
  const raw = getItem(STORAGE_KEYS.oneRepHistory);
  if (!raw) return [];
  try {
    const arr = JSON.parse(raw) as unknown;
    if (!Array.isArray(arr)) return [];
    return arr.filter((x): x is OneRepHistoryEntry => typeof x?.id === "string");
  } catch {
    return [];
  }
}

function saveHistory(entries: OneRepHistoryEntry[]) {
  setItem(STORAGE_KEYS.oneRepHistory, JSON.stringify(entries.slice(0, 30)));
}

export function OneRepMaxClient() {
  const [name, setName] = useState("");
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const [history, setHistory] = useState<OneRepHistoryEntry[]>([]);

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  const w = Number(weight);
  const r = Math.floor(Number(reps));
  const valid = weight.trim() !== "" && reps.trim() !== "" && w > 0 && r > 0 && r < 37;

  const estimates = useMemo(() => {
    if (!valid) return null;
    const e = oneRmEpley(w, r);
    const b = oneRmBrzycki(w, r);
    const l = oneRmLombardi(w, r);
    const avg = oneRmAverage(w, r);
    return { epley: e, brzycki: b, lombardi: l, average: avg };
  }, [valid, w, r]);

  const addToHistory = () => {
    if (!valid || !estimates) return;
    const entry: OneRepHistoryEntry = {
      id: createId(),
      exerciseName: name.trim() || "Lift",
      weightKg: w,
      reps: r,
      epley: Math.round(estimates.epley * 10) / 10,
      brzycki: Math.round(estimates.brzycki * 10) / 10,
      lombardi: Math.round(estimates.lombardi * 10) / 10,
      average: estimates.average,
      savedAt: new Date().toISOString(),
    };
    const next = [entry, ...loadHistory()];
    saveHistory(next);
    setHistory(next);
  };

  const remove = useCallback((id: string) => {
    const next = loadHistory().filter((x) => x.id !== id);
    saveHistory(next);
    setHistory(next);
  }, []);

  const oneRm = estimates?.average ?? 0;

  return (
    <div className="space-y-8">
      <ToolPageHeader
        category="oneRm"
        title="1RM calculator"
        subtitle="Three classic estimators (Epley, Brzycki, Lombardi) plus an average. For planning loads—not ego singles."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card variant="strong" className="border-cat-strength/20 p-6 transition duration-300 hover:-translate-y-0.5 md:p-8">
          <CardHeader className="!mb-4">
            <CardTitle>Inputs</CardTitle>
            <CardDescription>Weight in kg; reps between 1–36 for Brzycki stability.</CardDescription>
          </CardHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="ex">Exercise name</Label>
              <Input
                id="ex"
                className="mt-2"
                placeholder="e.g. Back squat"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="kg">Weight (kg)</Label>
                <Input
                  id="kg"
                  className="mt-2"
                  inputMode="decimal"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="reps">Reps</Label>
                <Input
                  id="reps"
                  className="mt-2"
                  inputMode="numeric"
                  value={reps}
                  onChange={(e) => setReps(e.target.value)}
                />
              </div>
            </div>
            <Button type="button" onClick={addToHistory} disabled={!valid}>
              Save to history
            </Button>
          </div>
        </Card>

        <Card className="border-cat-strength/15 p-6 transition duration-300 hover:-translate-y-0.5 md:p-8">
          <CardHeader className="!mb-4">
            <CardTitle>Estimates</CardTitle>
            <CardDescription>Shown in kg. Average is the recommended planning value here.</CardDescription>
          </CardHeader>
          {estimates ? (
            <dl className="space-y-3 text-sm">
              <Row label="Epley" value={`${estimates.epley.toFixed(1)} kg`} />
              <Row label="Brzycki" value={`${estimates.brzycki.toFixed(1)} kg`} />
              <Row label="Lombardi" value={`${estimates.lombardi.toFixed(1)} kg`} />
              <div className="rounded-xl border border-cat-strength/35 bg-cat-strength/10 px-4 py-3">
                <dt className="text-xs font-semibold uppercase tracking-wider text-cat-strength">
                  Recommended average
                </dt>
                <dd className="mt-1 text-2xl font-semibold text-foreground">{estimates.average} kg</dd>
              </div>
            </dl>
          ) : (
            <div className="flex flex-col items-center rounded-2xl border border-dashed border-cat-strength/35 bg-cat-strength/5 py-12 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cat-strength/15 text-cat-strength ring-1 ring-cat-strength/25">
                <Gauge className="h-7 w-7" aria-hidden />
              </div>
              <p className="mt-4 text-sm font-medium text-foreground">Waiting for inputs</p>
              <p className="mt-2 max-w-xs px-4 text-sm text-muted leading-relaxed">
                Add load and reps—three estimators and a planning average appear instantly.
              </p>
            </div>
          )}
        </Card>
      </div>

      {estimates ? (
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <Card className="p-6">
            <CardHeader className="!mb-4">
              <CardTitle>Strength zones</CardTitle>
              <CardDescription>Approximate load targets as % of estimated 1RM.</CardDescription>
            </CardHeader>
            <ul className="space-y-3 text-sm">
              {STRENGTH_ZONES.map((z) => (
                <li
                  key={z.pct}
                  className="rounded-xl border border-border bg-surface-elevated/40 px-3 py-2"
                >
                  <span className="font-semibold text-foreground">{z.pct}% · {z.label}</span>
                  <span className="mt-1 block text-muted">{z.description}</span>
                  <span className="mt-1 block text-xs text-cat-strength">
                    ~{weightAtPercent(oneRm, z.pct)} kg
                  </span>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-6">
            <CardHeader className="!mb-4">
              <CardTitle>Common training percentages</CardTitle>
              <CardDescription>Quick reference from 50% to 95%.</CardDescription>
            </CardHeader>
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-border bg-surface-elevated/50 text-xs uppercase tracking-wider text-muted">
                  <tr>
                    <th className="px-3 py-2">%1RM</th>
                    <th className="px-3 py-2">Target load</th>
                  </tr>
                </thead>
                <tbody>
                  {TRAINING_PERCENT_ROWS.map((pct) => (
                    <tr key={pct} className="border-b border-border/80 last:border-0">
                      <td className="px-3 py-2 font-medium text-foreground">{pct}%</td>
                      <td className="px-3 py-2 text-muted">{weightAtPercent(oneRm, pct)} kg</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      ) : null}

      {toolInlineAd.enabled ? (
        <div className="mt-8">
          <AdSlot creative={toolInlineAd.creative} />
        </div>
      ) : null}

      <Card className="mt-8 p-6">
        <CardHeader className="!mb-4">
          <CardTitle>Recent lifts</CardTitle>
          <CardDescription>Stored locally (last 30 entries).</CardDescription>
        </CardHeader>
        {history.length === 0 ? (
          <p className="text-sm text-muted">No saved lifts yet.</p>
        ) : (
          <ul className="space-y-3">
            {history.map((h) => (
              <li
                key={h.id}
                className="flex flex-col gap-3 rounded-2xl border border-border bg-surface-elevated/40 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-semibold text-foreground">{h.exerciseName}</p>
                  <p className="text-sm text-muted">
                    {h.weightKg} kg × {h.reps} · Avg est. {h.average} kg
                  </p>
                  <p className="text-xs text-muted">
                    Epley {h.epley} · Brzycki {h.brzycki} · Lombardi {h.lombardi}
                  </p>
                </div>
                <Button variant="danger" type="button" onClick={() => remove(h.id)} aria-label="Delete">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border py-2 last:border-0">
      <dt className="text-muted">{label}</dt>
      <dd className="font-medium text-foreground">{value}</dd>
    </div>
  );
}
