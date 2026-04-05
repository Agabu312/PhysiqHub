import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service",
};

export default function TermsPage() {
  return (
    <article className="prose prose-invert max-w-none prose-headings:font-semibold prose-p:text-muted prose-li:text-muted">
      <p className="text-xs font-semibold uppercase tracking-wider text-amber-300/90">
        Important: starter document — not legal advice
      </p>
      <h1 className="text-3xl text-foreground">Terms of Service</h1>
      <p className="text-sm text-muted">
        Effective date: April 4, 2026 · PhysiquHub (&quot;we&quot;, &quot;us&quot;) · Contact:
        legal@example.com (placeholder — replace before launch)
      </p>

      <h2 className="mt-10 text-xl text-foreground">1. Agreement</h2>
      <p>
        By accessing or using PhysiquHub&apos;s website and browser tools, you agree to these Terms. If
        you do not agree, do not use the service.
      </p>

      <h2 className="mt-8 text-xl text-foreground">2. Not medical advice</h2>
      <p>
        PhysiquHub provides educational fitness calculators, estimates, and planning aids. Nothing here
        is medical, nutritional, or therapeutic advice. Always consult a qualified professional for
        health decisions, injuries, or conditions.
      </p>

      <h2 className="mt-8 text-xl text-foreground">3. User responsibility</h2>
      <p>
        You are responsible for how you train, eat, hydrate, and recover. You assume the risks of
        physical activity. Stop exercise if you experience pain, dizziness, or unusual symptoms.
      </p>

      <h2 className="mt-8 text-xl text-foreground">4. Estimates &amp; limitations</h2>
      <p>
        Outputs (macros, hydration targets, 1RM estimates, body-fat approximations, workout templates)
        rely on formulas and self-reported data. They are inherently uncertain. Do not treat them as
        exact measurements suitable for medical or legal proof.
      </p>

      <h2 className="mt-8 text-xl text-foreground">5. Local storage</h2>
      <p>
        This version stores information (such as profile fields and logs) in your browser&apos;s
        localStorage. Clearing site data or using another device will not carry your information over.
        You are responsible for backups if you need them.
      </p>

      <h2 className="mt-8 text-xl text-foreground">6. Future public profiles</h2>
      <p>
        A future network-enabled version may allow optional discovery of users who choose a{" "}
        <strong className="text-foreground">Public</strong> visibility setting. That feature is{" "}
        <strong className="text-foreground">not active</strong> in the current local-only build. When
        launched, eligibility, filters, and controls will be described in the Privacy Policy and in-app
        disclosures.
      </p>

      <h2 className="mt-8 text-xl text-foreground">7. Acceptable use</h2>
      <ul>
        <li>No unlawful, harassing, or harmful use of the service.</li>
        <li>No attempt to disrupt, scrape, or overload infrastructure.</li>
        <li>No misrepresentation of identity in any future community feature.</li>
      </ul>

      <h2 className="mt-8 text-xl text-foreground">8. Disclaimers</h2>
      <p>
        The service is provided &quot;as is&quot; without warranties of any kind. To the maximum extent
        permitted by law, we disclaim liability for indirect or consequential damages arising from use
        of the tools.
      </p>

      <h2 className="mt-8 text-xl text-foreground">9. Changes</h2>
      <p>
        We may update these Terms. Material changes may require renewed consent in-app. Continued use
        after updates constitutes acceptance unless prohibited by law.
      </p>

      <h2 className="mt-8 text-xl text-foreground">10. Review before launch</h2>
      <p>
        These Terms are a <strong className="text-foreground">strong starter template</strong> only.
        They are <strong className="text-foreground">not guaranteed</strong> to comply with every
        jurisdiction. Have them reviewed by a qualified attorney before a public or commercial launch.
      </p>

      <p className="mt-10 text-sm">
        <Link href="/legal/privacy" className="text-accent hover:underline">
          Privacy Policy
        </Link>
        {" · "}
        <Link href="/" className="text-accent hover:underline">
          Home
        </Link>
      </p>
    </article>
  );
}
