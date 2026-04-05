"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { saveProfileToStorage } from "@/lib/profile";
import { markOnboardingComplete } from "@/lib/storage";
import type {
  ActivityLevel,
  Gender,
  Goal,
  TrainingExperience,
  UserProfile,
} from "@/lib/types";

type Draft = {
  gender: Gender | "";
  age: string;
  heightCm: string;
  weightKg: string;
  activityLevel: ActivityLevel | "";
  goal: Goal | "";
  trainingExperience: TrainingExperience | "";
  bodyFatPercent: string;
};

const initialDraft: Draft = {
  gender: "",
  age: "",
  heightCm: "",
  weightKg: "",
  activityLevel: "",
  goal: "",
  trainingExperience: "",
  bodyFatPercent: "",
};

const STEPS = 8;

const activityOptions: { value: ActivityLevel; label: string; hint: string }[] = [
  { value: "sedentary", label: "Sedentary", hint: "Desk work, little movement" },
  { value: "light", label: "Light", hint: "1–3 sessions / week" },
  { value: "moderate", label: "Moderate", hint: "3–5 sessions / week" },
  { value: "active", label: "Active", hint: "6–7 sessions or physical job" },
  { value: "very_active", label: "Very active", hint: "Athlete-level daily demand" },
];

const goalOptions: { value: Goal; label: string }[] = [
  { value: "lose_fat", label: "Lose fat" },
  { value: "maintain", label: "Maintain" },
  { value: "muscle_gain", label: "Build muscle" },
  { value: "recomp", label: "Recomposition" },
  { value: "general_health", label: "General health" },
];

const experienceOptions: { value: TrainingExperience; label: string }[] = [
  { value: "beginner", label: "Beginner (< 1 year consistent)" },
  { value: "intermediate", label: "Intermediate (1–3 years)" },
  { value: "advanced", label: "Advanced (3+ years)" },
];

