import type { Metadata } from "next";
import { BodyFatClient } from "@/components/body-fat-client";

export const metadata: Metadata = {
  title: "Body fat estimator",
};

export default function BodyFatPage() {
  return <BodyFatClient />;
}
