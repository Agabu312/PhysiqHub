import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="border-b border-border glass-panel-strong">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4">
          <BrandLogo href="/" />
          <Link href="/dashboard" className="text-sm text-muted hover:text-foreground">
            App
          </Link>
        </div>
      </header>
      <div className="mx-auto max-w-3xl px-4 py-10 md:py-14">{children}</div>
    </div>
  );
}
