import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { OnboardingFlow } from "@/components/onboarding-flow";

export default function OnboardingPage() {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b border-border/80 glass-panel-strong">
        <div className="mx-auto flex h-[4.25rem] max-w-3xl items-center justify-between px-4 md:px-6">
          <BrandLogo href="/" />
          <Link
            href="/dashboard"
            className="text-sm font-medium text-muted transition-colors hover:text-foreground"
          >
            Skip for now
          </Link>
        </div>
      </header>
      <div className="mx-auto max-w-3xl px-4 py-10 md:px-6 md:py-14">
        <OnboardingFlow />
      </div>
    </div>
  );
}
