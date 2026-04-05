import { AppShell } from "@/components/app-shell";
import { ConsentGate } from "@/components/consent-gate";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ConsentGate>
      <AppShell>{children}</AppShell>
    </ConsentGate>
  );
}
