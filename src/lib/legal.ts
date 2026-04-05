/**
 * Legal / consent versioning (localStorage only).
 * Bump LEGAL_VERSION when Terms/Privacy materially change so users may re-prompt in the future.
 */
export const LEGAL_VERSION = "2026-04-04";

export type LegalConsentRecord = {
  version: string;
  acceptedAt: string;
};
