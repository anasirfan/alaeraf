import type { Metadata } from "next";
import { RefreshCw } from "lucide-react";
import { ComingSoon } from "@/components/admin/ComingSoon";

export const metadata: Metadata = {
  title: "Subscriptions — Admin",
  robots: { index: false, follow: false },
};

export default function AdminSubscriptionsPage() {
  return (
    <ComingSoon
      icon={RefreshCw}
      title="Subscription Management"
      description="Oversee recurring delivery subscriptions and billing cycles — coming in a later phase."
    />
  );
}
