import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { ButtonLink } from "@/components/landing/button-link";

export default function ConsentRequiredPage() {
  return (
    <div className="min-h-screen px-4 py-16">
      <div className="mx-auto max-w-lg text-center">
        <BrandLogo href="/" />
        <h1 className="mt-10 text-2xl font-semibold text-foreground">Consent required</h1>
        <p className="mt-4 text-sm text-muted leading-relaxed">
          PhysiquHub&apos;s training tools are available only after accepting the current Terms of
          Service and Privacy Policy. You declined or have not yet accepted the in-app agreement.
        </p>
        <p className="mt-4 text-sm text-muted leading-relaxed">
          You can still read our legal documents or return to the public marketing site. When you are
          ready, open the app again and choose <strong className="text-foreground">I agree</strong> on
          the consent prompt.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3">
          <ButtonLink href="/dashboard" variant="primary">
            Return to app (shows consent)
          </ButtonLink>
          <ButtonLink href="/" variant="secondary">
            Marketing home
          </ButtonLink>
        </div>
        <ul className="mt-10 space-y-2 text-sm text-muted">
          <li>
            <Link href="/legal/terms" className="text-accent hover:underline">
              Terms of Service
            </Link>
          </li>
          <li>
            <Link href="/legal/privacy" className="text-accent hover:underline">
              Privacy Policy
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
