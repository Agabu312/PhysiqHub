"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  BookOpen,
  Dumbbell,
  Droplets,
  Gauge,
  Home,
  LayoutDashboard,
  Menu,
  PieChart,
  Ruler,
  Settings,
  Sparkles,
  UserRound,
  Users,
  X,
} from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { toolAccent } from "@/components/tool/tool-accent";
import { cn } from "@/lib/cn";
import type { ToolCategory } from "@/lib/types";

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  category: ToolCategory;
};

const primaryNav: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, category: "neutral" },
  { href: "/profile", label: "Profile", icon: UserRound, category: "profile" },
];

const toolNav: NavItem[] = [
  { href: "/tools/calorie-macro", label: "Calorie & macros", icon: PieChart, category: "macros" },
  { href: "/tools/water-intake", label: "Water intake", icon: Droplets, category: "water" },
  { href: "/tools/progress-journal", label: "Progress journal", icon: BookOpen, category: "journal" },
  { href: "/tools/one-rep-max", label: "1RM calculator", icon: Gauge, category: "oneRm" },
  { href: "/tools/workout-split", label: "Workout split", icon: Dumbbell, category: "split" },
  { href: "/tools/body-fat", label: "Body fat estimator", icon: Ruler, category: "bodyFat" },
];

const secondaryNav: NavItem[] = [
  { href: "/community", label: "Community", icon: Users, category: "community" },
  { href: "/settings", label: "Settings", icon: Settings, category: "settings" },
];

const mainNav: NavItem[] = [...primaryNav, ...toolNav, ...secondaryNav];

const bottomNav = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard, category: "neutral" as const },
  { href: "/tools/calorie-macro", label: "Macros", icon: PieChart, category: "macros" as const },
  { href: "/tools/water-intake", label: "Water", icon: Droplets, category: "water" as const },
  { href: "/tools/progress-journal", label: "Journal", icon: BookOpen, category: "journal" as const },
] as const;

const moreTools = mainNav.filter((i) =>
  [
    "/profile",
    "/tools/one-rep-max",
    "/tools/workout-split",
    "/tools/body-fat",
    "/community",
    "/settings",
  ].includes(i.href),
);

function navActive(pathname: string, href: string): boolean {
  if (href === "/dashboard") return pathname === "/dashboard";
  if (href === "/profile") return pathname === "/profile";
  return pathname.startsWith(href);
}

