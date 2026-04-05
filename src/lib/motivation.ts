/** Curated lines — minimal, intelligent tone (not corporate cheer). */

export const MOTIVATION_LINES: string[] = [
  "Show up. Adjust. Repeat.",
  "Volume without intent is just fatigue.",
  "The best program is the one you can run next week too.",
  "Sleep is the first recovery supplement.",
  "Track patterns, not single bad days.",
  "Strength is a skill—reps matter.",
  "Hunger is information, not failure.",
  "One heavy set well executed beats three sloppy ones.",
  "Consistency compounds quietly.",
  "You can't out-train chronic under-recovery.",
  "Simple metrics beat perfect spreadsheets.",
  "Progress likes boring weeks.",
  "Hydration is focus fuel.",
  "Ego is expensive in the gym.",
  "Small data beats big guesses.",
  "Train the movement you own today.",
  "Patience is a performance variable.",
  "If everything is max effort, nothing is.",
  "Walk more. Argue with fewer people. Train.",
  "The mirror lags behind the logbook.",
  "Protein first. Drama second—ideally none.",
  "Deloads are features, not failures.",
  "Your next session starts with how you recover tonight.",
  "Intensity without structure is noise.",
  "Breathe. Brace. Execute.",
  "Good weeks feel ordinary. That's the point.",
  "Track sleep like you track sets.",
  "Mobility you skip becomes the limiter later.",
  "The deficit that ruins training isn't the smart one.",
  "Chase repeatable effort, not random PRs.",
  "Notes today save confusion next month.",
  "If joints complain, listen before they shout.",
  "Two steady sessions beat one heroic meltdown.",
  "Energy is a budget—spend it on what matters.",
  "Warm-ups are part of the work.",
  "You don't need motivation; you need a plan you respect.",
  "Food quality and quantity both talk to performance.",
  "Stop when form is the limiter, not when you're bored.",
  "Long horizons favor people who don't quit on boring days.",
  "The bar doesn't care about your story—only your setup.",
  "Recovery is where adaptation actually happens.",
  "A bad night happens. Two in a row is a signal.",
  "Train like you'll need this body for decades.",
  "Precision beats intensity when technique is still learning.",
  "If you can't repeat it, it wasn't really yours.",
  "Calm effort moves more weight than panic.",
  "The log doesn't lie; memory does.",
  "Build habits that survive a busy week.",
  "You're allowed to be proud of quiet consistency.",
  "Bias toward the next right rep, not the next excuse.",
  "Adherence is the hidden PR most people never celebrate.",
  "Fuel training; don't negotiate with hunger like it's a debate club.",
  "If the plan feels easy forever, you're probably not progressing.",
  "If it feels impossible forever, the plan—not you—is broken.",
  "Protect joints like you protect progression—they're the same story.",
];

const CELEBRATIONS = [
  "Nice work. Consistency compounds.",
  "Today counted.",
  "Small steps still move the needle.",
  "Logged. That's how trends start.",
  "Solid—keep the chain going.",
];

function dayIndex(date: Date): number {
  const start = Date.UTC(date.getFullYear(), 0, 0);
  return Math.floor((date.getTime() - start) / 86400000);
}

/** Deterministic by calendar day so it feels fresh but stable intraday. */
export function getDailyMotivationLine(date = new Date()): string {
  const day = dayIndex(date);
  return MOTIVATION_LINES[day % MOTIVATION_LINES.length];
}

/** Second line for the same day — different index so pairs don’t repeat trivially. */
export function getDailyMotivationCompanion(date = new Date()): string {
  const day = dayIndex(date);
  const i = (day * 17 + 13) % MOTIVATION_LINES.length;
  return MOTIVATION_LINES[i];
}

export function randomCelebration(): string {
  return CELEBRATIONS[Math.floor(Math.random() * CELEBRATIONS.length)];
}
