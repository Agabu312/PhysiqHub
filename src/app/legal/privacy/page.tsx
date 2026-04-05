import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

export default function PrivacyPage() {
  return (
    <article className="prose prose-invert max-w-none prose-headings:font-semibold prose-p:text-muted prose-li:text-muted">
      <p className="text-xs font-semibold uppercase tracking-wider text-amber-300/90">
        Important: starter document — not legal advice
      </p>
      <h1 className="text-3xl text-foreground">Privacy Policy</h1>
      <p className="text-sm text-muted">
        Effective date: April 4, 2026 · PhysiquHub · Contact: privacy@example.com (placeholder)
      </p>

      <h2 className="mt-10 text-xl text-foreground">1. Summary</h2>
      <p>
        Today, PhysiquHub runs entirely in your browser. We do not operate a login system or cloud
        database in this version. Data you enter is stored locally on your device (for example,
        localStorage) unless and until you use a future online feature.
      </p>

      <h2 className="mt-8 text-xl text-foreground">2. What we process locally</h2>
      <ul>
        <li>Profile and settings (age, anthropometrics, goals, preferences).</li>
        <li>Tool outputs and logs you choose to save (macros, hydration, journal, lifts, splits).</li>
        <li>Legal consent timestamps to remember your agreement to Terms/Privacy.</li>
      </ul>

      <h2 className="mt-8 text-xl text-foreground">3. What we do not do (current build)</h2>
      <ul>
        <li>No accounts, no server-side profile database, no cross-device sync by default.</li>
        <li>No third-party advertising pixels in this template (sponsor slots are static/local config).</li>
        <li>No sale of personal information in this local-only configuration.</li>
      </ul>

      <h2 className="mt-8 text-xl text-foreground">4. Future network features</h2>
      <p>
        If PhysiquHub adds optional online services, this Policy will be updated to describe what is
        collected, why, retention, and your controls. A potential{" "}
        <strong className="text-foreground">public profile</strong> mode would be{" "}
        <strong className="text-foreground">opt-in</strong> and limited to users who explicitly choose
        Public visibility. Region and language preferences may be used as filters for discovery—not for
        hidden profiling in this product vision.
      </p>

      <h2 className="mt-8 text-xl text-foreground">5. Cookies &amp; similar tech</h2>
      <p>
        This static/browser-local build does not require cookies for core functionality. Future hosted
        versions may use essential cookies for security or preferences; we will list them when relevant.
      </p>

      <h2 className="mt-8 text-xl text-foreground">6. Children</h2>
      <p>
        PhysiquHub is not directed to children under 13 (or the minimum age in your region). Do not use
        the service if you are below the age required to consent where you live.
      </p>

      <h2 className="mt-8 text-xl text-foreground">7. Your controls</h2>
      <ul>
        <li>Clear site data in your browser to remove localStorage contents.</li>
        <li>Use in-app settings to adjust profile visibility when available.</li>
        <li>Contact us (placeholder email) for questions about future data practices.</li>
      </ul>

      <h2 className="mt-8 text-xl text-foreground">8. International users</h2>
      <p>
        Laws vary by country and region (GDPR, CPRA, etc.). This starter Policy is not a substitute for
        jurisdiction-specific compliance work.
      </p>

      <h2 className="mt-8 text-xl text-foreground">9. Changes</h2>
      <p>
        We will update this Policy when the product changes. Significant updates may require a new
        in-app consent version string.
      </p>

      <h2 className="mt-8 text-xl text-foreground">10. Review before launch</h2>
      <p>
        This Privacy Policy is a <strong className="text-foreground">starter document</strong> and{" "}
        <strong className="text-foreground">must be reviewed by a qualified attorney</strong> before
        public launch or any real data collection beyond local-only demos.
      </p>

      <p className="mt-10 text-sm">
        <Link href="/legal/terms" className="text-accent hover:underline">
          Terms of Service
        </Link>
        {" · "}
        <Link href="/" className="text-accent hover:underline">
          Home
        </Link>
      </p>
    </article>
  );
}
