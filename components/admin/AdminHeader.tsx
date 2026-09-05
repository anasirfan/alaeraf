"use client";

import { usePathname } from "next/navigation";
import { Menu, LogOut } from "lucide-react";
import { adminNav } from "@/lib/admin-nav";
import { adminLogoutAction } from "@/app/admin/(dashboard)/actions";

export function AdminHeader({
  adminName,
  adminEmail,
  onOpenSidebar,
}: {
  adminName: string;
  adminEmail: string;
  onOpenSidebar: () => void;
}) {
  const pathname = usePathname();
  const current = adminNav.find((item) =>
    item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href),
  );

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-line bg-ivory px-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenSidebar}
          aria-label="Open admin menu"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-forest transition-colors hover:bg-cream lg:hidden"
        >
          <Menu className="h-4 w-4" strokeWidth={1.75} />
        </button>

        <div>
          <p className="text-[0.65rem] tracking-[0.12em] text-muted uppercase">Admin</p>
          <h1 className="font-display text-lg text-forest">{current?.label ?? "Dashboard"}</h1>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-medium text-ink-text">{adminName || "Admin"}</p>
          <p className="text-xs text-muted">{adminEmail}</p>
        </div>
        <form action={adminLogoutAction}>
          <button
            type="submit"
            className="flex items-center gap-1.5 rounded-full border border-line px-3.5 py-2 text-xs font-semibold text-forest transition-colors hover:bg-cream"
          >
            <LogOut className="h-3.5 w-3.5" strokeWidth={1.75} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </form>
      </div>
    </header>
  );
}
