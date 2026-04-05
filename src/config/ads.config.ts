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

/**
 * CURRENT STRATEGY:
 * - Use one visible placement as an "advertise with us" card
 * - Hide the other placements until real sponsors exist
 * - Later, swap the creative fields below with real partner copy/links
 */

/** Dashboard placement */
export const dashboardAd: { enabled: boolean; creative: AdCreative } = {
  enabled: true,
  creative: {
    id: "dash-advertise-with-us",
    brandName: "PhysiqHub",
    headline: "Advertising opportunities available",
    body: "For sponsorship and advertising inquiries, contact PhysiqHub@physiqhub.info. This placement can later be replaced with a live partner campaign.",
    ctaLabel: "Email us",
    href: "mailto:PhysiqHub@physiqhub.info?subject=Advertising%20Inquiry%20-%20PhysiqHub",
    accentKey: "neutral",
  },
};

/** Profile placement — hidden until needed */
export const profileAd: { enabled: boolean; creative: AdCreative } = {
  enabled: false,
  creative: {
    id: "profile-inline",
    brandName: "Future Partner",
    headline: "Reserved profile placement",
    body: "This optional slot can be enabled later for a sponsor that fits the product naturally.",
    ctaLabel: "Learn more",
    href: "https://example.com",
    accentKey: "water",
  },
};

/** Tool pages placement — hidden until needed */
export const toolInlineAd: { enabled: boolean; creative: AdCreative } = {
  enabled: false,
  creative: {
    id: "tool-inline",
    brandName: "Future Partner",
    headline: "Reserved tool-page placement",
    body: "Enable this later when you have a real advertising partner and campaign URL.",
    ctaLabel: "Learn more",
    href: "https://example.com",
    accentKey: "macros",
  },
};