import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Package,
  Tags,
  ClipboardList,
  Users,
  Droplets,
  RefreshCw,
  Settings,
} from "lucide-react";

export type AdminNavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

/**
 * Every section the admin sidebar links to. Dashboard is live; the rest are
 * intentionally stub "coming soon" pages for now (see app/admin/(dashboard)/
 * — the CRUD screens themselves are a later phase, but the nav shell is
 * built to hold them without further restructuring.
 */
export const adminNav: AdminNavItem[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Categories", href: "/admin/categories", icon: Tags },
  { label: "Orders", href: "/admin/orders", icon: ClipboardList },
  { label: "Customers", href: "/admin/customers", icon: Users },
  { label: "RO Plants", href: "/admin/ro-plants", icon: Droplets },
  { label: "Subscriptions", href: "/admin/subscriptions", icon: RefreshCw },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];
