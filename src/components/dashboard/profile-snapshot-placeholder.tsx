"use client";

import { Droplets, Dumbbell, HeartPulse, PieChart, Ruler, Sparkles } from "lucide-react";
import { cn } from "@/lib/cn";

const ZONES = [
  { key: "mood", label: "Mood & recovery", icon: HeartPulse, style: "left-[12%] top-[8%]" },
  { key: "nutrition", label: "Nutrition", icon: PieChart, style: "right-[8%] top-[22%]" },
  { key: "hydration", label: "Hydration", icon: Droplets, style: "left-[18%] top-[38%]" },
  { key: "strength", label: "Strength", icon: Dumbbell, style: "right-[14%] top-[48%]" },
  { key: "body", label: "Body comp", icon: Ruler, style: "left-[22%] top-[62%]" },
] as const;

/**
 * Visual preview only — future body-map / multi-signal dashboard hooks here.
 */
export function ProfileSnapshotPlaceholder({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-cyan-400/20 bg-gradient-to-b from-cyan-500/5 via-transparent to-violet-500/10 p-5 shadow-[inset_0_0_60px_-20px_rgba(34,211,238,0.15)]",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-300/90">Preview</p>
          <h3 className="mt-1 text-lg font-semibold text-foreground">Profile snapshot</h3>
          <p className="mt-1 max-w-xs text-xs text-muted leading-relaxed">
            Future body insights will map signals across zones—interactive, private, and tied to your
            logs.
          </p>
        </div>
        <Sparkles className="h-5 w-5 shrink-0 text-cyan-400/80" aria-hidden />
      </div>

      <div className="relative mx-auto mt-6 h-[220px] max-w-[200px]">
        {/* Abstract neon silhouette */}
        <svg
          viewBox="0 0 120 280"
          className="h-full w-full drop-shadow-[0_0_18px_rgba(34,211,238,0.25)]"
          aria-hidden
        >
          <defs>
            <linearGradient id="silGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgb(34 211 238)" stopOpacity="0.9" />
              <stop offset="100%" stopColor="rgb(167 139 250)" stopOpacity="0.5" />
            </linearGradient>
          </defs>
          <path
            fill="none"
            stroke="url(#silGlow)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M60 28c8 0 14 6 14 14s-6 14-14 14-14-6-14-14 6-14 14-14zm-18 38h36l8 42-6 88H46l-6-88 8-42zm8 130h20l4 72H46l4-72z"
            className="animate-[pulse-slow_4s_ease-in-out_infinite]"
          />
          <ellipse cx="60" cy="248" rx="22" ry="6" fill="rgba(34,211,238,0.08)" />
        </svg>

        {ZONES.map((z) => {
          const Icon = z.icon;
          return (
            <button
              key={z.key}
              type="button"
              title={`${z.label} — coming in a deeper insights build`}
              className={cn(
                "absolute flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-cyan-400/40 bg-background/70 text-cyan-300 shadow-[0_0_16px_-4px_rgba(34,211,238,0.5)] backdrop-blur-sm transition duration-200 hover:scale-110 hover:border-cyan-300/70 hover:shadow-[0_0_24px_-4px_rgba(34,211,238,0.65)] active:scale-95",
                z.style,
              )}
            >
              <Icon className="h-3.5 w-3.5" aria-hidden />
              <span className="sr-only">{z.label}</span>
            </button>
          );
        })}
      </div>

      <p className="mt-4 text-center text-[10px] text-muted">
        Placeholder visualization · not clinical · not a body map yet
      </p>
    </div>
  );
}
