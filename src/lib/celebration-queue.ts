const Q_KEY = "physiquhub:celebrate-queue";

export function pushCelebration(message: string): void {
  if (typeof window === "undefined") return;
  try {
    const raw = sessionStorage.getItem(Q_KEY);
    const q: string[] = raw ? (JSON.parse(raw) as string[]) : [];
    q.push(message);
    sessionStorage.setItem(Q_KEY, JSON.stringify(q.slice(-5)));
  } catch {
    /* ignore */
  }
}

export function popCelebration(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(Q_KEY);
    const q: string[] = raw ? (JSON.parse(raw) as string[]) : [];
    const next = q.shift() ?? null;
    sessionStorage.setItem(Q_KEY, JSON.stringify(q));
    return next;
  } catch {
    return null;
  }
}
