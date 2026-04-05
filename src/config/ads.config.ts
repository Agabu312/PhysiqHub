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
    brandName: "PhysiqHub",
    headline: "Profile sponsor slot",
    body: "Reserved for future sponsor placements that fit the product naturally.",
    ctaLabel: "Contact us",
    href: "mailto:PhysiqHub@physiqhub.info?subject=Partnership%20Inquiry%20-%20PhysiqHub",
    accentKey: "water",
    mediaType: "none",
  },
};

export const toolInlineAd: { enabled: boolean; creative: AdCreative } = {
  enabled: true,
  creative: {
    id: "tool-inline",
    brandName: "PhysiqHub",
    headline: "Advertise with PhysiqHub",
    body: "Relevant sponsor placements are available across tools and dashboard surfaces. Reach out for partnership details.",
    ctaLabel: "Get in touch",
    href: "mailto:PhysiqHub@physiqhub.info?subject=Advertising%20Inquiry%20-%20PhysiqHub",
    accentKey: "macros",
    mediaType: "none",
  },
};

export const coachAd: { enabled: boolean; creative: AdCreative } = {
  enabled: true,
  creative: {
    id: "coach-inline",
    brandName: "PhysiqHub",
    headline: "Interested in a sponsor placement?",
    body: "Coach, dashboard, and tool placements are available for brands that genuinely fit the audience.",
    ctaLabel: "Partner with us",
    href: "mailto:PhysiqHub@physiqhub.info?subject=Partnership%20Inquiry%20-%20PhysiqHub",
    accentKey: "neutral",
    mediaType: "none",
  },
};