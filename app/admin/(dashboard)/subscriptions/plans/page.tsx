import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { listPlansForAdmin } from "@/lib/subscriptions/queries";
import { PlanList } from "./PlanList";
import { AddPlanPanel } from "./AddPlanPanel";

export const metadata: Metadata = {
  title: "Subscription Plans — Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminSubscriptionPlansPage() {
  const supabase = await createClient();
  const plans = await listPlansForAdmin(supabase);

  return (
    <div>
      <Link
        href="/admin/subscriptions"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-forest"
      >
        <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.75} />
        Back to Subscriptions
      </Link>

      <div className="mb-8">
        <h2 className="font-display text-2xl text-forest">Subscription Plans</h2>
        <p className="mt-1.5 text-sm text-muted">
          Plans customers choose from on the subscribe page. A plan can&apos;t be deleted while
          customers are subscribed to it — deactivate it instead.
        </p>
      </div>

      <div className="flex flex-col gap-8">
        <PlanList plans={plans} />
        <AddPlanPanel hasPlans={plans.length > 0} />
      </div>
    </div>
  );
}
