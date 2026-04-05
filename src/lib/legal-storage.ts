import { getItem, removeItem, setItem, STORAGE_KEYS } from "@/lib/storage";
import { LEGAL_VERSION, type LegalConsentRecord } from "@/lib/legal";

export function loadLegalConsent(): LegalConsentRecord | null {
  const raw = getItem(STORAGE_KEYS.legalConsent);
  if (!raw) return null;
  try {
    const o = JSON.parse(raw) as LegalConsentRecord;
    if (typeof o.version === "string" && typeof o.acceptedAt === "string") return o;
    return null;
  } catch {
    return null;
  }
}

export function hasAcceptedCurrentLegal(): boolean {
  const c = loadLegalConsent();
  return c != null && c.version === LEGAL_VERSION;
}

export function saveLegalConsent(): void {
  const record: LegalConsentRecord = {
    version: LEGAL_VERSION,
    acceptedAt: new Date().toISOString(),
  };
  setItem(STORAGE_KEYS.legalConsent, JSON.stringify(record));
}

export function clearLegalConsent(): void {
  removeItem(STORAGE_KEYS.legalConsent);
}
