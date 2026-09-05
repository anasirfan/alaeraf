import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

type SupabaseServerClient = SupabaseClient<Database>;
export type RoPlantRow = Database["public"]["Tables"]["ro_plants"]["Row"];

/**
 * ro_plants has no public SELECT policy at all (0004_rls_policies.sql) —
 * only admins (via ro_plants_admin_all) and the security-definer
 * nearest_eligible_ro_plant()/is_delivery_available() functions can read
 * it. These queries always run through the cookie-aware admin server
 * client, exactly like every other admin screen — never the service-role
 * client.
 */
export async function listRoPlantsForAdmin(supabase: SupabaseServerClient): Promise<RoPlantRow[]> {
  const { data, error } = await supabase.from("ro_plants").select("*").order("name", { ascending: true });
  if (error) throw new Error("Couldn't load RO plants.");
  return data ?? [];
}

export async function getRoPlantById(supabase: SupabaseServerClient, id: string): Promise<RoPlantRow | null> {
  const { data, error } = await supabase.from("ro_plants").select("*").eq("id", id).maybeSingle();
  if (error) return null;
  return data;
}

/**
 * Orders keep an assigned_ro_plant_id with ON DELETE SET NULL
 * (0002_tables.sql) — deleting a plant never fails or orphans historical
 * orders, it just clears their plant reference. Still worth telling the
 * admin how many orders reference it, so a delete isn't a surprise.
 */
export async function countOrdersForRoPlant(supabase: SupabaseServerClient, plantId: string): Promise<number> {
  const { count } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .eq("assigned_ro_plant_id", plantId);
  return count ?? 0;
}
