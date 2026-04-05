import type { Gender } from "@/lib/types";

/** Convert cm to inches */
function cmToIn(cm: number): number {
  return cm / 2.54;
}

/** log10 */
function log10(n: number): number {
  return Math.log(n) / Math.LN10;
}

/**
 * US Navy body fat estimation (measurements in cm internally).
 * Male: neck, waist, height. Female: neck, waist, hip, height.
 * Returns null if inputs invalid (e.g. waist <= neck for men).
 */
export function navyBodyFatPercent(input: {
  gender: Gender;
  heightCm: number;
  neckCm: number;
  waistCm: number;
  hipCm: number | null;
}): { percent: number } | null {
  const h = cmToIn(input.heightCm);
  const neck = cmToIn(input.neckCm);
  const waist = cmToIn(input.waistCm);
  if (h <= 0 || neck <= 0 || waist <= 0) return null;

  if (input.gender === "male") {
    if (waist <= neck) return null;
    const value =
      86.010 * log10(waist - neck) - 70.041 * log10(h) + 36.76;
    if (!Number.isFinite(value)) return null;
    return { percent: clampBf(value) };
  }

  const hip = input.hipCm != null ? cmToIn(input.hipCm) : 0;
  if (hip <= 0) return null;
  if (waist + hip <= neck) return null;
  const value =
    163.205 * log10(waist + hip - neck) - 97.684 * log10(h) - 78.387;
  if (!Number.isFinite(value)) return null;
  return { percent: clampBf(value) };
}

function clampBf(n: number): number {
  return Math.round(Math.min(60, Math.max(4, n)) * 10) / 10;
}

export function compositionFromBf(weightKg: number, bfPct: number): { leanKg: number; fatKg: number } {
  const fatKg = Math.round(weightKg * (bfPct / 100) * 10) / 10;
  const leanKg = Math.round((weightKg - fatKg) * 10) / 10;
  return { leanKg, fatKg };
}

export type BfCategory = {
  key: string;
  label: string;
  rangeLabel: string;
  explanation: string;
};

export function bodyFatCategory(gender: Gender, bf: number): BfCategory {
  if (gender === "male") {
    if (bf < 6)
      return {
        key: "essential-low",
        label: "Very lean",
        rangeLabel: "Below typical athletic maintenance",
        explanation:
          "Common in staged leanness for sport; hard to sustain year-round. Energy and hormones can suffer if held too long without supervision.",
      };
    if (bf < 14)
      return {
        key: "athletic",
        label: "Athletic range",
        rangeLabel: "~6–14% (broadly)",
        explanation:
          "Often where performance and aesthetics overlap for many men. Day-to-day energy usually remains workable with good nutrition.",
      };
    if (bf < 18)
      return {
        key: "fitness",
        label: "Fitness",
        rangeLabel: "~14–18%",
        explanation: "Healthy range for many; room to build muscle without aggressive dieting.",
      };
    if (bf < 25)
      return {
        key: "average",
        label: "Average",
        rangeLabel: "~18–25%",
        explanation: "Typical adult range. Fat loss phases can improve markers if combined with training.",
      };
    return {
      key: "elevated",
      label: "Elevated",
      rangeLabel: "25%+",
      explanation:
        "Higher adiposity can track with health risk factors over time. Use estimates as one signal—not a diagnosis.",
    };
  }

  if (bf < 16)
    return {
      key: "very-lean-f",
      label: "Very lean",
      rangeLabel: "Below many women’s sustainable comfort",
      explanation:
        "Some athletes sit here temporarily; menstrual regularity and bone health deserve attention if staying very lean.",
    };
  if (bf < 24)
    return {
      key: "athletic-f",
      label: "Athletic range",
      rangeLabel: "~16–24%",
      explanation: "Common for active women balancing performance and body composition.",
    };
  if (bf < 31)
    return {
      key: "fitness-f",
      label: "Fitness",
      rangeLabel: "~24–31%",
      explanation: "Often compatible with general health goals; training can reshape composition over time.",
    };
  return {
    key: "elevated-f",
    label: "Elevated",
    rangeLabel: "31%+",
    explanation:
      "Higher range may warrant lifestyle focus alongside professional guidance if health concerns exist.",
  };
}
