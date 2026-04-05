import { getItem, setItem, STORAGE_KEYS } from "@/lib/storage";
import type { JournalEntry } from "@/lib/types";

export function loadJournalEntries(): JournalEntry[] {
  const raw = getItem(STORAGE_KEYS.journalEntries);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (e): e is JournalEntry =>
        typeof e === "object" &&
        e !== null &&
        typeof (e as JournalEntry).id === "string" &&
        typeof (e as JournalEntry).date === "string",
    );
  } catch {
    return [];
  }
}

export function saveJournalEntries(entries: JournalEntry[]): void {
  setItem(STORAGE_KEYS.journalEntries, JSON.stringify(entries));
}

export function sortEntriesByDateDesc(entries: JournalEntry[]): JournalEntry[] {
  return [...entries].sort((a, b) => {
    if (a.date === b.date) return b.createdAt.localeCompare(a.createdAt);
    return b.date.localeCompare(a.date);
  });
}
