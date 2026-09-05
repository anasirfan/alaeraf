import type { Metadata } from "next";
import { ClipboardList } from "lucide-react";
import { ComingSoon } from "@/components/admin/ComingSoon";

export const metadata: Metadata = {
  title: "Orders — Admin",
  robots: { index: false, follow: false },
};

export default function AdminOrdersPage() {
  return (
    <ComingSoon
      icon={ClipboardList}
      title="Order Management"
      description="Review incoming orders, update statuses, and track deliveries — coming in a later phase."
    />
  );
}
