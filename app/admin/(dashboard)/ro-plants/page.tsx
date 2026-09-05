import type { Metadata } from "next";
import { Droplets } from "lucide-react";
import { ComingSoon } from "@/components/admin/ComingSoon";

export const metadata: Metadata = {
  title: "RO Plants — Admin",
  robots: { index: false, follow: false },
};

export default function AdminRoPlantsPage() {
  return (
    <ComingSoon
      icon={Droplets}
      title="RO Plant Management"
      description="Manage RO water plant locations, delivery radii, and availability — coming in a later phase."
    />
  );
}
