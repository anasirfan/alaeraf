import type { LucideIcon } from "lucide-react";

export function StatCard({
  label,
  value,
  icon: Icon,
  tone = "default",
}: {
  label: string;
  value: number | string;
  icon: LucideIcon;
  tone?: "default" | "warning";
}) {
  return (
    <div className="rounded-sm border border-line bg-white p-5">
      <div className="flex items-start justify-between">
        <p className="text-[0.7rem] font-semibold tracking-[0.08em] text-muted uppercase">{label}</p>
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-full ${
            tone === "warning" ? "bg-gold/10 text-gold" : "bg-sage/10 text-botanical"
          }`}
        >
          <Icon className="h-4 w-4" strokeWidth={1.75} />
        </div>
      </div>
      <p className="mt-4 font-display text-3xl text-forest">{value}</p>
    </div>
  );
}
