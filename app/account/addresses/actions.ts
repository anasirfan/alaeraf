"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type AddressState = { error?: string; success?: boolean } | undefined;

/**
 * Parses + range-validates optional lat/lng from a form. Never trusts the
 * client blindly: malformed or out-of-range values are rejected outright
 * rather than silently stored, since these coordinates are what the
 * existing PostGIS delivery-radius functions (0003_functions.sql) will
 * eventually query against.
 */
function parseCoords(latRaw: FormDataEntryValue | null, lngRaw: FormDataEntryValue | null) {
  const latStr = String(latRaw ?? "").trim();
  const lngStr = String(lngRaw ?? "").trim();

  if (!latStr && !lngStr) {
    return { lat: null, lng: null };
  }
  if (!latStr || !lngStr) {
    throw new Error("Provide both latitude and longitude, or leave both blank.");
  }

  const lat = Number(latStr);
  const lng = Number(lngStr);

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    throw new Error("Location coordinates must be numbers.");
  }
  if (lat < -90 || lat > 90) {
    throw new Error("Latitude must be between -90 and 90.");
  }
  if (lng < -180 || lng > 180) {
    throw new Error("Longitude must be between -180 and 180.");
  }

  return { lat, lng };
}

function readAddressFields(formData: FormData) {
  const recipientName = String(formData.get("recipientName") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const addressLine = String(formData.get("addressLine") ?? "").trim();
  const area = String(formData.get("area") ?? "").trim();
  const deliveryNotes = String(formData.get("deliveryNotes") ?? "").trim();
  const { lat, lng } = parseCoords(formData.get("latitude"), formData.get("longitude"));

  if (!recipientName || !phone || !addressLine) {
    throw new Error("Recipient name, phone, and address are required.");
  }

  return {
    recipient_name: recipientName,
    phone,
    address_line: addressLine,
    area: area || null,
    latitude: lat,
    longitude: lng,
    delivery_notes: deliveryNotes || null,
  };
}

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Please log in again.");
  return { supabase, user };
}

export async function createAddressAction(_prevState: AddressState, formData: FormData): Promise<AddressState> {
  try {
    const { supabase, user } = await requireUser();
    const fields = readAddressFields(formData);
    const makeDefault = formData.get("isDefault") === "on";

    const { data: inserted, error } = await supabase
      .from("addresses")
      .insert({ customer_id: user.id, ...fields })
      .select("id")
      .single();

    if (error || !inserted) {
      return { error: "Couldn't save this address. Please try again." };
    }

    if (makeDefault) {
      await applyDefault(supabase, user.id, inserted.id);
    }

    revalidatePath("/account/addresses");
    revalidatePath("/checkout");
    return { success: true };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Something went wrong." };
  }
}

export async function updateAddressAction(_prevState: AddressState, formData: FormData): Promise<AddressState> {
  try {
    const { supabase, user } = await requireUser();
    const id = String(formData.get("id") ?? "");
    if (!id) return { error: "Missing address." };

    const fields = readAddressFields(formData);
    const makeDefault = formData.get("isDefault") === "on";

    // RLS (addresses_owner_update) already scopes this to the caller's own
    // rows — the .eq("customer_id", ...) here is defense-in-depth, not the
    // only thing standing between customers and each other's addresses.
    const { error } = await supabase
      .from("addresses")
      .update(fields)
      .eq("id", id)
      .eq("customer_id", user.id);

    if (error) {
      return { error: "Couldn't save your changes. Please try again." };
    }

    if (makeDefault) {
      await applyDefault(supabase, user.id, id);
    }

    revalidatePath("/account/addresses");
    revalidatePath("/checkout");
    return { success: true };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Something went wrong." };
  }
}

export async function deleteAddressAction(formData: FormData): Promise<void> {
  const { supabase, user } = await requireUser();
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await supabase.from("addresses").delete().eq("id", id).eq("customer_id", user.id);
  revalidatePath("/account/addresses");
  revalidatePath("/checkout");
}

export async function setDefaultAddressAction(formData: FormData): Promise<void> {
  const { supabase, user } = await requireUser();
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await applyDefault(supabase, user.id, id);
  revalidatePath("/account/addresses");
  revalidatePath("/checkout");
}

/**
 * Clears is_default on the customer's other addresses, then sets it on the
 * target — done as two sequential statements so the
 * addresses_one_default_per_customer partial unique index (0006 migration)
 * is never violated: at no point do two rows for the same customer have
 * is_default = true at once.
 */
async function applyDefault(
  supabase: Awaited<ReturnType<typeof createClient>>,
  customerId: string,
  addressId: string,
) {
  await supabase
    .from("addresses")
    .update({ is_default: false })
    .eq("customer_id", customerId)
    .eq("is_default", true)
    .neq("id", addressId);

  await supabase.from("addresses").update({ is_default: true }).eq("id", addressId).eq("customer_id", customerId);
}
