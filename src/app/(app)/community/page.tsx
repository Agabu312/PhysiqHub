import type { Metadata } from "next";
import { CommunityPreviewClient } from "@/components/community-preview-client";

export const metadata: Metadata = {
  title: "Community preview",
};

export default function CommunityPage() {
  return <CommunityPreviewClient />;
}
