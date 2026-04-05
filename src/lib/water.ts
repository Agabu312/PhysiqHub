import type { ActivityLevel, Climate, UserProfile } from "@/lib/types";

const CLIMATE_FACTOR: Record<Climate, number> = {
  temperate: 1,
  hot: 1.12,
  cold: 0.94,
};

const ACTIVITY_WATER_FACTOR: Record<ActivityLevel, number> = {
  sedentary: 0.92,
  light: 1,
  moderate: 1.08,
  active: 1.14,
  very_active: 1.22,
};

/** Daily water target in ml (heuristic: ml/kg baseline × modifiers). */
export function waterTargetMl(profile: UserProfile, climate: Climate): number {
  const base = profile.weightKg * 35;
  const withActivity = base * ACTIVITY_WATER_FACTOR[profile.activityLevel];
  const total = withActivity * CLIMATE_FACTOR[climate];
  return Math.round(total / 50) * 50;
}

export function localDateKey(d = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export const GLASS_ML = 250;

export function unitsForTarget(targetMl: number): number {
  return Math.max(4, Math.ceil(targetMl / GLASS_ML));
}
