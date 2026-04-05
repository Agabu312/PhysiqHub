"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Globe, Lock, Sparkles, Target, User, Users, Zap } from "lucide-react";
import { ToolPageHeader } from "@/components/tool/tool-accent";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loadProfileFromStorage, saveProfileToStorage } from "@/lib/profile";
import type {
  ActivityLevel,
  Gender,
  Goal,
  ProfileVisibility,
  TrainingExperience,
  UserProfile,
} from "@/lib/types";
import { markOnboardingComplete } from "@/lib/storage";
import { cn } from "@/lib/cn";

const ACTIVITY_OPTS: { value: ActivityLevel; label: string; desc: string }[] = [
  { value: "sedentary", label: "Sedentary", desc: "Mostly desk-bound, minimal movement" },
  { value: "light", label: "Light", desc: "Some walking or casual activity" },
  { value: "moderate", label: "Moderate", desc: "Regular activity during the week" },
  { value: "active", label: "Active", desc: "Frequent training or active routine" },
  { value: "very_active", label: "Very active", desc: "High training volume or physically demanding days" },
];

const GOAL_OPTS: { value: Goal; label: string; desc: string }[] = [
  { value: "lose_fat", label: "Lose fat", desc: "Prioritize a sustainable deficit" },
  { value: "maintain", label: "Maintain", desc: "Keep performance and bodyweight steady" },
  { value: "muscle_gain", label: "Build muscle", desc: "Support growth and recovery" },
  { value: "recomp", label: "Recomposition", desc: "Improve composition gradually" },
  { value: "general_health", label: "General health", desc: "Keep habits balanced and realistic" },
];

const EXP_OPTS: { value: TrainingExperience; label: string; desc: string }[] = [
  { value: "beginner", label: "Beginner", desc: "Still learning the basics" },
  { value: "intermediate", label: "Intermediate", desc: "Comfortable with training structure" },
  { value: "advanced", label: "Advanced", desc: "Experienced and training intentionally" },
];

const LANG_OPTS = [
  { value: "en", label: "English", desc: "Primary UI language for now" },
  { value: "es", label: "Español", desc: "Reserved for later UI localization" },
  { value: "fr", label: "Français", desc: "Reserved for later UI localization" },
];

function SegmentedCards<T extends string>({
  value,
  options,
  onChange,
  columns = "sm:grid-cols-2",
}: {
  value: T;
  options: { value: T; label: string; desc?: string }[];
  onChange: (value: T) => void;
  columns?: string;
}) {
  return (
    <div className={cn("mt-2 grid gap-2", columns)}>
      {options.map((option) => {
        const active = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              "rounded-2xl border px-4 py-3 text-left transition-all duration-200",
              "hover:-translate-y-0.5 hover:border-border-strong hover:bg-surface-elevated/55",
              active
                ? "border-cat-settings/40 bg-cat-settings/12 text-foreground shadow-[0_0_30px_-18px_rgba(45,212,191,0.45)]"
                : "border-border bg-surface-elevated/30 text-muted",
            )}
          >
            <div className="text-sm font-semibold">{option.label}</div>
            {option.desc ? <div className="mt-1 text-xs leading-relaxed text-muted">{option.desc}</div> : null}
          </button>
        );
      })}
    </div>
  );
}

