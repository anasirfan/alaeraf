import type { Metadata } from "next";
import { DM_Serif_Display, Manrope } from "next/font/google";
import "../globals.css";

/**
 * The admin dashboard's own root layout — a sibling to app/(site)/layout.tsx,
 * not nested inside it. Next.js allows more than one root (<html>/<body>)
 * layout as long as each lives under its own top-level route group/segment
 * with no shared app/layout.tsx above them; this is that split.
 *
 * Why this exists: before this file, /admin/* had no root layout of its
 * own, so it inherited app/layout.tsx — the public marketing site's chrome
 * (Navbar, Footer, Splash, CartProvider). AdminShell (its own fixed sidebar
 * + header) was then rendering *inside* that public shell, stacking two
 * independent full-page layouts on top of each other: the public Navbar
 * sat above AdminShell's content (clipping headings that started right at
 * the top), and the public Footer became extra scrollable content below
 * AdminShell's own bottom, drifting behind the fixed sidebar/header as the
 * page scrolled. None of that belongs on an admin screen a customer never
 * sees, so this layout is deliberately minimal: same fonts/global styles
 * (AdminShell/StatCard/etc. use the same `font-display` Tailwind class and
 * design tokens as the public site), no Navbar, no Footer, no Splash, no
 * cart. Applies to every /admin/* route, including /admin/login (outside
 * the (dashboard) route group) and everything inside
 * app/admin/(dashboard)/layout.tsx (the actual auth gate + AdminShell).
 */

const dmSerifDisplay = DM_Serif_Display({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-dm-serif",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Admin",
    template: "%s — Al Aeraf Admin",
  },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSerifDisplay.variable} ${manrope.variable} h-full antialiased`}>
      <body className="min-h-full bg-ivory font-sans text-ink-text">{children}</body>
    </html>
  );
}
