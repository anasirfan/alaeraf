import type { Metadata } from "next";
import { Users } from "lucide-react";
import { ComingSoon } from "@/components/admin/ComingSoon";

export const metadata: Metadata = {
  title: "Customers — Admin",
  robots: { index: false, follow: false },
};

export default function AdminCustomersPage() {
  return (
    <ComingSoon
      icon={Users}
      title="Customer Management"
      description="A directory of registered customers and their order history — coming in a later phase."
    />
  );
}
