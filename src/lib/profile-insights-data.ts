import { loadJournalEntries, sortEntriesByDateDesc } from "@/lib/journal-storage";
import { computeMacroResults, scenarioForGoal } from "@/lib/nutrition";
import { loadProfileFromStorage } from "@/lib/profile";
import { getItem, STORAGE_KEYS } from "@/lib/storage";
import type {
  BodyFatStoredResult,
  Climate,
  JournalEntry,
  MacroResults,
  OneRepHistoryEntry,
  SavedWorkoutSplit,
  UserProfile,
  WaterDailyLog,
} from "@/lib/types";
import { localDateKey, waterTargetMl } from "@/lib/water";

export type InsightCategoryId =
  | "mood"
  | "nutrition"
  | "hydration"
  | "strength"
  | "split"
  | "composition";

export function parseMacroResults(raw: string | null): MacroResults | null {
  if (!raw) return null;
  try {
    const o = JSON.parse(raw) as MacroResults;
    if (typeof o.bmr === "number" && typeof o.tdee === "number") return o;
    return null;
  } catch {
    return null;
  }
}

export function parseWaterLog(raw: string | null): WaterDailyLog | null {
  if (!raw) return null;
  try {
    const o = JSON.parse(raw) as WaterDailyLog;
    if (typeof o.date === "string" && typeof o.targetMl === "number") return o;
    return null;
  } catch {
    return null;
  }
}

