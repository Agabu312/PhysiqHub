import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-border mt-24">
      <div className="mx-auto max-w-6xl px-4 py-14 md:px-8">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-xs">
            <BrandLogo href="/" />
            <p className="mt-4 text-sm text-muted leading-relaxed">
              PhysiquHub is a browser-based training workspace. Your numbers stay on this device until
              you choose otherwise.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-foreground">Product</p>
              <ul className="mt-4 space-y-2 text-sm text-muted">
                <li>
                  <Link href="/dashboard" className="hover:text-accent transition-colors">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/onboarding" className="hover:text-accent transition-colors">
                    Onboarding
                  </Link>
                </li>
                <li>
                  <a href="#tools" className="hover:text-accent transition-colors">
                    Tools
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-foreground">Tools</p>
              <ul className="mt-4 space-y-2 text-sm text-muted">
                <li>
                  <Link href="/tools/calorie-macro" className="hover:text-accent transition-colors">
                    Macros
                  </Link>
                </li>
                <li>
                  <Link href="/tools/water-intake" className="hover:text-accent transition-colors">
                    Hydration
                  </Link>
                </li>
                <li>
                  <Link href="/tools/progress-journal" className="hover:text-accent transition-colors">
                    Journal
                  </Link>
                </li>
              </ul>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-foreground">Legal</p>
              <ul className="mt-4 space-y-2 text-sm text-muted">
                <li>
                  <Link href="/legal/terms" className="hover:text-accent transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/legal/privacy" className="hover:text-accent transition-colors">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
              <p className="mt-4 text-xs text-muted leading-relaxed">
                Starter policies—review with counsel before launch. Data stays on-device in v1 unless you
                use a future online mode.
              </p>
            </div>
          </div>
        </div>
        <p className="mt-12 border-t border-border pt-8 text-center text-xs text-muted">
          © {new Date().getFullYear()} PhysiquHub. Built for focused training decisions—not noise.
        </p>
      </div>
    </footer>
  );
}
