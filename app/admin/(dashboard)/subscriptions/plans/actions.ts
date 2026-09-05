"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/authorize";
import { slugify } from "@/lib/slug";
import type { SubscriptionFrequency } from "@/types/database.types";

export type PlanState = { error?: string; success?: boolean } | undefined;

const VALID_FREQUENCIES: SubscriptionFrequency[] = ["weekly", "fortnightly", "monthly"];

function readPlanFields(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const rawSlug = String(formData.get("slug") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const defaultFrequency = String(formData.get("defaultFrequency") ?? "monthly") as SubscriptionFrequency;
  const isActive = formData.get("isActive") === "on";
  const sortOrderRaw = String(formData.get("sortOrder") ?? "0").trim();

  if (!name) {
    throw new Error("Plan name is required.");
  }

  const slug = slugify(rawSlug || name);
  if (!slug) {
    throw new Error("Couldn't derive a valid slug from that name — try adding some letters or numbers.");
  }

  if (!VALID_FREQUENCIES.includes(defaultFrequency)) {
    throw new Error("Choose a valid delivery frequency.");
  }

  const sortOrder = Number(sortOrderRaw);
  if (!Number.isFinite(sortOrder)) {
    throw new Error("Sort order must be a number.");
  }

  return {
    name,
    slug,
    description: description || null,
    default_frequency: defaultFrequency,
    is_active: isActive,
    sort_order: Math.trunc(sortOrder),
  };
}

export async function createPlanAction(_prevState: PlanState, formData: FormData): Promise<PlanState> {
  try {
    const { supabase } = await requireAdmin();
    const fields = readPlanFields(formData);

    const { data: existing } = await supabase
      .from("subscription_plans")
      .select("id")
      .eq("slug", fields.slug)
      .maybeSingle();
    if (existing) {
      return { error: `The slug "${fields.slug}" is already used by another plan.` };
    }

    const { error } = await supabase.from("subscription_plans").insert(fields);
    if (error) {
      return { error: "Couldn't create this plan. Please try again." };
    }

    revalidatePath("/admin/subscriptions/plans");
    return { success: true };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Something went wrong." };
  }
}

export async function updatePlanAction(_prevState: PlanState, formData: FormData): Promise<PlanState> {
  try {
    const { supabase } = await requireAdmin();
    const id = String(formData.get("id") ?? "");
    if (!id) return { error: "Missing plan." };

    const fields = readPlanFields(formData);

    const { data: existing } = await supabase
      .from("subscription_plans")
      .select("id")
      .eq("slug", fields.slug)
      .neq("id", id)
      .maybeSingle();
    if (existing) {
      return { error: `The slug "${fields.slug}" is already used by another plan.` };
    }

    const { error } = await supabase.from("subscription_plans").update(fields).eq("id", id);
    if (error) {
      return { error: "Couldn't save your changes. Please try again." };
    }

    revalidatePath("/admin/subscriptions/plans");
    return { success: true };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Something went wrong." };
  }
}

export type DeletePlanState = { error?: string } | undefined;

export async function deletePlanAction(_prevState: DeletePlanState, formData: FormData): Promise<DeletePlanState> {
  try {
    const { supabase } = await requireAdmin();
    const id = String(formData.get("id") ?? "");
    if (!id) return { error: "Missing plan." };

    // subscriptions.plan_id is NOT NULL with ON DELETE RESTRICT, so the
    // database itself refuses to delete a plan that customers already
    // subscribed to — this check turns that into a clear message instead of
    // a raw foreign-key-violation error reaching the UI. Deactivating (the
    // toggle below) is the correct way to retire a plan that's in use.
    const { count } = await supabase
      .from("subscriptions")
      .select("*", { count: "exact", head: true })
      .eq("plan_id", id);

    if (count && count > 0) {
      return {
        error: `Can't delete this plan — ${count} subscription${count === 1 ? "" : "s"} still use it. Deactivate it instead.`,
      };
    }

    const { error } = await supabase.from("subscription_plans").delete().eq("id", id);
    if (error) {
      return { error: "Couldn't delete this plan. Please try again." };
    }

    revalidatePath("/admin/subscriptions/plans");
    return undefined;
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Something went wrong." };
  }
}

export async function togglePlanActiveAction(formData: FormData): Promise<void> {
  const { supabase } = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const nextActive = formData.get("nextActive") === "true";
  if (!id) return;

  await supabase.from("subscription_plans").update({ is_active: nextActive }).eq("id", id);
  revalidatePath("/admin/subscriptions/plans");
}
