import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { listRoPlantsForAdmin } from "@/lib/ro-plants/adminRoPlants";
import { RoPlantList } from "./RoPlantList";
import { AddRoPlantPanel } from "./AddRoPlantPanel";

export const metadata: Metadata = {
  title: "RO Plants — Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminRoPlantsPage() {
  const supabase = await createClient();
  const plants = await listRoPlantsForAdmin(supabase);

  return (
    <div>
      <div className="mb-8">
        <h2 className="font-display text-2xl text-forest">RO Plants</h2>
        <p className="mt-1.5 text-sm text-muted">
          Every active plant&apos;s location and delivery radius here is what actually decides whether an
          address can check out or subscribe — checkout, subscriptions, and the live &quot;in/out of
          range&quot; badges on Orders and Subscriptions all read directly from this list.
        </p>
      </div>

      <div className="mb-6 rounded-sm border border-line bg-mist/60 p-4 text-sm text-muted">
        Get exact coordinates from Google Maps: right-click the precise spot on the map, then click the
        latitude/longitude that appears at the top of the menu to copy it.
      </div>

      <div className="flex flex-col gap-8">
        <RoPlantList plants={plants} />
        <AddRoPlantPanel hasPlants={plants.length > 0} />
      </div>
    </div>
  );
}