export function OnboardingFlow() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<Draft>(initialDraft);
  const [error, setError] = useState<string | null>(null);
  const [finishing, setFinishing] = useState(false);

  const progress = useMemo(() => ((step + 1) / STEPS) * 100, [step]);

  const validateStep = useCallback((): boolean => {
    setError(null);
    if (step === 1 && !draft.gender) {
      setError("Select an option to continue.");
      return false;
    }
    if (step === 2) {
      const age = Number(draft.age);
      const h = Number(draft.heightCm);
      const w = Number(draft.weightKg);
      if (!draft.age || Number.isNaN(age) || age < 14 || age > 100) {
        setError("Enter a valid age (14–100).");
        return false;
      }
      if (!draft.heightCm || Number.isNaN(h) || h < 100 || h > 230) {
        setError("Enter height in cm (100–230).");
        return false;
      }
      if (!draft.weightKg || Number.isNaN(w) || w < 35 || w > 300) {
        setError("Enter weight in kg (35–300).");
        return false;
      }
    }
    if (step === 3 && !draft.activityLevel) {
      setError("Pick the activity level that best matches most weeks.");
      return false;
    }
    if (step === 4 && !draft.goal) {
      setError("Choose your primary goal.");
      return false;
    }
    if (step === 5 && !draft.trainingExperience) {
      setError("Select your training experience.");
      return false;
    }
    if (step === 6 && draft.bodyFatPercent.trim() !== "") {
      const bf = Number(draft.bodyFatPercent);
      if (Number.isNaN(bf) || bf < 4 || bf > 60) {
        setError("Body fat should be between 4% and 60%, or leave blank.");
        return false;
      }
    }
    return true;
  }, [draft, step]);

  const goNext = useCallback(() => {
    if (!validateStep()) return;
    if (step < STEPS - 1) setStep((s) => s + 1);
  }, [step, validateStep]);

  const goBack = useCallback(() => {
    setError(null);
    if (step > 0) setStep((s) => s - 1);
  }, [step]);

  const finish = useCallback(() => {
    if (!validateStep()) return;
    setFinishing(true);
    const profile: UserProfile = {
      gender: draft.gender as Gender,
      age: Math.round(Number(draft.age)),
      heightCm: Math.round(Number(draft.heightCm)),
      weightKg: Math.round(Number(draft.weightKg) * 10) / 10,
      activityLevel: draft.activityLevel as ActivityLevel,
      goal: draft.goal as Goal,
      trainingExperience: draft.trainingExperience as TrainingExperience,
      bodyFatPercent:
        draft.bodyFatPercent.trim() === "" ? null : Math.round(Number(draft.bodyFatPercent) * 10) / 10,
      completedAt: new Date().toISOString(),
      displayName: "",
      region: "",
      language: "en",
      profileVisibility: "private",
    };
    markOnboardingComplete();
    saveProfileToStorage(profile);
    requestAnimationFrame(() => {
      router.push("/dashboard");
      router.refresh();
    });
  }, [draft, router, validateStep]);

  return (
    <Card variant="strong" className="overflow-hidden p-0 shadow-2xl shadow-black/50">
      <div className="border-b border-border px-6 py-5 md:px-10">
        <div className="flex items-center justify-between gap-4 text-xs text-muted">
          <span className="font-semibold uppercase tracking-wider text-accent">Onboarding</span>
          <span>
            Step {step + 1} / {STEPS}
          </span>
        </div>
        <div
          className="mt-4 h-1.5 overflow-hidden rounded-full bg-surface-elevated"
          role="progressbar"
          aria-valuenow={step + 1}
          aria-valuemin={1}
          aria-valuemax={STEPS}
          aria-label="Onboarding progress"
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-teal-400 to-violet-400 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="px-6 py-8 md:px-10 md:py-10">
        {error ? (
          <p
            className="mb-6 rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-200"
            role="alert"
          >
            {error}
          </p>
        ) : null}

        <div className="min-h-[280px] transition-opacity duration-300" key={step}>
          {step === 0 && <StepWelcome />}
          {step === 1 && <StepGender draft={draft} setDraft={setDraft} />}
          {step === 2 && <StepMetrics draft={draft} setDraft={setDraft} />}
          {step === 3 && <StepActivity draft={draft} setDraft={setDraft} />}
          {step === 4 && <StepGoal draft={draft} setDraft={setDraft} />}
          {step === 5 && <StepExperience draft={draft} setDraft={setDraft} />}
          {step === 6 && <StepBodyFat draft={draft} setDraft={setDraft} />}
          {step === 7 && <StepReview draft={draft} />}
        </div>

        <div className="mt-10 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Button variant="secondary" onClick={goBack} disabled={step === 0 || finishing}>
            <ChevronLeft className="h-4 w-4" aria-hidden />
            Back
          </Button>
          <div className="flex justify-end gap-3">
            {step < STEPS - 1 ? (
              <Button onClick={goNext} disabled={finishing}>
                Continue
                <ChevronRight className="h-4 w-4" aria-hidden />
              </Button>
            ) : (
              <Button onClick={finish} disabled={finishing}>
                {finishing ? "Saving…" : "Finish & open dashboard"}
                <ChevronRight className="h-4 w-4" aria-hidden />
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

function StepWelcome() {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
        Calibrate PhysiquHub to you
      </h1>
      <p className="mt-3 text-muted leading-relaxed">
        We will capture the essentials—demographics, training load, and intent—so calculators and
        suggestions feel grounded. Everything saves to this browser only.
      </p>
      <ul className="mt-6 space-y-3 text-sm text-foreground/90">
        <li className="flex gap-2">
          <span className="text-accent">✓</span>
          Required fields keep recommendations honest; optional body fat sharpens context.
        </li>
        <li className="flex gap-2">
          <span className="text-accent">✓</span>
          You can revisit onboarding anytime from the mobile “More” menu.
        </li>
      </ul>
    </div>
  );
}

function StepGender({
  draft,
  setDraft,
}: {
  draft: Draft;
  setDraft: Dispatch<SetStateAction<Draft>>;
}) {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">Biological sex</h1>
      <p className="mt-3 text-muted leading-relaxed">
        Used only for metabolic estimation (Mifflin–St Jeor). Choose the formula that best matches
        your physiology.
      </p>
      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {(
          [
            { value: "male" as const, label: "Male" },
            { value: "female" as const, label: "Female" },
          ] as const
        ).map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => setDraft((d) => ({ ...d, gender: opt.value }))}
            className={`rounded-2xl border px-5 py-4 text-left text-sm font-semibold transition ${
              draft.gender === opt.value
                ? "border-accent bg-accent-soft text-accent shadow-[inset_0_0_0_1px_rgba(45,212,191,0.25)]"
                : "border-border bg-surface-elevated/40 text-foreground hover:border-border-strong"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function StepMetrics({
  draft,
  setDraft,
}: {
  draft: Draft;
  setDraft: Dispatch<SetStateAction<Draft>>;
}) {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">Body metrics</h1>
      <p className="mt-3 text-muted leading-relaxed">Metric units keep the math consistent across tools.</p>
      <div className="mt-8 grid gap-5 sm:grid-cols-3">
        <div>
          <Label htmlFor="age">Age (years)</Label>
          <Input
            id="age"
            className="mt-2"
            inputMode="numeric"
            placeholder="e.g. 28"
            value={draft.age}
            onChange={(e) => setDraft((d) => ({ ...d, age: e.target.value }))}
          />
        </div>
        <div>
          <Label htmlFor="height">Height (cm)</Label>
          <Input
            id="height"
            className="mt-2"
            inputMode="decimal"
            placeholder="e.g. 178"
            value={draft.heightCm}
            onChange={(e) => setDraft((d) => ({ ...d, heightCm: e.target.value }))}
          />
        </div>
        <div>
          <Label htmlFor="weight">Weight (kg)</Label>
          <Input
            id="weight"
            className="mt-2"
            inputMode="decimal"
            placeholder="e.g. 76.5"
            value={draft.weightKg}
            onChange={(e) => setDraft((d) => ({ ...d, weightKg: e.target.value }))}
          />
        </div>
      </div>
    </div>
  );
}

function StepActivity({
  draft,
  setDraft,
}: {
  draft: Draft;
  setDraft: Dispatch<SetStateAction<Draft>>;
}) {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
        Activity level
      </h1>
      <p className="mt-3 text-muted leading-relaxed">
        This scales your estimated maintenance calories (TDEE). When in doubt, choose the lower option.
      </p>
      <div className="mt-8 grid gap-2">
        {activityOptions.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => setDraft((d) => ({ ...d, activityLevel: opt.value }))}
            className={`rounded-2xl border px-4 py-3 text-left transition ${
              draft.activityLevel === opt.value
                ? "border-accent bg-accent-soft text-accent"
                : "border-border bg-surface-elevated/40 hover:border-border-strong"
            }`}
          >
            <span className="block text-sm font-semibold text-foreground">{opt.label}</span>
            <span className="mt-0.5 block text-xs text-muted">{opt.hint}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function StepGoal({
  draft,
  setDraft,
}: {
  draft: Draft;
  setDraft: Dispatch<SetStateAction<Draft>>;
}) {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">Primary goal</h1>
      <p className="mt-3 text-muted leading-relaxed">
        We will tune copy and defaults around this choice. You can still view all calorie scenarios
        later.
      </p>
      <div className="mt-8 grid gap-2 sm:grid-cols-2">
        {goalOptions.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => setDraft((d) => ({ ...d, goal: opt.value }))}
            className={`rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition ${
              draft.goal === opt.value
                ? "border-accent bg-accent-soft text-accent"
                : "border-border bg-surface-elevated/40 text-foreground hover:border-border-strong"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function StepExperience({
  draft,
  setDraft,
}: {
  draft: Draft;
  setDraft: Dispatch<SetStateAction<Draft>>;
}) {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
        Training experience
      </h1>
      <p className="mt-3 text-muted leading-relaxed">
        Helps us phrase guidance responsibly as we add programming tools.
      </p>
      <div className="mt-8 grid gap-2">
        {experienceOptions.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => setDraft((d) => ({ ...d, trainingExperience: opt.value }))}
            className={`rounded-2xl border px-4 py-3 text-left text-sm font-medium transition ${
              draft.trainingExperience === opt.value
                ? "border-accent bg-accent-soft text-accent"
                : "border-border bg-surface-elevated/40 text-foreground hover:border-border-strong"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function StepBodyFat({
  draft,
  setDraft,
}: {
  draft: Draft;
  setDraft: Dispatch<SetStateAction<Draft>>;
}) {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
        Body fat (optional)
      </h1>
      <p className="mt-3 text-muted leading-relaxed">
        If you have a recent estimate (DEXA, calipers, or a trusted visual range), add it. Skip if
        unsure.
      </p>
      <div className="mt-8 max-w-xs">
        <Label htmlFor="bf">Body fat %</Label>
        <Input
          id="bf"
          className="mt-2"
          inputMode="decimal"
          placeholder="e.g. 18"
          value={draft.bodyFatPercent}
          onChange={(e) => setDraft((d) => ({ ...d, bodyFatPercent: e.target.value }))}
        />
      </div>
    </div>
  );
}

function formatGoalLabel(g: Goal): string {
  return goalOptions.find((x) => x.value === g)?.label ?? g;
}

function activityLabel(a: ActivityLevel): string {
  return activityOptions.find((x) => x.value === a)?.label ?? a;
}

function StepReview({ draft }: { draft: Draft }) {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
        You are ready
      </h1>
      <p className="mt-3 text-muted leading-relaxed">
        We will save this profile locally and open your dashboard with personalized panels.
      </p>
      <dl className="mt-8 grid gap-3 text-sm">
        <ReviewRow label="Sex" value={draft.gender === "male" ? "Male" : "Female"} />
        <ReviewRow label="Age" value={`${draft.age} yrs`} />
        <ReviewRow label="Height" value={`${draft.heightCm} cm`} />
        <ReviewRow label="Weight" value={`${draft.weightKg} kg`} />
        <ReviewRow
          label="Activity"
          value={draft.activityLevel ? activityLabel(draft.activityLevel) : "—"}
        />
        <ReviewRow
          label="Goal"
          value={draft.goal ? formatGoalLabel(draft.goal) : "—"}
        />
        <ReviewRow
          label="Experience"
          value={
            experienceOptions.find((x) => x.value === draft.trainingExperience)?.label ?? "—"
          }
        />
        <ReviewRow
          label="Body fat"
          value={draft.bodyFatPercent.trim() ? `${draft.bodyFatPercent}%` : "Not set"}
        />
      </dl>
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-surface-elevated/30 px-4 py-3">
      <dt className="text-muted">{label}</dt>
      <dd className="font-medium text-foreground">{value}</dd>
    </div>
  );
}
