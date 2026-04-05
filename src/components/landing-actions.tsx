"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { isOnboardingComplete } from "@/lib/storage";

export function LandingActions() {
  const [ready, setReady] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isOnboardingComplete());
    setReady(true);
  }, []);

  const primaryHref = ready && done ? "/dashboard" : "/onboarding";
  const primaryLabel = ready && done ? "Continue to dashboard" : "Get started";

  return (
    <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
      <Link
        href={primaryHref}
        className={cn(
          "group inline-flex min-h-12 min-w-[220px] items-center justify-center gap-2 rounded-full bg-accent px-8 text-sm font-semibold text-background shadow-[0_0_40px_-10px_rgba(45,212,191,0.55)] transition duration-200 hover:brightness-110 active:scale-[0.98]",
        )}
      >
        {primaryLabel}
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
      </Link>
      <Link
        href="/dashboard"
        className="inline-flex min-h-12 items-center justify-center rounded-full border border-border-strong bg-surface-elevated/50 px-8 text-sm font-medium text-foreground transition duration-200 hover:border-accent/40 hover:bg-surface-elevated"
      >
        Open dashboard
      </Link>
    </div>
  );
}
