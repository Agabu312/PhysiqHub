export const STORAGE_KEYS = {
  onboardingComplete: "physiquhub:onboarding-complete",
  profile: "physiquhub:profile",
  macroResults: "physiquhub:macro-results",
  waterDaily: "physiquhub:water-daily",
  waterClimate: "physiquhub:water-climate",
  journalEntries: "physiquhub:journal-entries",
  legalConsent: "physiquhub:legal-consent",
  oneRepHistory: "physiquhub:one-rep-history",
  workoutSplitsSaved: "physiquhub:workout-splits-saved",
  bodyFatLatest: "physiquhub:body-fat-latest",
} as const;

export function getItem(key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function setItem(key: string, value: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, value);
  } catch {
    /* ignore quota / private mode */
  }
}

export function removeItem(key: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}

export function isOnboardingComplete(): boolean {
  return getItem(STORAGE_KEYS.onboardingComplete) === "true";
}

export function markOnboardingComplete(): void {
  setItem(STORAGE_KEYS.onboardingComplete, "true");
}
