/**
 * Local ad configuration — edit here to change sponsored placements.
 * No network calls; safe for static export. Replace href with real campaigns when ready.
 *
 * accentKey maps to theme colors in globals.css (cat-* tokens).
 */
export type AdAccentKey = "macros" | "water" | "neutral";

export type AdCreative = {
  id: string;
  brandName: string;
  headline: string;
  body: string;
  ctaLabel: string;
  /** Use https:// for external links */
  href: string;
  accentKey: AdAccentKey;
};

/** Dashboard hero-ad (optional; set enabled: false to hide) */
export const dashboardAd: { enabled: boolean; creative: AdCreative } = {
  enabled: true,
  creative: {
    id: "dash-primary",
    brandName: "Recovery Labs",
    headline: "Sleep is the first performance supplement",
    body: "Placeholder sponsorship slot. Swap copy and URL in src/config/ads.config.ts when you have a partner.",
    ctaLabel: "Learn more",
    href: "https://example.com",
    accentKey: "neutral",
  },
};

/** Compact placement on Profile (below body insights); disabled by default */
export const profileAd: { enabled: boolean; creative: AdCreative } = {
  enabled: false,
  creative: {
    id: "profile-inline",
    brandName: "PhysiquHub Partners",
    headline: "Train with clarity",
    body: "Optional partner slot on Profile. Enable in ads.config.ts when you have a fit.",
    ctaLabel: "Details",
    href: "https://example.com/partners",
    accentKey: "water",
  },
};

/** Shown below primary results on tool pages when enabled */
export const toolInlineAd: { enabled: boolean; creative: AdCreative } = {
  enabled: true,
  creative: {
    id: "tool-inline",
    brandName: "PhysiquHub Partners",
    headline: "Fuel training decisions, not distractions",
    body: "Second placement for future sponsors. Keeps the same glass styling as the rest of the app.",
    ctaLabel: "Partner info",
    href: "https://example.com/partners",
    accentKey: "macros",
  },
};
