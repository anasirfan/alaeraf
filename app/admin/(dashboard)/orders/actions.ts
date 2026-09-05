"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/authorize";
import { ORDER_STATUSES, PAYMENT_STATUSES } from "@/lib/orders/adminOrders";
import type { OrderStatus, PaymentStatus } from "@/types/database.types";

export type OrderActionState = { error?: string; success?: boolean } | undefined;

/**
 * Updates an order's status. Authorization is two-layered, same as every
 * other admin mutation in this codebase: requireAdmin() below gives a
 * clean error message, and the underlying update is still independently
 * enforced by the "orders_admin_write" RLS policy (for all, requires
 * is_admin()) — there is no owner-level UPDATE policy on orders at all, so
 * a customer literally cannot reach this path even if they called it
 * directly. Only the six real enum values (public.order_status,
 * 0001_extensions_and_enums.sql) are ever accepted.
 */
export async function updateOrderStatusAction(
  _prevState: OrderActionState,
  formData: FormData,
): Promise<OrderActionState> {
  try {
    const { supabase } = await requireAdmin();
    const id = String(formData.get("id") ?? "");
    const status = String(formData.get("status") ?? "") as OrderStatus;

    if (!id) return { error: "Missing order." };
    if (!ORDER_STATUSES.includes(status)) return { error: "Choose a valid order status." };

    const { error } = await supabase.from("orders").update({ status }).eq("id", id);
    if (error) return { error: "Couldn't update the order status. Please try again." };

    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${id}`);
    return { success: true };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Something went wrong." };
  }
}

/**
 * Updates an order's payment status (COD collection tracking — no gateway
 * involved). Same authorization model as updateOrderStatusAction above.
 */
export async function updatePaymentStatusAction(
  _prevState: OrderActionState,
  formData: FormData,
): Promise<OrderActionState> {
  try {
    const { supabase } = await requireAdmin();
    const id = String(formData.get("id") ?? "");
    const paymentStatus = String(formData.get("paymentStatus") ?? "") as PaymentStatus;

    if (!id) return { error: "Missing order." };
    if (!PAYMENT_STATUSES.includes(paymentStatus)) return { error: "Choose a valid payment status." };

    const { error } = await supabase.from("orders").update({ payment_status: paymentStatus }).eq("id", id);
    if (error) return { error: "Couldn't update the payment status. Please try again." };

    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${id}`);
    return { success: true };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Something went wrong." };
  }
}
