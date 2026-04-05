import { Card } from "@/components/ui/card";
import { toolAccent } from "@/components/tool/tool-accent";
import { cn } from "@/lib/cn";
import type { ToolCategory } from "@/lib/types";

export function StatCard({
  label,
  value,
  hint,
  category,
}: {
  label: string;
  value: string;
  hint: string;
  category: ToolCategory;
}) {
  const a = toolAccent(category);
  return (
    <Card
      className={cn(
        "p-5 transition duration-300",
        "hover:-translate-y-1",
        a.border,
        "shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)]",
        a.glow,
      )}
    >
      <p className={cn("text-[10px] font-bold uppercase tracking-widest", a.text)}>{label}</p>
      <p className="mt-2 text-2xl font-semibold tabular-nums text-foreground">{value}</p>
      <p className="text-xs text-muted">{hint}</p>
    </Card>
  );
}
