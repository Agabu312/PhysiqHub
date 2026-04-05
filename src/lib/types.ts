export type Gender = "male" | "female";

export type ActivityLevel =
  | "sedentary"
  | "light"
  | "moderate"
  | "active"
  | "very_active";

export type TrainingExperience = "beginner" | "intermediate" | "advanced";

export type Goal = "lose_fat" | "maintain" | "muscle_gain" | "recomp" | "general_health";

export type Climate = "temperate" | "hot" | "cold";

/** Stored app profile (onboarding + settings). Extended fields are optional for backward compatibility. */
export type ProfileVisibility = "private" | "public";

export type UserProfile = {
  gender: Gender;
  age: number;
  heightCm: number;
  weightKg: number;
  activityLevel: ActivityLevel;
  goal: Goal;
  trainingExperience: TrainingExperience;
  bodyFatPercent?: number | null;
  completedAt: string;
  /** Display name for future community / UI */
  displayName?: string;
  region?: string;
  language?: string;
  profileVisibility?: ProfileVisibility;
};

export type MacroScenario = {
  label: string;
  calories: number;
  proteinG: number;
  carbG: number;
  fatG: number;
  proteinKcal: number;
  carbKcal: number;
  fatKcal: number;
};

export type MacroResults = {
  computedAt: string;
  bmr: number;
  tdee: number;
  fatLoss: MacroScenario;
  maintenance: MacroScenario;
  muscleGain: MacroScenario;
};

export type WaterDailyLog = {
  date: string;
  targetMl: number;
  consumedMl: number;
  climate: Climate;
};

export type JournalEntry = {
  id: string;
  date: string;
  weightKg: number | null;
  mood: number;
  energy: number;
  workoutPerformance: string;
  notes: string;
  createdAt: string;
};

export type ReadinessStatus = "recover" | "maintain" | "push";

/** Tool category for subtle UI accents (see globals.css cat-* colors). */
export type ToolCategory =
  | "macros"
  | "water"
  | "journal"
  | "oneRm"
  | "split"
  | "bodyFat"
  | "settings"
  | "community"
  | "neutral"
  | "profile";

export type OneRepHistoryEntry = {
  id: string;
  exerciseName: string;
  weightKg: number;
  reps: number;
  epley: number;
  brzycki: number;
  lombardi: number;
  average: number;
  savedAt: string;
};

export type SplitEmphasis =
  | "balanced"
  | "upper"
  | "lower"
  | "push_strength"
  | "aesthetics"
  | "fat_loss_support";

export type SplitExercise = { name: string; setsReps: string };

export type SplitDayPlan = {
  dayLabel: string;
  focus: string;
  exercises: SplitExercise[];
  guidance: string;
};

export type GeneratedWorkoutSplit = {
  id: string;
  generatedAt: string;
  title: string;
  summary: string;
  daysPerWeek: number;
  days: SplitDayPlan[];
};

export type SavedWorkoutSplit = GeneratedWorkoutSplit & { savedAt: string; label?: string };

export type BodyFatStoredResult = {
  savedAt: string;
  gender: Gender;
  heightCm: number;
  neckCm: number;
  waistCm: number;
  hipCm: number | null;
  bodyFatPercent: number;
  leanMassKg: number;
  fatMassKg: number;
};
