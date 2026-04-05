/** 1RM estimation formulas (submaximal reps). All inputs in kg; returns kg. */

export function oneRmEpley(weightKg: number, reps: number): number {
  if (reps <= 0 || weightKg <= 0) return 0;
  return weightKg * (1 + reps / 30);
}

export function oneRmBrzycki(weightKg: number, reps: number): number {
  if (reps <= 0 || weightKg <= 0) return 0;
  if (reps >= 37) return weightKg * (1 + reps / 30);
  return weightKg * (36 / (37 - reps));
}

export function oneRmLombardi(weightKg: number, reps: number): number {
  if (reps <= 0 || weightKg <= 0) return 0;
  return weightKg * Math.pow(reps, 0.1);
}

export function oneRmAverage(weightKg: number, reps: number): number {
  const a = oneRmEpley(weightKg, reps);
  const b = oneRmBrzycki(weightKg, reps);
  const c = oneRmLombardi(weightKg, reps);
  if (!a && !b && !c) return 0;
  return Math.round(((a + b + c) / 3) * 10) / 10;
}

export type StrengthZone = {
  pct: number;
  label: string;
  description: string;
};

export const STRENGTH_ZONES: StrengthZone[] = [
  { pct: 50, label: "Warm-up / technique", description: "Movement prep and patterning." },
  { pct: 60, label: "Endurance base", description: "Higher reps, lower fatigue per set." },
  { pct: 70, label: "Hypertrophy", description: "Classic muscle-building range." },
  { pct: 80, label: "Strength", description: "Heavy, fewer reps; solid technique required." },
  { pct: 90, label: "Near-max", description: "Peaking; use sparingly with planning." },
  { pct: 95, label: "Max effort zone", description: "Competition-style singles; high fatigue." },
];

export const TRAINING_PERCENT_ROWS = [50, 55, 60, 65, 70, 75, 80, 85, 90, 95] as const;

export function weightAtPercent(oneRmKg: number, pct: number): number {
  if (oneRmKg <= 0) return 0;
  return Math.round(oneRmKg * (pct / 100) * 10) / 10;
}
