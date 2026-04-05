import type { Metadata } from "next";
import { ProgressJournalClient } from "@/components/progress-journal-client";

export const metadata: Metadata = {
  title: "Progress journal",
};

export default function ProgressJournalPage() {
  return <ProgressJournalClient />;
}
