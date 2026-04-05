import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { ButtonLink } from "@/components/landing/button-link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/80 glass-panel-strong">
      <div className="mx-auto flex h-[4.25rem] max-w-6xl items-center justify-between gap-4 px-4 md:px-8">
        <BrandLogo href="/" />
        <nav className="hidden items-center gap-8 text-sm font-medium text-muted md:flex">
          <a href="#features" className="transition-colors hover:text-foreground">
            Features
          </a>
          <a href="#how" className="transition-colors hover:text-foreground">
            How it works
          </a>
          <a href="#tools" className="transition-colors hover:text-foreground">
            Tools
          </a>
          <a href="#privacy" className="transition-colors hover:text-foreground">
            Privacy
          </a>
          <Link href="/legal/terms" className="transition-colors hover:text-foreground">
            Terms
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard"
            className="hidden rounded-full px-4 py-2 text-sm font-medium text-muted transition-colors hover:text-foreground sm:inline"
          >
            Dashboard
          </Link>
          <ButtonLink href="/onboarding" variant="primary" className="!px-5 !py-2 text-sm">
            Launch app
          </ButtonLink>
        </div>
      </div>
    </header>
  );
}