export function SettingsClient() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [savedMsg, setSavedMsg] = useState<string | null>(null);
  const [draft, setDraft] = useState<UserProfile | null>(null);

  useEffect(() => {
    const p = loadProfileFromStorage();
    if (!p) {
      setDraft(null);
      return;
    }
    setDraft({ ...p });
  }, []);

  const update = <K extends keyof UserProfile>(key: K, value: UserProfile[K]) => {
    setDraft((d) => (d ? { ...d, [key]: value } : d));
    setSavedMsg(null);
  };

  const save = () => {
    if (!draft) return;
    setError(null);
    const age = draft.age;
    const h = draft.heightCm;
    const w = draft.weightKg;
    if (age < 14 || age > 120) {
      setError("Age must be between 14 and 120.");
      return;
    }
    if (h < 100 || h > 250) {
      setError("Height (cm) looks out of range.");
      return;
    }
    if (w < 35 || w > 300) {
      setError("Weight (kg) looks out of range.");
      return;
    }
    const next: UserProfile = {
      ...draft,
      completedAt: draft.completedAt || new Date().toISOString(),
      profileVisibility: draft.profileVisibility === "public" ? "public" : "private",
      displayName: draft.displayName?.trim() ?? "",
      region: draft.region?.trim() ?? "",
      language: draft.language || "en",
    };
    saveProfileToStorage(next);
    markOnboardingComplete();
    setSavedMsg("Settings saved to this device.");
    router.refresh();
  };

  if (!draft) {
    return (
      <div>
        <ToolPageHeader
          category="settings"
          title="Settings"
          subtitle="Complete onboarding first so we have a baseline profile to edit."
        />
        <Card className="p-8">
          <p className="text-muted">No profile on this device yet.</p>
          <Link
            href="/onboarding"
            className="mt-4 inline-flex rounded-full bg-accent px-6 py-2 text-sm font-semibold text-background"
          >
            Go to onboarding
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <ToolPageHeader
        category="settings"
        title="Settings"
        subtitle="Edit preferences and body stats stored in your browser. Your read-only overview lives on Profile."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card variant="strong" className="p-6 md:p-8">
            <CardHeader className="!mb-6">
              <CardTitle>Identity & demographics</CardTitle>
              <CardDescription>Used by calculators and future personalization.</CardDescription>
            </CardHeader>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Label htmlFor="dn">Display name</Label>
                <Input
                  id="dn"
                  className="mt-2"
                  value={draft.displayName ?? ""}
                  onChange={(e) => update("displayName", e.target.value)}
                  placeholder="How you want to appear locally"
                />
              </div>

              <div className="sm:col-span-2">
                <Label>Gender</Label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(["male", "female"] as Gender[]).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => update("gender", g)}
                      className={cn(
                        "rounded-full border px-4 py-2 text-sm font-medium transition",
                        draft.gender === g
                          ? "border-cat-settings bg-cat-settings/15 text-cat-settings shadow-[0_0_24px_-14px_rgba(45,212,191,0.45)]"
                          : "border-border text-muted hover:border-border-strong hover:bg-surface-elevated/40",
                      )}
                    >
                      {g === "male" ? "Male" : "Female"}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  className="mt-2"
                  inputMode="numeric"
                  value={String(draft.age)}
                  onChange={(e) => update("age", Number(e.target.value) || 0)}
                />
              </div>

              <div>
                <Label htmlFor="h">Height (cm)</Label>
                <Input
                  id="h"
                  className="mt-2"
                  inputMode="decimal"
                  value={String(draft.heightCm)}
                  onChange={(e) => update("heightCm", Number(e.target.value) || 0)}
                />
              </div>

              <div>
                <Label htmlFor="w">Weight (kg)</Label>
                <Input
                  id="w"
                  className="mt-2"
                  inputMode="decimal"
                  value={String(draft.weightKg)}
                  onChange={(e) => update("weightKg", Number(e.target.value) || 0)}
                />
              </div>
            </div>
          </Card>

          <Card className="p-6 md:p-8">
            <CardHeader className="!mb-6">
              <CardTitle>Training & goals</CardTitle>
              <CardDescription>Choose the baseline that shapes calculators and recommendations.</CardDescription>
            </CardHeader>

            <div className="space-y-6">
              <div>
                <Label>Activity level</Label>
                <SegmentedCards<ActivityLevel>
                  value={draft.activityLevel}
                  options={ACTIVITY_OPTS}
                  onChange={(value) => update("activityLevel", value)}
                />
              </div>

              <div>
                <Label>Primary goal</Label>
                <SegmentedCards<Goal>
                  value={draft.goal}
                  options={GOAL_OPTS}
                  onChange={(value) => update("goal", value)}
                />
              </div>

              <div>
                <Label>Training experience</Label>
                <SegmentedCards<TrainingExperience>
                  value={draft.trainingExperience}
                  options={EXP_OPTS}
                  onChange={(value) => update("trainingExperience", value)}
                  columns="sm:grid-cols-3"
                />
              </div>

              <div>
                <Label htmlFor="bf">Body fat % (optional)</Label>
                <Input
                  id="bf"
                  className="mt-2"
                  inputMode="decimal"
                  placeholder="Leave blank if unknown"
                  value={
                    draft.bodyFatPercent == null || Number.isNaN(draft.bodyFatPercent as number)
                      ? ""
                      : String(draft.bodyFatPercent)
                  }
                  onChange={(e) => {
                    const v = e.target.value.trim();
                    update("bodyFatPercent", v === "" ? null : Number(v));
                  }}
                />
              </div>
            </div>
          </Card>

          <Card className="p-6 md:p-8">
            <CardHeader className="!mb-6">
              <CardTitle>Locale & future sharing</CardTitle>
              <CardDescription>
                Region and language prepare filters for a future network-enabled build.
              </CardDescription>
            </CardHeader>

            <div className="space-y-6">
              <div>
                <Label htmlFor="region">Region (free text)</Label>
                <Input
                  id="region"
                  className="mt-2"
                  placeholder="e.g. US-West, EU, APAC"
                  value={draft.region ?? ""}
                  onChange={(e) => update("region", e.target.value)}
                />
              </div>

              <div>
                <Label>Language preference</Label>
                <SegmentedCards<string>
                  value={draft.language ?? "en"}
                  options={LANG_OPTS}
                  onChange={(value) => update("language", value)}
                  columns="sm:grid-cols-3"
                />
              </div>

              <div>
                <Label>Profile visibility</Label>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => update("profileVisibility", "private" as ProfileVisibility)}
                    className={cn(
                      "rounded-2xl border p-4 text-left transition-all duration-200",
                      "hover:-translate-y-0.5 hover:border-border-strong hover:bg-surface-elevated/45",
                      (draft.profileVisibility ?? "private") === "private"
                        ? "border-emerald-400/35 bg-emerald-500/10 shadow-[0_0_32px_-18px_rgba(16,185,129,0.35)]"
                        : "border-border bg-surface-elevated/30",
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/12 ring-1 ring-emerald-400/20">
                        <Lock className="h-5 w-5 text-emerald-300" />
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">Private</div>
                        <p className="mt-1 text-sm leading-relaxed text-muted">
                          Recommended default. Your profile stays on-device only in this version.
                        </p>
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => update("profileVisibility", "public" as ProfileVisibility)}
                    className={cn(
                      "rounded-2xl border p-4 text-left transition-all duration-200",
                      "hover:-translate-y-0.5 hover:border-border-strong hover:bg-surface-elevated/45",
                      draft.profileVisibility === "public"
                        ? "border-sky-400/35 bg-sky-500/10 shadow-[0_0_32px_-18px_rgba(56,189,248,0.35)]"
                        : "border-border bg-surface-elevated/30",
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/12 ring-1 ring-sky-400/20">
                        <Users className="h-5 w-5 text-sky-300" />
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">Public</div>
                        <p className="mt-1 text-sm leading-relaxed text-muted">
                          In a future network-enabled version, public profiles may be discoverable by other
                          users who opt in, filtered by region and language.
                        </p>
                        <p className="mt-2 text-sm leading-relaxed text-muted">
                          You can switch back to Private anytime. No live directory exists in this local-only build—see{" "}
                          <Link href="/community" className="text-accent underline-offset-4 hover:underline">
                            Community preview
                          </Link>
                          .
                        </p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </Card>

          {error ? (
            <p className="rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </p>
          ) : null}

          {savedMsg ? (
            <p className="rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
              {savedMsg}
            </p>
          ) : null}

          <Button type="button" onClick={save}>
            Save settings
          </Button>
        </div>

        <div className="space-y-6">
          <Card className="border-dashed border-cat-settings/40 p-6">
            <CardHeader className="!mb-2">
              <CardTitle className="!text-base">Coming later</CardTitle>
              <CardDescription>Hooks reserved for gamification—no logic yet.</CardDescription>
            </CardHeader>
            <ul className="space-y-3 text-sm text-muted">
              <li>
                <strong className="text-foreground">Medals / achievements:</strong> local badges for
                consistency milestones (hydration streaks, journal streaks).
              </li>
              <li>
                <strong className="text-foreground">Weekly quests:</strong> small, realistic targets
                that sync with your goal (steps, sessions, protein).
              </li>
            </ul>
            <p className="mt-4 text-xs text-muted">
              TODO (future): persist quest state in IndexedDB; optional server reconciliation when
              accounts launch.
            </p>
          </Card>

          <Card className="p-6">
            <CardHeader className="!mb-2">
              <CardTitle className="!text-base">Legal</CardTitle>
            </CardHeader>
            <ul className="space-y-2 text-sm text-muted">
              <li>
                <Link href="/legal/terms" className="text-accent hover:underline">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/legal/privacy" className="text-accent hover:underline">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}