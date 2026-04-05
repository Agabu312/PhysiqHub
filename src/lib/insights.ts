import type { JournalEntry, ReadinessStatus, UserProfile, WaterDailyLog } from "@/lib/types";
import { goalLabel } from "@/lib/nutrition";
import { localDateKey } from "@/lib/water";

function entriesWithWeight(entries: JournalEntry[]): JournalEntry[] {
  return entries
    .filter((e) => e.weightKg != null && e.weightKg > 0)
    .sort((a, b) => b.date.localeCompare(a.date));
}

/** kg change per week (negative = losing); uses two most recent weighed entries. */
export function weeklyWeightDeltaKg(entries: JournalEntry[]): number | null {
  const w = entriesWithWeight(entries);
  if (w.length < 2) return null;
  const latest = w[0];
  const older = w[1];
  if (latest.weightKg == null || older.weightKg == null) return null;
  const days = Math.max(
    1,
    (new Date(latest.date).getTime() - new Date(older.date).getTime()) / (1000 * 60 * 60 * 24),
  );
  const deltaKg = latest.weightKg - older.weightKg;
  return (deltaKg / days) * 7;
}

export function readinessFromJournal(entries: JournalEntry[]): {
  status: ReadinessStatus;
  title: string;
  detail: string;
} {
  const sorted = sortByDateDesc(entries);
  const latest = sorted[0];
  if (!latest) {
    return {
      status: "maintain",
      title: "Baseline",
      detail: "Log a check-in to unlock your readiness snapshot.",
    };
  }

  const weekly = weeklyWeightDeltaKg(entries);
  const energy = latest.energy;
  const mood = latest.mood;

  if (energy <= 2 && mood <= 2) {
    return {
      status: "recover",
      title: "Recover",
      detail:
        "Latest check-in shows low energy and mood. Prioritize sleep, protein, and a lighter training day.",
    };
  }

  if (weekly != null && weekly < -0.6 && energy <= 3) {
    return {
      status: "recover",
      title: "Recover",
      detail:
        "Weight is moving quickly downward while subjective energy is only moderate. Extra recovery may protect performance.",
    };
  }

  if (energy >= 4 && mood >= 4 && (weekly == null || weekly > -0.35)) {
    return {
      status: "push",
      title: "Push",
      detail:
        "Signals look strong. A modest progression on key lifts or conditioning is reasonable if joints feel good.",
    };
  }

  return {
    status: "maintain",
    title: "Maintain",
    detail:
      "Steady execution wins. Keep nutrition consistent, hydrate, and repeat last week’s successful sessions.",
  };
}

function sortByDateDesc(entries: JournalEntry[]): JournalEntry[] {
  return [...entries].sort((a, b) => {
    if (a.date === b.date) return b.createdAt.localeCompare(a.createdAt);
    return b.date.localeCompare(a.date);
  });
}

export function adaptiveSuggestion(input: {
  profile: UserProfile | null;
  water: WaterDailyLog | null;
  entries: JournalEntry[];
}): { title: string; body: string } {
  const { profile, water, entries } = input;
  const sorted = sortByDateDesc(entries);
  const latest = sorted[0];
  const today = localDateKey();

  if (water && water.date === today && water.targetMl > 0) {
    const pct = water.consumedMl / water.targetMl;
    if (pct < 0.45) {
      return {
        title: "Hydration gap",
        body: "You’re under your hydration target today; perceived energy and focus often dip before strength does. Aim for steady sips through the afternoon.",
      };
    }
  }

  if (profile?.goal === "lose_fat") {
    const weekly = weeklyWeightDeltaKg(entries);
    if (weekly != null && weekly < -0.75 && latest && latest.energy <= 3) {
      return {
        title: "Deficit check",
        body: "Energy is soft while weight is dropping quickly. A slightly smaller deficit for a week can preserve training quality without undoing progress.",
      };
    }
  }

  if (profile?.goal === "muscle_gain" || profile?.goal === "recomp") {
    if (
      latest &&
      (latest.workoutPerformance.toLowerCase().includes("strong") ||
        latest.workoutPerformance.toLowerCase().includes("pr") ||
        latest.workoutPerformance.toLowerCase().includes("great"))
    ) {
      return {
        title: "Strength focus",
        body: "Strength focus detected: prioritize sleep and heavier compounds this week. Keep accessories lighter if recovery is the limiter.",
      };
    }
  }

  if (profile) {
    return {
      title: `Aligned with ${goalLabel(profile.goal)}`,
      body: `Your profile is tuned for ${goalLabel(profile.goal).toLowerCase()}. Use the macro calculator for targets, then track water and one short journal line daily.`,
    };
  }

  return {
    title: "Start with structure",
    body: "Complete onboarding and log one check-in. PhysiquHub personalizes suggestions from your goal, hydration, and how you actually feel in training.",
  };
}
