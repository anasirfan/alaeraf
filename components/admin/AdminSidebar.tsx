"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { adminNav } from "@/lib/admin-nav";

export function AdminSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col bg-forest text-cream">
      <div className="flex h-16 items-center gap-2.5 border-b border-cream/10 px-5">
        <span className="relative block h-7 w-[6.5rem]">
          <Image src="/logo-light.png" alt="" fill sizes="104px" className="object-contain object-left" />
        </span>
        <span className="rounded-full border border-sage-soft/30 px-2 py-0.5 text-[0.6rem] font-semibold tracking-[0.1em] text-sage-soft uppercase">
          Admin
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-5" aria-label="Admin">
        <ul className="space-y-1">
          {adminNav.map((item) => {
            const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center gap-3 rounded-sm px-3.5 py-2.5 text-sm font-medium transition-colors duration-200 ${
                    active
                      ? "bg-cream/10 text-cream"
                      : "text-sage-soft/75 hover:bg-cream/5 hover:text-cream"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-cream/10 px-5 py-4">
        <p className="text-[0.65rem] tracking-[0.12em] text-sage-soft/45 uppercase">Al Aeraf Admin</p>
      </div>
    </div>
  );
}
