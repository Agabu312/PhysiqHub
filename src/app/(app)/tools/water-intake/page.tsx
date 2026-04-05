import type { Metadata } from "next";
import { WaterIntakeClient } from "@/components/water-intake-client";

export const metadata: Metadata = {
  title: "Water intake",
};

export default function WaterIntakePage() {
  return <WaterIntakeClient />;
}
