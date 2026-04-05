import type { Metadata } from "next";
import { ProfileClient } from "@/components/profile-client";

export const metadata: Metadata = {
  title: "Profile",
};

export default function ProfilePage() {
  return <ProfileClient />;
}
