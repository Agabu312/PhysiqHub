import type { Metadata } from "next";
import { CalorieMacroClient } from "@/components/calorie-macro-client";

export const metadata: Metadata = {
  title: "Calorie & macro calculator",
};

export default function CalorieMacroPage() {
  return <CalorieMacroClient />;
}
