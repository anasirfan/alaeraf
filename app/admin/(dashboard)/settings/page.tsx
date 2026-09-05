import type { Metadata } from "next";
import { Settings } from "lucide-react";
import { ComingSoon } from "@/components/admin/ComingSoon";

export const metadata: Metadata = {
  title: "Settings — Admin",
  robots: { index: false, follow: false },
};

export default function AdminSettingsPage() {
  return (
    <ComingSoon
      icon={Settings}
      title="Store Settings"
      description="Store-wide configuration and preferences — coming in a later phase."
    />
  );
}
