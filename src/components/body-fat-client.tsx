"use client";

import { Ruler } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { AdSlot } from "@/components/ad-slot";
import { ToolPageHeader } from "@/components/tool/tool-accent";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  bodyFatCategory,
  compositionFromBf,
  navyBodyFatPercent,
} from "@/lib/body-fat-navy";
import { loadProfileFromStorage } from "@/lib/profile";
import { getItem, setItem, STORAGE_KEYS } from "@/lib/storage";
import type { BodyFatStoredResult, Gender } from "@/lib/types";
import { toolInlineAd } from "@/config/ads.config";

export function BodyFatClient() {
  const profile = useMemo(() => loadProfileFromStorage(), []);
  const [gender, setGender] = useState<Gender>(profile?.gender ?? "male");
  const [heightCm, setHeightCm] = useState(profile ? String(profile.heightCm) : "");
  const [neckCm, setNeckCm] = useState("");
  const [waistCm, setWaistCm] = useState("");
  const [hipCm, setHipCm] = useState("");
  const [weightKg, setWeightKg] = useState(profile ? String(profile.weightKg) : "");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<BodyFatStoredResult | null>(null);

  useEffect(() => {
    const raw = getItem(STORAGE_KEYS.bodyFatLatest);
    if (!raw) return;
    try {
      const o = JSON.parse(raw) as BodyFatStoredResult;
      if (typeof o.bodyFatPercent === "number") setResult(o);
    } catch {
      /* ignore */
    }
  }, []);

  const compute = () => {
    setError(null);
    const h = Number(heightCm);
    const n = Number(neckCm);
    const w = Number(waistCm);
    const hip = gender === "female" ? Number(hipCm) : null;
    const bw = Number(weightKg);
    if (!h || !n || !w || !bw) {
      setError("Height, neck, waist, and weight are required (use cm and kg).");
      return;
    }
    if (gender === "female" && (!hip || Number.isNaN(hip))) {
      setError("Hip circumference is required for the female Navy formula.");
      return;
    }
    const navy = navyBodyFatPercent({
      gender,
      heightCm: h,
      neckCm: n,
      waistCm: w,
      hipCm: gender === "female" ? hip : null,
    });
    if (!navy) {
      setError(
        "Could not compute—check that waist is larger than neck (and for women, waist + hip > neck).",
      );
      return;
    }
    const { leanKg, fatKg } = compositionFromBf(bw, navy.percent);
    const stored: BodyFatStoredResult = {
      savedAt: new Date().toISOString(),
      gender,
      heightCm: h,
      neckCm: n,
      waistCm: w,
      hipCm: gender === "female" ? hip : null,
      bodyFatPercent: navy.percent,
      leanMassKg: leanKg,
      fatMassKg: fatKg,
    };
    setResult(stored);
    setItem(STORAGE_KEYS.bodyFatLatest, JSON.stringify(stored));
  };

  const cat = result ? bodyFatCategory(result.gender, result.bodyFatPercent) : null;

  return (
    <div className="space-y-8">
      <ToolPageHeader
        category="bodyFat"
        title="Body fat estimator"
        subtitle="Navy circumference method (metric). Useful for tracking trends—not a medical diagnosis."
      />

      <Card variant="strong" className="mb-6 border-cat-composition/25 p-5">
        <p className="text-sm text-muted leading-relaxed">
          <strong className="text-foreground">Disclaimer:</strong> Estimates depend on measurement
          technique and individual variation. This is not medical advice. For health concerns, consult a
          licensed professional.
        </p>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-cat-composition/15 p-6 transition duration-300 hover:-translate-y-0.5 md:p-8">
          <CardHeader className="!mb-4">
            <CardTitle>Measurements</CardTitle>
            <CardDescription>All lengths in centimeters. Measure consistently—same time of day.</CardDescription>
          </CardHeader>
          <div className="space-y-4">
            <div>
              <Label>Sex (formula)</Label>
              <div className="mt-2 flex gap-2">
                {(["male", "female"] as const).map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGender(g)}
                    className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                      gender === g
                        ? "border-cat-composition bg-cat-composition/15 text-cat-composition"
                        : "border-border text-muted hover:border-border-strong"
                    }`}
                  >
                    {g === "male" ? "Male" : "Female"}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="h">Height (cm)</Label>
              <Input
                id="h"
                className="mt-2"
                inputMode="decimal"
                value={heightCm}
                onChange={(e) => setHeightCm(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="neck">Neck (cm)</Label>
              <Input
                id="neck"
                className="mt-2"
                inputMode="decimal"
                value={neckCm}
                onChange={(e) => setNeckCm(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="waist">Waist (cm) — at navel per Navy protocol</Label>
              <Input
                id="waist"
                className="mt-2"
                inputMode="decimal"
                value={waistCm}
                onChange={(e) => setWaistCm(e.target.value)}
              />
            </div>
            {gender === "female" ? (
              <div>
                <Label htmlFor="hip">Hips (cm) — widest part</Label>
                <Input
                  id="hip"
                  className="mt-2"
                  inputMode="decimal"
                  value={hipCm}
                  onChange={(e) => setHipCm(e.target.value)}
                />
              </div>
            ) : null}
            <div>
              <Label htmlFor="bw">Weight (kg) — for lean / fat mass</Label>
              <Input
                id="bw"
                className="mt-2"
                inputMode="decimal"
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
              />
            </div>
            {error ? (
              <p className="rounded-xl border border-red-500/25 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                {error}
              </p>
            ) : null}
            <Button type="button" onClick={compute}>
              Estimate
            </Button>
          </div>
        </Card>

        <div className="space-y-6">
          {result ? (
            <Card className="border-cat-composition/30 p-6 md:p-8">
              <p className="text-xs font-semibold uppercase tracking-wider text-cat-composition">
                Latest result
              </p>
              <p className="mt-3 text-4xl font-semibold text-foreground">{result.bodyFatPercent}%</p>
              <p className="text-sm text-muted">Estimated body fat (Navy method)</p>
              <dl className="mt-6 space-y-2 text-sm">
                <div className="flex justify-between border-b border-border py-2">
                  <dt className="text-muted">Lean mass</dt>
                  <dd className="font-medium">{result.leanMassKg} kg</dd>
                </div>
                <div className="flex justify-between py-2">
                  <dt className="text-muted">Fat mass</dt>
                  <dd className="font-medium">{result.fatMassKg} kg</dd>
                </div>
              </dl>
              {cat ? (
                <div className="mt-6 rounded-xl border border-border bg-surface-elevated/40 p-4">
                  <p className="text-sm font-semibold text-foreground">{cat.label}</p>
                  <p className="text-xs text-muted">{cat.rangeLabel}</p>
                  <p className="mt-2 text-sm text-muted leading-relaxed">{cat.explanation}</p>
                </div>
              ) : null}
            </Card>
          ) : (
            <Card className="border-dashed border-cat-composition/35 p-8 transition duration-300 hover:-translate-y-0.5">
              <div className="flex flex-col items-center text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cat-composition/15 text-cat-composition ring-1 ring-cat-composition/25">
                  <Ruler className="h-7 w-7" aria-hidden />
                </div>
                <p className="mt-4 text-sm font-medium text-foreground">No estimate yet</p>
                <p className="mt-2 max-w-sm text-sm text-muted leading-relaxed">
                  Enter tape measurements—lean and fat mass estimates appear here. Your last result
                  reloads on the next visit.
                </p>
              </div>
            </Card>
          )}

          <Card className="p-6">
            <CardHeader className="!mb-2">
              <CardTitle>Visual estimate guidance</CardTitle>
              <CardDescription>No photo upload—just practical anchors.</CardDescription>
            </CardHeader>
            <ul className="space-y-3 text-sm text-muted leading-relaxed">
              <li>
                <strong className="text-foreground">Lighting &amp; pump:</strong> Assess leanness in
                neutral lighting, not immediately after training or high-sodium meals.
              </li>
              <li>
                <strong className="text-foreground">Ab visibility:</strong> For many men, faint upper
                abs at rest often aligns with moderate athletic leanness; full separation is rarer and
                harder to sustain.
              </li>
              <li>
                <strong className="text-foreground">Women:</strong> healthy essential fat is higher;
                comparing directly to male photo standards usually overstates “higher” body fat.
              </li>
              <li>
                <strong className="text-foreground">Trends:</strong> mirror + tape + occasional
                estimate beats chasing a single number.
              </li>
            </ul>
          </Card>
        </div>
      </div>

      {toolInlineAd.enabled ? (
        <div className="mt-8">
          <AdSlot creative={toolInlineAd.creative} />
        </div>
      ) : null}
    </div>
  );
}
