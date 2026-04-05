import { getItem, setItem, STORAGE_KEYS } from "@/lib/storage";
import type { ActivityLevel, Goal, TrainingExperience, UserProfile } from "@/lib/types";

const ACTIVITY_LEVELS: ActivityLevel[] = [
  "sedentary",
  "light",
  "moderate",
  "active",
  "very_active",
];

const GOALS: Goal[] = ["lose_fat", "maintain", "muscle_gain", "recomp", "general_health"];

const EXPERIENCE: TrainingExperience[] = ["beginner", "intermediate", "advanced"];

export function isCompleteProfile(p: unknown): p is UserProfile {
  if (!p || typeof p !== "object") return false;
  const o = p as Record<string, unknown>;
  return (
    (o.gender === "male" || o.gender === "female") &&
    typeof o.age === "number" &&
    o.age > 0 &&
    o.age < 120 &&
    typeof o.heightCm === "number" &&
    o.heightCm > 50 &&
    o.heightCm < 280 &&
    typeof o.weightKg === "number" &&
    o.weightKg > 25 &&
    o.weightKg < 400 &&
    typeof o.activityLevel === "string" &&
    ACTIVITY_LEVELS.includes(o.activityLevel as ActivityLevel) &&
    typeof o.goal === "string" &&
    GOALS.includes(o.goal as Goal) &&
    typeof o.trainingExperience === "string" &&
    EXPERIENCE.includes(o.trainingExperience as TrainingExperience) &&
    typeof o.completedAt === "string"
  );
}

/** Defaults for settings fields added after v1 onboarding (backward compatible). */
export function normalizeStoredProfile(p: UserProfile): UserProfile {
  const visibility =
    p.profileVisibility === "public" || p.profileVisibility === "private"
      ? p.profileVisibility
      : "private";
  return {
    ...p,
    displayName: typeof p.displayName === "string" ? p.displayName : "",
    region: typeof p.region === "string" ? p.region : "",
    language: typeof p.language === "string" && p.language ? p.language : "en",
    profileVisibility: visibility,
  };
}

export function loadProfileFromStorage(): UserProfile | null {
  const raw = getItem(STORAGE_KEYS.profile);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as unknown;
    return isCompleteProfile(parsed) ? normalizeStoredProfile(parsed) : null;
  } catch {
    return null;
  }
}

export function saveProfileToStorage(profile: UserProfile): void {
  setItem(STORAGE_KEYS.profile, JSON.stringify(normalizeStoredProfile(profile)));
}
