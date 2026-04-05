/**
 * Local ad configuration — edit here to change sponsored placements.
 * No network calls; safe for static export. Replace href with real campaigns when ready.
 *
 * accentKey maps to theme colors in globals.css (cat-* tokens).
 */

export type AdAccentKey = "macros" | "water" | "neutral";
export type AdMediaType = "none" | "image" | "video";

export type AdCreative = {
  id: string;
  brandName: string;
  headline: string;
  body: string;
  ctaLabel: string;
  /** Use https:// for external links or mailto: for email CTAs */
  href: string;
  accentKey: AdAccentKey;

  /**
   * Media support:
   * - none  -> text only
   * - image -> render mediaSrc as image
   * - video -> render mediaSrc as video
   */
  mediaType?: AdMediaType;
  mediaSrc?: string;
  mediaAlt?: string;
};

export const dashboardAd: { enabled: boolean; creative: AdCreative } = {
  enabled: true,
  creative: {
    id: "dash-partner-inquiry",
    brandName: "PhysiqHub",
    headline: "Partner with PhysiqHub",
    body: "Selective sponsor placements are available for brands that genuinely fit the product. For partnership or advertising inquiries, contact PhysiqHub@physiqhub.info.",
    ctaLabel: "Contact us",
    href: "mailto:PhysiqHub@physiqhub.info?subject=Partnership%20Inquiry%20-%20PhysiqHub",
    accentKey: "neutral",
    mediaType: "none",
  },
};

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
    mediaType: "none",
  },
};

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
    mediaType: "none",
  },
};