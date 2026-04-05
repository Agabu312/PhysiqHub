import type { ComponentType } from "react";
import {
  Activity,
  Brain,
  Dumbbell,
  Droplets,
  Fingerprint,
  Gauge,
  LineChart,
  Lock,
  PieChart,
  Ruler,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { ButtonLink } from "@/components/landing/button-link";
import { SiteFooter } from "@/components/landing/site-footer";
import { SiteHeader } from "@/components/landing/site-header";
import { LandingActions } from "@/components/landing-actions";
import { SectionHeading } from "@/components/ui/section-heading";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";

export default function HomePage() {
  return (
    <div className="relative min-h-screen">
      <SiteHeader />

      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 opacity-90"
          aria-hidden
          style={{
            background:
              "radial-gradient(55% 45% at 50% 0%, rgba(45,212,191,0.2), transparent), radial-gradient(40% 35% at 90% 10%, rgba(167,139,250,0.18), transparent)",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-4 pb-20 pt-12 md:px-8 md:pb-28 md:pt-20">
          <div className="mx-auto max-w-4xl text-center">
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-border-strong bg-surface-elevated/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              <Sparkles className="h-3.5 w-3.5" aria-hidden />
              Local-first fitness OS
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-[3.5rem] lg:leading-[1.08]">
              Train with precision.{" "}
              <span className="bg-gradient-to-r from-teal-300 via-cyan-300 to-violet-400 bg-clip-text text-transparent">
                Stay in control.
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted leading-relaxed md:text-xl">
              PhysiquHub turns your physiology into clear daily targets—macros, hydration, and
              check-ins—without accounts, servers, or noise. Everything lives in your browser until you
              say otherwise.
            </p>
            <LandingActions />
            <p className="mt-6 text-xs text-muted">
              No login · No database · Optional onboarding in under two minutes
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-5xl gap-4 md:grid-cols-3">
            <HeroStat label="Energy availability" value="Modeled" hint="From your profile + logs" />
            <HeroStat label="Hydration" value="Tracked" hint="Daily reset, tap-to-log" />
            <HeroStat label="Privacy" value="Yours" hint="localStorage only in v1" />
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-6xl px-4 py-16 md:px-8 md:py-24">
        <SectionHeading
          eyebrow="Capability"
          title="Everything you need to execute, nothing you do not"
          description="A cohesive toolkit for people who like data—but hate clutter."
        />
        <div className="grid gap-5 md:grid-cols-3">
          <FeatureCard
            icon={PieChart}
            title="Nutrition targets"
            body="Translate body stats into calories and macros you can actually follow, with context for your goal."
          />
          <FeatureCard
            icon={Droplets}
            title="Hydration you can feel"
            body="A daily target from weight and climate, plus a tap-friendly tracker that resets cleanly each morning."
          />
          <FeatureCard
            icon={LineChart}
            title="Progress that compounds"
            body="Short check-ins build a trend line over time—mood, energy, weight, and training notes in one place."
          />
        </div>
      </section>

      <section id="how" className="border-y border-border/80 bg-surface/40 py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 md:px-8">
          <SectionHeading
            eyebrow="How it works"
            title="Three calm steps. One consistent rhythm."
            description="Designed to feel like a product—not a slide deck."
            align="center"
            className="!mb-14"
          />
          <div className="grid gap-6 md:grid-cols-3">
            <HowStep
              step="01"
              title="Personalize"
              body="Tell PhysiquHub how you train, recover, and what you are chasing. It stays on-device."
              icon={Fingerprint}
            />
            <HowStep
              step="02"
              title="Plan daily levers"
              body="Use macros and hydration as simple dials—small wins that protect performance."
              icon={Target}
            />
            <HowStep
              step="03"
              title="Reflect in seconds"
              body="One journal line a day keeps drift visible before it becomes a plateau."
              icon={Brain}
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 md:px-8 md:py-24">
        <SectionHeading
          eyebrow="Personalization"
          title="Built around your physiology—not generic templates"
          description="Your age, size, activity, and goal shape the math. The interface stays quiet so the signal reads clearly."
        />
        <div className="grid gap-5 lg:grid-cols-2">
          <Card variant="strong" className="p-8 md:p-10">
            <Zap className="h-10 w-10 text-accent" aria-hidden />
            <h3 className="mt-6 text-xl font-semibold text-foreground">Adaptive suggestions</h3>
            <p className="mt-3 text-muted leading-relaxed">
              The dashboard synthesizes hydration, your stated goal, and recent check-ins into one
              actionable nudge—never a lecture.
            </p>
          </Card>
          <Card variant="strong" className="p-8 md:p-10">
            <Activity className="h-10 w-10 text-accent-secondary" aria-hidden />
            <h3 className="mt-6 text-xl font-semibold text-foreground">Readiness snapshot</h3>
            <p className="mt-3 text-muted leading-relaxed">
              Recover, maintain, or push—plain language informed by your latest journal signals, not
              wearables you do not own.
            </p>
          </Card>
        </div>
      </section>

      <section id="tools" className="mx-auto max-w-6xl px-4 py-16 md:px-8 md:pb-24">
        <SectionHeading
          eyebrow="Tool suite"
          title="A full workspace, shipping in waves"
          description="Macros, water, and journal are live. The rest are crafted placeholders—same polish, zero fake data."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <ToolShowcase
            href="/tools/calorie-macro"
            icon={PieChart}
            title="Calorie & macro calculator"
            status="Live"
            body="Mifflin–St Jeor BMR, activity-adjusted TDEE, and macro splits for cut, maintenance, and gain."
          />
          <ToolShowcase
            href="/tools/water-intake"
            icon={Droplets}
            title="Water intake"
            status="Live"
            body="Climate-aware targets with a tap tracker that respects the calendar day."
          />
          <ToolShowcase
            href="/tools/progress-journal"
            icon={LineChart}
            title="Progress journal"
            status="Live"
            body="Weight trend, mood and energy, training notes—stored locally, deletable anytime."
          />
          <ToolShowcase
            href="/tools/one-rep-max"
            icon={Gauge}
            title="1RM calculator"
            status="Live"
            body="Epley, Brzycki, and Lombardi estimates with zones, percentage tables, and lift history."
          />
          <ToolShowcase
            href="/tools/workout-split"
            icon={Dumbbell}
            title="Workout split generator"
            status="Live"
            body="Goal-aware weekly splits with set/rep guidance, regenerate, and saved favorites."
          />
          <ToolShowcase
            href="/tools/body-fat"
            icon={Ruler}
            title="Body fat estimator"
            status="Live"
            body="Navy method (metric), lean/fat mass, categories, and visual guidance—clearly an estimate."
          />
        </div>
      </section>

      <section id="privacy" className="border-t border-border/80 bg-surface/30 py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 md:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <SectionHeading
                eyebrow="Privacy"
                title="Your data never crosses our servers—because there is no server"
                description="Version 1 stores profile, calculator outputs, hydration logs, and journal entries in localStorage. Clear site data and it is gone. That is a feature."
                className="!mb-0"
              />
              <ul className="mt-8 space-y-4 text-sm text-muted">
                <li className="flex gap-3">
                  <Lock className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden />
                  <span>No authentication, no tokens, no third-party analytics in this template.</span>
                </li>
                <li className="flex gap-3">
                  <Fingerprint className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden />
                  <span>Portable philosophy: when you want sync, it will be opt-in—not the default.</span>
                </li>
              </ul>
            </div>
            <Card variant="strong" className="p-8 md:p-10">
              <p className="text-sm font-medium text-foreground">Trust, engineered in</p>
              <p className="mt-3 text-sm text-muted leading-relaxed">
                PhysiquHub is for athletes and coaches who want clarity without handing their diary to
                a platform. We built the UX accordingly: dark, focused, and honest about what is stored
                where.
              </p>
              <ButtonLink href="/onboarding" variant="secondary" className="mt-8">
                Begin onboarding
              </ButtonLink>
            </Card>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 md:px-8 md:py-28">
        <Card variant="strong" className="relative overflow-hidden p-10 text-center md:p-14">
          <div
            className="pointer-events-none absolute inset-0 opacity-40"
            aria-hidden
            style={{
              background:
                "radial-gradient(circle at 30% 20%, rgba(45,212,191,0.35), transparent 50%), radial-gradient(circle at 80% 60%, rgba(167,139,250,0.25), transparent 45%)",
            }}
          />
          <div className="relative">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
              Ready when you are.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted">
              Two minutes of setup, then a dashboard that respects your attention.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <ButtonLink href="/onboarding">Start onboarding</ButtonLink>
              <ButtonLink href="/dashboard" variant="secondary">
                Open dashboard
              </ButtonLink>
            </div>
          </div>
        </Card>
      </section>

      <SiteFooter />
    </div>
  );
}

function HeroStat({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <Card className="p-5 text-left transition duration-300 hover:-translate-y-0.5 hover:border-border-strong">
      <p className="text-xs font-medium uppercase tracking-wider text-muted">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-foreground">{value}</p>
      <p className="mt-1 text-xs text-muted">{hint}</p>
    </Card>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  body,
}: {
  icon: ComponentType<{ className?: string }>;
  title: string;
  body: string;
}) {
  return (
    <Card className="group p-7 transition duration-300 hover:-translate-y-1 hover:border-border-strong">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-soft text-accent transition-transform duration-300 group-hover:scale-105">
        <Icon className="h-6 w-6" aria-hidden />
      </div>
      <h3 className="mt-5 text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-2 text-sm text-muted leading-relaxed">{body}</p>
    </Card>
  );
}

function HowStep({
  step,
  title,
  body,
  icon: Icon,
}: {
  step: string;
  title: string;
  body: string;
  icon: ComponentType<{ className?: string }>;
}) {
  return (
    <Card className="relative p-7 md:p-8">
      <span className="text-xs font-bold text-accent">{step}</span>
      <div className="mt-4 flex h-11 w-11 items-center justify-center rounded-xl bg-surface-elevated text-accent ring-1 ring-border">
        <Icon className="h-5 w-5" aria-hidden />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-2 text-sm text-muted leading-relaxed">{body}</p>
    </Card>
  );
}

function ToolShowcase({
  href,
  icon: Icon,
  title,
  body,
  status,
}: {
  href: string;
  icon: ComponentType<{ className?: string }>;
  title: string;
  body: string;
  status: "Live" | "Soon";
}) {
  return (
    <Link href={href} className="group block h-full">
      <Card className="flex h-full flex-col p-6 transition duration-300 hover:-translate-y-1 hover:border-accent/30">
        <div className="flex items-start justify-between gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-soft text-accent">
            <Icon className="h-5 w-5" aria-hidden />
          </div>
          <span
            className={cn(
              "rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider",
              status === "Live"
                ? "bg-emerald-500/15 text-emerald-400"
                : "bg-violet-500/15 text-violet-300",
            )}
          >
            {status}
          </span>
        </div>
        <h3 className="mt-4 text-base font-semibold text-foreground group-hover:text-accent transition-colors">
          {title}
        </h3>
        <p className="mt-2 flex-1 text-sm text-muted leading-relaxed">{body}</p>
        <span className="mt-4 text-sm font-medium text-accent opacity-90 group-hover:opacity-100">
          Open →
        </span>
      </Card>
    </Link>
  );
}
