import Link from "next/link";
import { Globe2, Lock, Users } from "lucide-react";
import { ToolPageHeader } from "@/components/tool/tool-accent";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ButtonLink } from "@/components/landing/button-link";

/**
 * Product-ready preview for a future network-enabled PhysiquHub.
 * No API calls, no user directory—just the promise and eligibility rules.
 */
export function CommunityPreviewClient() {
  return (
    <div>
      <ToolPageHeader
        category="community"
        title="Community preview"
        subtitle="A roadmap-facing screen. Today everything stays on your device; tomorrow this becomes opt-in discovery for athletes who choose to be visible."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card variant="strong" className="p-6 lg:col-span-2">
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cat-community/15 text-cat-community ring-1 ring-cat-community/25">
              <Users className="h-6 w-6" aria-hidden />
            </span>
            <div>
              <h2 className="text-xl font-semibold text-foreground">Network mode is not live yet</h2>
              <p className="mt-3 text-sm text-muted leading-relaxed">
                This page exists so the product story stays coherent. The current build has{" "}
                <strong className="text-foreground">no accounts, no sync, and no public profile
                directory</strong>. When a cloud-backed version ships, only people who explicitly set{" "}
                <strong className="text-foreground">Profile visibility → Public</strong> in Settings would
                be eligible to appear in community views. Everyone else remains private by default.
              </p>
              <p className="mt-4 text-sm text-muted leading-relaxed">
                Region and language fields you save today are intentionally forward-looking: they will
                power filters (e.g., “trainers near my region”) rather than changing anything about this
                offline build.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <ButtonLink href="/settings" variant="primary">
                  Open settings
                </ButtonLink>
                <ButtonLink href="/dashboard" variant="secondary">
                  Back to dashboard
                </ButtonLink>
              </div>
            </div>
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="p-6">
            <CardHeader className="!mb-2">
              <CardTitle className="!text-base flex items-center gap-2">
                <Lock className="h-4 w-4 text-cat-community" aria-hidden />
                Privacy first
              </CardTitle>
              <CardDescription>
                Private remains the safer default. Public is always opt-in and reversible.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="p-6">
            <CardHeader className="!mb-2">
              <CardTitle className="!text-base flex items-center gap-2">
                <Globe2 className="h-4 w-4 text-cat-community" aria-hidden />
                Future filters
              </CardTitle>
              <CardDescription>
                Region + language will gate discovery—not ranking secret scores.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>

      <Card className="mt-8 border-dashed border-cat-community/35 p-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted">
          TODO — backend architecture (not implemented)
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted">
          <li>Authenticated user records with explicit visibility enum.</li>
          <li>Geo/locale index for opt-in discovery queries only.</li>
          <li>Moderation + block/report flows before any public listing ships.</li>
        </ul>
        <p className="mt-4 text-sm text-muted">
          Read the{" "}
          <Link href="/legal/privacy" className="text-accent hover:underline">
            Privacy Policy
          </Link>{" "}
          for how data handling is described today.
        </p>
      </Card>
    </div>
  );
}