function navButtonClass(active: boolean, category: ToolCategory): string {
  const a = toolAccent(category);
  return cn(
    "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition duration-200",
    active
      ? cn(
          a.soft,
          a.text,
          "shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]",
          a.border,
          a.glow,
        )
      : cn(
          "text-muted hover:bg-surface-elevated hover:text-foreground",
          "hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)]",
        ),
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-border glass-panel">
        <div className="mx-auto flex h-14 max-w-[100rem] items-center gap-3 px-4 sm:h-16 sm:px-6 lg:px-10">
          <BrandLogo href="/dashboard" className="shrink-0 text-sm sm:text-base" />
          <div className="hidden min-w-0 flex-1 items-center gap-1 sm:flex md:gap-2">
            <span className="ml-1 truncate text-[11px] font-medium uppercase tracking-[0.14em] text-muted md:ml-2">
              Local suite
            </span>
          </div>
          <div className="flex flex-1 items-center justify-end gap-1 sm:flex-none sm:gap-2">
            <Link
              href="/profile"
              title="Profile"
              className={cn(
                "hidden rounded-xl p-2.5 transition duration-200 sm:inline-flex",
                navActive(pathname, "/profile")
                  ? cn(
                      toolAccent("profile").soft,
                      toolAccent("profile").text,
                      "ring-1 ring-white/10",
                    )
                  : "text-muted hover:bg-surface-elevated hover:text-foreground",
              )}
            >
              <UserRound className="h-5 w-5" aria-hidden />
              <span className="sr-only">Profile</span>
            </Link>
            <Link
              href="/settings"
              title="Settings"
              className={cn(
                "hidden rounded-xl p-2.5 transition duration-200 sm:inline-flex",
                navActive(pathname, "/settings")
                  ? cn(
                      toolAccent("settings").soft,
                      toolAccent("settings").text,
                      "ring-1 ring-white/10",
                    )
                  : "text-muted hover:bg-surface-elevated hover:text-foreground",
              )}
            >
              <Settings className="h-5 w-5" aria-hidden />
              <span className="sr-only">Settings</span>
            </Link>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className={cn(
                "inline-flex items-center gap-2 rounded-xl border border-border bg-surface-elevated/60 px-3 py-2 text-sm font-medium text-foreground shadow-sm transition duration-200",
                "hover:border-border-strong hover:bg-surface-elevated active:scale-[0.98]",
                menuOpen && "border-accent/40 bg-accent-soft/30 text-accent",
              )}
              aria-expanded={menuOpen}
              aria-controls="app-nav-panel"
            >
              <Menu className="h-4 w-4 shrink-0" aria-hidden />
              <span className="hidden sm:inline">Menu</span>
            </button>
          </div>
        </div>
      </header>

      {menuOpen ? (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Navigation">
          <button
            type="button"
            className="absolute inset-0 bg-black/45 backdrop-blur-[2px] transition-opacity"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
          />
          <div
            id="app-nav-panel"
            className={cn(
              "absolute right-0 top-0 flex h-full w-[min(100vw-0.75rem,22rem)] flex-col border-l border-border glass-panel-strong shadow-2xl",
              "animate-nav-panel-in motion-reduce:animate-none",
            )}
          >
            <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-3">
              <div className="flex min-w-0 items-center gap-2">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent ring-1 ring-white/10">
                  <Sparkles className="h-4 w-4" aria-hidden />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">Navigate</p>
                  <p className="truncate text-[11px] text-muted">Tools stay one tap away</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="rounded-xl p-2 text-muted transition hover:bg-surface-elevated hover:text-foreground"
                aria-label="Close"
              >
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>
            <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-3" aria-label="Main">
              <p className="px-2 pb-1 text-[10px] font-bold uppercase tracking-widest text-muted">Home</p>
              {primaryNav.map((item) => {
                const Icon = item.icon;
                const active = navActive(pathname, item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={navButtonClass(active, item.category)}
                    onClick={() => setMenuOpen(false)}
                  >
                    <span
                      className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ring-1 ring-white/5 transition duration-200",
                        active
                          ? cn(
                              toolAccent(item.category).soft,
                              toolAccent(item.category).text,
                              "shadow-[0_0_20px_-8px_var(--color-border)]",
                            )
                          : "bg-surface-elevated/40 text-muted group-hover:bg-surface-elevated group-hover:text-foreground",
                      )}
                    >
                      <Icon className="h-4 w-4" aria-hidden />
                    </span>
                    <span className="min-w-0 truncate">{item.label}</span>
                  </Link>
                );
              })}
              <p className="mt-4 px-2 pb-1 text-[10px] font-bold uppercase tracking-widest text-muted">
                Tools
              </p>
              {toolNav.map((item) => {
                const Icon = item.icon;
                const active = navActive(pathname, item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={navButtonClass(active, item.category)}
                    onClick={() => setMenuOpen(false)}
                  >
                    <span
                      className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ring-1 ring-white/5 transition duration-200",
                        active
                          ? cn(
                              toolAccent(item.category).soft,
                              toolAccent(item.category).text,
                              "shadow-[0_0_20px_-8px_var(--color-border)]",
                            )
                          : "bg-surface-elevated/40 text-muted group-hover:bg-surface-elevated group-hover:text-foreground",
                      )}
                    >
                      <Icon className="h-4 w-4" aria-hidden />
                    </span>
                    <span className="min-w-0 truncate">{item.label}</span>
                  </Link>
                );
              })}
              <p className="mt-4 px-2 pb-1 text-[10px] font-bold uppercase tracking-widest text-muted">
                More
              </p>
              {secondaryNav.map((item) => {
                const Icon = item.icon;
                const active = navActive(pathname, item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={navButtonClass(active, item.category)}
                    onClick={() => setMenuOpen(false)}
                  >
                    <span
                      className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ring-1 ring-white/5 transition duration-200",
                        active
                          ? cn(
                              toolAccent(item.category).soft,
                              toolAccent(item.category).text,
                              "shadow-[0_0_20px_-8px_var(--color-border)]",
                            )
                          : "bg-surface-elevated/40 text-muted group-hover:bg-surface-elevated group-hover:text-foreground",
                      )}
                    >
                      <Icon className="h-4 w-4" aria-hidden />
                    </span>
                    <span className="min-w-0 truncate">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
            <div className="border-t border-border p-3">
              <Link
                href="/onboarding"
                onClick={() => setMenuOpen(false)}
                className="mb-2 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted transition-colors hover:bg-surface-elevated hover:text-foreground"
              >
                <Sparkles className="h-4 w-4" aria-hidden />
                Onboarding
              </Link>
              <Link
                href="/"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted transition-colors hover:bg-surface-elevated hover:text-foreground"
              >
                <Home className="h-4 w-4" aria-hidden />
                Marketing site
              </Link>
            </div>
          </div>
        </div>
      ) : null}

      <main className="mx-auto w-full max-w-[100rem] flex-1 px-4 py-8 pb-[calc(var(--bottom-nav-h)+1.5rem)] sm:px-6 sm:py-10 lg:px-10 lg:py-12 xl:px-14">
        {children}
      </main>
      <MobileBottomNav pathname={pathname} />
    </div>
  );
}

