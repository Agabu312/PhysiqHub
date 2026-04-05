"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { hasAcceptedCurrentLegal, saveLegalConsent } from "@/lib/legal-storage";

/**
 * Blocks in-app chrome until the user accepts current Terms/Privacy version.
 * Decline sends users to /consent-required (outside gated layout).
 */
export function ConsentGate({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [ok, setOk] = useState(false);

  useEffect(() => {
    setOk(hasAcceptedCurrentLegal());
    setReady(true);
  }, []);

  const accept = () => {
    saveLegalConsent();
    setOk(true);
  };

  const decline = () => {
    router.push("/consent-required");
  };

  if (!ready) {
    return <div className="min-h-screen bg-background" aria-hidden />;
  }

  if (ok) return <>{children}</>;

  return (
    <>
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/85 px-4 backdrop-blur-md">
        <div
          className="relative w-full max-w-lg rounded-2xl border border-border-strong glass-panel-strong p-6 shadow-2xl md:p-8"
          role="dialog"
          aria-modal="true"
          aria-labelledby="consent-title"
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-accent">Before you continue</p>
          <h2 id="consent-title" className="mt-2 text-xl font-semibold text-foreground md:text-2xl">
            Accept terms & privacy notice
          </h2>
          <p className="mt-3 text-sm text-muted leading-relaxed">
            PhysiquHub stores data on your device (localStorage), provides fitness estimates—not medical
            advice—and may add optional network features later (such as region-based discovery for users
            who choose a public profile). Use the links below to read the full documents.
          </p>
          <ul className="mt-4 space-y-2 text-sm text-muted">
            <li>
              <Link href="/legal/terms" className="text-accent underline-offset-4 hover:underline">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link href="/legal/privacy" className="text-accent underline-offset-4 hover:underline">
                Privacy Policy
              </Link>
            </li>
          </ul>
          <p className="mt-4 rounded-xl border border-amber-500/25 bg-amber-500/10 px-3 py-2 text-xs text-amber-100/95">
            These are starter policies only. Have them reviewed by a qualified attorney before a public
            launch; they are not guaranteed to meet every jurisdiction&apos;s requirements.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button variant="secondary" type="button" onClick={decline}>
              Decline
            </Button>
            <Button type="button" onClick={accept}>
              I agree
            </Button>
          </div>
        </div>
      </div>
      {/* Inert shell underneath keeps layout stable for screen readers */}
      <div className="pointer-events-none min-h-screen opacity-30" aria-hidden>
        {children}
      </div>
    </>
  );
}