export function loadOneRepHistory(): OneRepHistoryEntry[] {
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

export function loadSavedWorkoutSplits(): SavedWorkoutSplit[] {
  const raw = getItem(STORAGE_KEYS.workoutSplitsSaved);
  if (!raw) return [];
  try {
    const arr = JSON.parse(raw) as unknown;
    if (!Array.isArray(arr)) return [];
    return arr.filter((x): x is SavedWorkoutSplit => typeof x?.id === "string");
  } catch {
    return [];
  }
}

export function loadBodyFatLatest(): BodyFatStoredResult | null {
  const raw = getItem(STORAGE_KEYS.bodyFatLatest);
  if (!raw) return null;
  try {
    const o = JSON.parse(raw) as BodyFatStoredResult;
    if (typeof o.bodyFatPercent === "number") return o;
    return null;
  } catch {
    return null;
  }
}

function avg(nums: number[]): number {
  if (!nums.length) return 0;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

/** Compare last N entries vs previous N for mood/energy. */
export function journalMoodEnergyInsight(entries: JournalEntry[]): {
  hasData: boolean;
  recent: JournalEntry[];
  lastNAvg: { mood: number; energy: number } | null;
  prevNAvg: { mood: number; energy: number } | null;
  trendLabel: string | null;
} {
  const sorted = sortEntriesByDateDesc(entries);
  if (!sorted.length) {
    return {
      hasData: false,
      recent: [],
      lastNAvg: null,
      prevNAvg: null,
      trendLabel: null,
    };
  }
  const n = 5;
  const last = sorted.slice(0, n);
  const prev = sorted.slice(n, n * 2);
  const lastNAvg =
    last.length > 0
      ? {
          mood: Math.round(avg(last.map((e) => e.mood)) * 10) / 10,
          energy: Math.round(avg(last.map((e) => e.energy)) * 10) / 10,
        }
      : null;
  const prevNAvg =
    prev.length > 0
      ? {
          mood: Math.round(avg(prev.map((e) => e.mood)) * 10) / 10,
          energy: Math.round(avg(prev.map((e) => e.energy)) * 10) / 10,
        }
      : null;
  let trendLabel: string | null = null;
  if (lastNAvg && prevNAvg) {
    const mDelta = lastNAvg.mood - prevNAvg.mood;
    const eDelta = lastNAvg.energy - prevNAvg.energy;
    if (mDelta > 0.35 || eDelta > 0.35) trendLabel = "Recent check-ins lean brighter than the prior batch.";
    else if (mDelta < -0.35 || eDelta < -0.35) trendLabel = "Recent check-ins are softer than the week before—worth a recovery bias.";
    else trendLabel = "Mood and energy are steady versus your prior window.";
  }
  return {
    hasData: true,
    recent: sorted.slice(0, 8),
    lastNAvg,
    prevNAvg,
    trendLabel,
  };
}

export function resolveWaterToday(
  profile: UserProfile | null,
  water: WaterDailyLog | null,
  climate: Climate,
): WaterDailyLog | null {
  if (!profile) return null;
  const target = waterTargetMl(profile, climate);
  const today = localDateKey();
  if (!water || water.date !== today) {
    return { date: today, targetMl: target, consumedMl: 0, climate };
  }
  if (water.targetMl !== target) return { ...water, targetMl: target };
  return water;
}

export function pickWorkoutSplitHighlights(splits: SavedWorkoutSplit[]): {
  latest: SavedWorkoutSplit | null;
  labeled: SavedWorkoutSplit | null;
} {
  if (!splits.length) return { latest: null, labeled: null };
  const sorted = [...splits].sort((a, b) => b.savedAt.localeCompare(a.savedAt));
  const latest = sorted[0] ?? null;
  const labeled = sorted.find((s) => s.label?.trim()) ?? null;
  return { latest, labeled };
}

export function oneRepHighlights(history: OneRepHistoryEntry[]): {
  recent: OneRepHistoryEntry[];
  bestAverage: { entry: OneRepHistoryEntry; value: number } | null;
} {
  const sorted = [...history].sort((a, b) => b.savedAt.localeCompare(a.savedAt));
  const recent = sorted.slice(0, 6);
  let best: { entry: OneRepHistoryEntry; value: number } | null = null;
  for (const e of sorted) {
    if (!best || e.average > best.value) best = { entry: e, value: e.average };
  }
  return { recent, bestAverage: best };
}

export type ProfileInsightsBundle = {
  profile: UserProfile | null;
  entries: JournalEntry[];
  macrosStored: MacroResults | null;
  waterLog: WaterDailyLog | null;
  climate: Climate;
  oneRepHistory: OneRepHistoryEntry[];
  splits: SavedWorkoutSplit[];
  bodyFat: BodyFatStoredResult | null;
};

export function loadProfileInsightsBundle(): ProfileInsightsBundle {
  const profile = loadProfileFromStorage();
  const entries = sortEntriesByDateDesc(loadJournalEntries());
  const macrosStored = parseMacroResults(getItem(STORAGE_KEYS.macroResults));
  const waterLog = parseWaterLog(getItem(STORAGE_KEYS.waterDaily));
  const cRaw = getItem(STORAGE_KEYS.waterClimate);
  const climate: Climate =
    cRaw === "hot" || cRaw === "cold" || cRaw === "temperate" ? cRaw : "temperate";
  return {
    profile,
    entries,
    macrosStored,
    waterLog,
    climate,
    oneRepHistory: loadOneRepHistory(),
    splits: loadSavedWorkoutSplits(),
    bodyFat: loadBodyFatLatest(),
  };
}

export function macroDisplayForProfile(
  profile: UserProfile,
  macrosStored: MacroResults | null,
): MacroResults | null {
  return macrosStored ?? computeMacroResults(profile);
}

export function categoryMicroSummary(
  id: InsightCategoryId,
  bundle: ProfileInsightsBundle,
  waterToday: WaterDailyLog | null,
  macros: MacroResults | null,
): string {
  const { profile, entries, oneRepHistory, splits, bodyFat } = bundle;
  switch (id) {
    case "mood": {
      const j = journalMoodEnergyInsight(entries);
      if (!j.hasData) return "Log a check-in";
      if (j.lastNAvg) return `Mood ${j.lastNAvg.mood}/5 · Energy ${j.lastNAvg.energy}/5`;
      return "Journal active";
    }
    case "nutrition": {
      if (!profile || !macros) return "Run calculator";
      const s = scenarioForGoal(macros, profile.goal);
      return `${s.calories} kcal target`;
    }
    case "hydration": {
      if (!waterToday || waterToday.targetMl <= 0) return "Set climate in tool";
      const pct = Math.round((waterToday.consumedMl / waterToday.targetMl) * 100);
      return `${pct}% of ${waterToday.targetMl} ml`;
    }
    case "strength": {
      const { recent, bestAverage } = oneRepHighlights(oneRepHistory);
      if (!recent.length) return "No saved lifts";
      return bestAverage ? `Best est. ${bestAverage.value.toFixed(1)} kg` : "History on device";
    }
    case "split": {
      const { latest } = pickWorkoutSplitHighlights(splits);
      return latest ? `${latest.daysPerWeek} days · saved` : "Nothing saved yet";
    }
    case "composition": {
      if (bodyFat) return `${bodyFat.bodyFatPercent.toFixed(1)}% · Navy est.`;
      if (profile?.bodyFatPercent != null && !Number.isNaN(profile.bodyFatPercent as number)) {
        return `~${profile.bodyFatPercent}% (profile)`;
      }
      return "Estimate in tool";
    }
    default:
      return "";
  }
}