function MobileBottomNav({ pathname }: { pathname: string }) {
  const [moreOpen, setMoreOpen] = useState(false);
  const moreActive = moreTools.some((t) => navActive(pathname, t.href));

  return (
    <>
      {moreOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm md:hidden"
          aria-label="Close menu"
          onClick={() => setMoreOpen(false)}
        />
      ) : null}
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 border-t border-border glass-panel-strong md:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
        aria-label="Quick navigation"
      >
        {moreOpen ? (
          <div className="max-h-[45vh] overflow-y-auto border-b border-border px-4 py-3">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">More</p>
            <div className="flex flex-col gap-1">
              {moreTools.map((item) => {
                const Icon = item.icon;
                const a = toolAccent(item.category);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMoreOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-foreground hover:bg-surface-elevated"
                  >
                    <Icon className={cn("h-4 w-4", a.text)} aria-hidden />
                    {item.label}
                  </Link>
                );
              })}
              <Link
                href="/onboarding"
                onClick={() => setMoreOpen(false)}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted hover:bg-surface-elevated hover:text-foreground"
              >
                <Sparkles className="h-4 w-4" aria-hidden />
                Onboarding
              </Link>
            </div>
          </div>
        ) : null}
        <div
          className="mx-auto flex max-w-lg items-stretch justify-around gap-1 px-2"
          style={{ height: "var(--bottom-nav-h)" }}
        >
          {bottomNav.map((item) => {
            const Icon = item.icon;
            const active = navActive(pathname, item.href);
            const a = toolAccent(item.category);
            return (
              <Link
                key={item.href}
                href={item.href}
                title={item.label}
                className={cn(
                  "flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-colors",
                  active ? a.text : "text-muted",
                )}
              >
                <span
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-xl ring-1 ring-white/5 transition-all duration-200",
                    active ? cn(a.soft, a.text, "scale-105 shadow-[0_0_24px_-10px_var(--color-border)]") : "bg-surface-elevated/30",
                  )}
                >
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
          <button
            type="button"
            onClick={() => setMoreOpen((o) => !o)}
            className={cn(
              "flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-colors",
              moreOpen || moreActive ? "text-accent" : "text-muted",
            )}
          >
            <span
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-xl transition-transform duration-200",
                moreOpen || moreActive ? "bg-accent-soft scale-105" : "bg-transparent",
              )}
            >
              <Activity className="h-5 w-5" aria-hidden />
            </span>
            <span className="truncate">More</span>
          </button>
        </div>
      </nav>
    </>
  );
}
