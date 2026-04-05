import type { Metadata } from "next";
import { OneRepMaxClient } from "@/components/one-rep-max-client";

export const metadata: Metadata = {
  title: "1RM calculator",
};

export default function OneRepMaxPage() {
  return <OneRepMaxClient />;
}
