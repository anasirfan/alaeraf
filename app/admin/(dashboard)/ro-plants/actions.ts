"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/authorize";
import { countOrdersForRoPlant } from "@/lib/ro-plants/adminRoPlants";

export type RoPlantState = { error?: string; success?: boolean } | undefined;

function readRoPlantFields(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();
  const latitudeRaw = String(formData.get("latitude") ?? "").trim();
  const longitudeRaw = String(formData.get("longitude") ?? "").trim();
  const radiusRaw = String(formData.get("deliveryRadiusKm") ?? "").trim();
  const isActive = formData.get("isActive") === "on";

  if (!name) {
    throw new Error("Plant name is required.");
  }

  const latitude = Number(latitudeRaw);
  if (!latitudeRaw || !Number.isFinite(latitude) || latitude < -90 || latitude > 90) {
    throw new Error("Latitude must be a number between -90 and 90.");
  }

  const longitude = Number(longitudeRaw);
  if (!longitudeRaw || !Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
    throw new Error("Longitude must be a number between -180 and 180.");
  }

  const deliveryRadiusKm = Number(radiusRaw || "5");
  if (!Number.isFinite(deliveryRadiusKm) || deliveryRadiusKm <= 0) {
    throw new Error("Delivery radius must be a number greater than 0.");
  }

  return {
    name,
    address: address || null,
    latitude,
    longitude,
    delivery_radius_km: deliveryRadiusKm,
    is_active: isActive,
  };
}

export async function createRoPlantAction(_prevState: RoPlantState, formData: FormData): Promise<RoPlantState> {
  try {
    const { supabase } = await requireAdmin();
    const fields = readRoPlantFields(formData);

    const { error } = await supabase.from("ro_plants").insert(fields);
    if (error) {
      return { error: "Couldn't create this RO plant. Please try again." };
    }

    revalidatePath("/admin/ro-plants");
    return { success: true };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Something went wrong." };
  }
}

export async function updateRoPlantAction(_prevState: RoPlantState, formData: FormData): Promise<RoPlantState> {
  try {
    const { supabase } = await requireAdmin();
    const id = String(formData.get("id") ?? "");
    if (!id) return { error: "Missing RO plant." };

    const fields = readRoPlantFields(formData);

    const { error } = await supabase.from("ro_plants").update(fields).eq("id", id);
    if (error) {
      return { error: "Couldn't save your changes. Please try again." };
    }

    revalidatePath("/admin/ro-plants");
    return { success: true };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Something went wrong." };
  }
}

export type DeleteRoPlantState = { error?: string } | undefined;

export async function deleteRoPlantAction(
  _prevState: DeleteRoPlantState,
  formData: FormData,
): Promise<DeleteRoPlantState> {
  try {
    const { supabase } = await requireAdmin();
    const id = String(formData.get("id") ?? "");
    if (!id) return { error: "Missing RO plant." };

    // Unlike categories/products, deleting a plant is never blocked —
    // orders.assigned_ro_plant_id is ON DELETE SET NULL, so historical
    // orders simply lose their plant reference rather than the delete
    // being refused. Still worth warning the admin up front (see the
    // confirm() in RoPlantList.tsx), since it's one-way.
    await countOrdersForRoPlant(supabase, id);

    const { error } = await supabase.from("ro_plants").delete().eq("id", id);
    if (error) {
      return { error: "Couldn't delete this RO plant. Please try again." };
    }

    revalidatePath("/admin/ro-plants");
    return undefined;
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Something went wrong." };
  }
}

export async function toggleRoPlantActiveAction(formData: FormData): Promise<void> {
  const { supabase } = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const nextActive = formData.get("nextActive") === "true";
  if (!id) return;

  await supabase.from("ro_plants").update({ is_active: nextActive }).eq("id", id);
  revalidatePath("/admin/ro-plants");
}
