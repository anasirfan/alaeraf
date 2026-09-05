"use client";

import { useState, type ReactNode } from "react";
import { X } from "lucide-react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";

export function AdminShell({
  adminName,
  adminEmail,
  children,
}: {
  adminName: string;
  adminEmail: string;
  children: ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-ivory">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 lg:block">
        <div className="fixed h-screen w-64">
          <AdminSidebar />
        </div>
      </aside>

      {/* Mobile sidebar drawer */}
      <div className={`fixed inset-0 z-50 lg:hidden ${mobileOpen ? "" : "pointer-events-none"}`} aria-hidden={!mobileOpen}>
        <div
          onClick={() => setMobileOpen(false)}
          className={`absolute inset-0 bg-ink/50 backdrop-blur-[2px] transition-opacity duration-300 ${
            mobileOpen ? "opacity-100" : "opacity-0"
          }`}
        />
        <div
          className={`absolute inset-y-0 left-0 w-72 max-w-[80vw] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="relative h-full">
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="Close admin menu"
              className="absolute top-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-cream/25 text-cream transition-colors hover:bg-cream/10"
            >
              <X className="h-4 w-4" strokeWidth={1.75} />
            </button>
            <AdminSidebar onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      </div>

      {/* Main column */}
      <div className="flex min-h-screen flex-1 flex-col lg:pl-64">
        <div className="fixed inset-x-0 top-0 z-30 lg:left-64">
          <AdminHeader adminName={adminName} adminEmail={adminEmail} onOpenSidebar={() => setMobileOpen(true)} />
        </div>
        <main className="flex-1 px-4 pt-16 pb-16 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
