import type { Metadata } from "next";
import { WorkoutSplitClient } from "@/components/workout-split-client";

export const metadata: Metadata = {
  title: "Workout split generator",
};

export default function WorkoutSplitPage() {
  return <WorkoutSplitClient />;
}
