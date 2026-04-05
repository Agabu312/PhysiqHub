"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { popCelebration } from "@/lib/celebration-queue";
import { cn } from "@/lib/cn";

export function CelebrationToast() {
  const [msg, setMsg] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const next = popCelebration();
    if (next) {
      setMsg(next);
      requestAnimationFrame(() => setVisible(true));
      const t = setTimeout(() => {
        setVisible(false);
        setTimeout(() => setMsg(null), 300);
      }, 4200);
      return () => clearTimeout(t);
    }
  }, []);

  if (!msg) return null;

  return (
    <div
      className={cn(
        "fixed bottom-[calc(var(--bottom-nav-h)+1rem)] left-1/2 z-[60] w-[min(100%-2rem,24rem)] -translate-x-1/2 md:bottom-8",
        "transition-all duration-300 ease-out",
        visible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
      )}
      role="status"
    >
      <div className="flex items-start gap-3 rounded-2xl border border-emerald-500/30 bg-surface-elevated/95 px-4 py-3 shadow-[0_0_40px_-12px_rgba(74,222,128,0.45)] backdrop-blur-md">
        <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(74,222,128,0.8)]" />
        <p className="flex-1 text-sm font-medium text-foreground leading-snug">{msg}</p>
        <button
          type="button"
          className="rounded-lg p-1 text-muted transition hover:bg-surface-elevated hover:text-foreground active:scale-95"
          aria-label="Dismiss"
          onClick={() => {
            setVisible(false);
            setTimeout(() => setMsg(null), 200);
          }}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
