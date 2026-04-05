import type { ActivityLevel, Gender, Goal, MacroResults, MacroScenario, UserProfile } from "@/lib/types";

const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

export function activityMultiplier(level: ActivityLevel): number {
  return ACTIVITY_MULTIPLIERS[level];
}

/** Mifflin–St Jeor BMR (kcal/day) */
export function bmrMifflinStJeor(
  weightKg: number,
  heightCm: number,
  age: number,
  gender: Gender,
): number {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return gender === "male" ? base + 5 : base - 161;
}

export function tdeeFromBmr(bmr: number, activity: ActivityLevel): number {
  return Math.round(bmr * activityMultiplier(activity));
}

function scenarioFromCalories(
  label: string,
  calories: number,
  weightKg: number,
  goalForSplits: Goal,
): MacroScenario {
  const proteinPerKg = proteinGramsPerKg(goalForSplits);
  const fatPerKg = 0.9;
  const proteinG = Math.round(weightKg * proteinPerKg);
  const fatG = Math.round(weightKg * fatPerKg);
  const proteinKcal = proteinG * 4;
  const fatKcal = fatG * 9;
  let carbG = Math.round((calories - proteinKcal - fatKcal) / 4);
  if (carbG < 0) carbG = 0;
  const carbKcal = carbG * 4;
  return {
    label,
    calories: Math.round(calories),
    proteinG,
    carbG,
    fatG,
    proteinKcal,
    carbKcal,
    fatKcal,
  };
}

function proteinGramsPerKg(goal: Goal): number {
  if (goal === "lose_fat") return 2.2;
  if (goal === "muscle_gain") return 2;
  if (goal === "recomp") return 2;
  if (goal === "general_health") return 1.6;
  return 1.8;
}

export function computeMacroResults(profile: UserProfile): MacroResults {
  const bmr = bmrMifflinStJeor(
    profile.weightKg,
    profile.heightCm,
    profile.age,
    profile.gender,
  );
  const tdee = tdeeFromBmr(bmr, profile.activityLevel);
  const deficit = Math.min(500, Math.round(tdee * 0.2));
  const fatLossCal = Math.max(Math.round(tdee * 0.75), tdee - deficit);
  const muscleCal = tdee + 350;

  return {
    computedAt: new Date().toISOString(),
    bmr: Math.round(bmr),
    tdee,
    fatLoss: scenarioFromCalories("Fat loss", fatLossCal, profile.weightKg, "lose_fat"),
    maintenance: scenarioFromCalories("Maintenance", tdee, profile.weightKg, "maintain"),
    muscleGain: scenarioFromCalories("Muscle gain", muscleCal, profile.weightKg, "muscle_gain"),
  };
}

export function scenarioForGoal(results: MacroResults, goal: Goal): MacroScenario {
  if (goal === "lose_fat") return results.fatLoss;
  if (goal === "muscle_gain") return results.muscleGain;
  if (goal === "recomp") return results.maintenance;
  return results.maintenance;
}

export function goalLabel(goal: Goal): string {
  const map: Record<Goal, string> = {
    lose_fat: "Fat loss",
    maintain: "Maintenance",
    muscle_gain: "Muscle gain",
    recomp: "Body recomposition",
    general_health: "General health",
  };
  return map[goal];
}
