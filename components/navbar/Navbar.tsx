"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, ShoppingBag, User, LogOut, X } from "lucide-react";
import { nav, routes, site } from "@/lib/site";
import { Container } from "@/components/ui/Container";
import { createClient } from "@/lib/supabase/client";
import { logoutAction } from "@/app/account/actions";
import { useCart } from "@/lib/cart/CartContext";

export function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Resolved client-side, deliberately: the navbar sits in the root layout
  // above every page, including the site's static marketing pages. Checking
  // auth server-side here (cookies()/getUser() in a layout) would force the
  // whole route tree into per-request dynamic rendering just to decide
  // "Login" vs "Account" in one corner — real auth boundaries (/account,
  // /account/addresses) stay server-side in proxy.ts and account/layout.tsx,
  // which is what actually needs to be secure, not this display detail.
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const { itemCount } = useCart();

  useEffect(() => {
    const supabase = createClient();
    let active = true;

    supabase.auth.getUser().then(({ data }) => {
      if (active) setIsLoggedIn(!!data.user);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (active) setIsLoggedIn(!!session?.user);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Only the Home page opens on a full-bleed dark hero, so only there does the
  // navbar start transparent-on-dark; every interior page gets the opaque,
  // dark-text bar from the first frame regardless of scroll position.
  const onDark = isHome && !scrolled;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,border-color] duration-500 ${
        scrolled || !isHome
          ? "border-b border-line/70 bg-ivory/92 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <Container>
        <div className="flex h-[4.5rem] items-center justify-between gap-4 lg:h-20">
          {/* Logo */}
          <Link
            href="/"
            className="relative block shrink-0"
            aria-label={`${site.name} — home`}
          >
            <span className="relative block h-9 w-[8.5rem] sm:h-10 sm:w-[10rem]">
              <Image
                src="/logo.png"
                alt={`${site.name} — ${site.tagline}`}
                fill
                priority
                sizes="160px"
                className={`object-contain object-left transition-opacity duration-500 ${
                  onDark ? "opacity-0" : "opacity-100"
                }`}
              />
              <Image
                src="/logo-light.png"
                alt=""
                aria-hidden="true"
                fill
                priority
                sizes="160px"
                className={`object-contain object-left transition-opacity duration-500 ${
                  onDark ? "opacity-100" : "opacity-0"
                }`}
              />
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:block" aria-label="Primary">
            <ul className="flex items-center gap-9">
              {nav.map((item) => {
                const active = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`group relative text-[0.8125rem] font-medium tracking-[0.04em] transition-colors duration-300 ${
                        onDark
                          ? active
                            ? "text-cream"
                            : "text-cream/80 hover:text-cream"
                          : active
                            ? "text-forest"
                            : "text-muted hover:text-forest"
                      }`}
                    >
                      {item.label}
                      <span
                        className={`absolute -bottom-1.5 left-0 h-px transition-[width] duration-300 group-hover:w-full ${
                          active ? "w-full" : "w-0"
                        } ${onDark ? "bg-cream/70" : "bg-forest/50"}`}
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Auth — same slot/typography as the desktop nav links either way */}
            <div
              className={`hidden items-center gap-4 pr-1 lg:flex ${
                onDark ? "text-cream/85" : "text-muted"
              }`}
            >
              {isLoggedIn ? (
                <>
                  <Link
                    href={routes.account}
                    className={`text-[0.8125rem] font-medium tracking-[0.04em] transition-colors duration-300 ${
                      onDark ? "hover:text-cream" : "hover:text-forest"
                    }`}
                  >
                    Account
                  </Link>
                  <form action={logoutAction}>
                    <button
                      type="submit"
                      className={`inline-flex items-center gap-1.5 text-[0.8125rem] font-medium tracking-[0.04em] transition-colors duration-300 ${
                        onDark ? "hover:text-cream" : "hover:text-forest"
                      }`}
                    >
                      <LogOut className="h-3.5 w-3.5" strokeWidth={1.75} />
                      Logout
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <Link
                    href={routes.login}
                    className={`text-[0.8125rem] font-medium tracking-[0.04em] transition-colors duration-300 ${
                      onDark ? "hover:text-cream" : "hover:text-forest"
                    }`}
                  >
                    Login
                  </Link>
                  <Link
                    href={routes.signup}
                    className={`text-[0.8125rem] font-medium tracking-[0.04em] transition-colors duration-300 ${
                      onDark ? "hover:text-cream" : "hover:text-forest"
                    }`}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>

            <Link
              href={routes.cart}
              aria-label={itemCount > 0 ? `Cart, ${itemCount} item${itemCount === 1 ? "" : "s"}` : "Cart"}
              className={`relative hidden h-10 w-10 items-center justify-center rounded-full border transition-colors duration-300 sm:flex ${
                onDark
                  ? "border-cream/25 text-cream hover:bg-cream/10"
                  : "border-line text-forest hover:bg-cream"
              }`}
            >
              <ShoppingBag className="h-[1.05rem] w-[1.05rem]" strokeWidth={1.5} />
              {itemCount > 0 && (
                <span
                  className={`absolute -right-1 -top-1 flex h-[1.15rem] min-w-[1.15rem] items-center justify-center rounded-full px-1 text-[0.6rem] font-semibold tabular-nums ${
                    onDark ? "bg-sage-soft text-forest" : "bg-forest text-cream"
                  }`}
                  aria-hidden="true"
                >
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </Link>

            <Link
              href={routes.orderNow}
              className={`hidden rounded-full px-5 py-2.5 text-[0.8125rem] font-semibold tracking-[0.02em] transition-colors duration-300 sm:inline-flex ${
                onDark
                  ? "bg-cream text-forest hover:bg-white"
                  : "bg-forest text-cream hover:bg-ink"
              }`}
            >
              Order Now
            </Link>

            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              aria-expanded={open}
              className={`flex h-10 w-10 items-center justify-center rounded-full border transition-colors duration-300 lg:hidden ${
                onDark
                  ? "border-cream/25 text-cream hover:bg-cream/10"
                  : "border-line text-forest hover:bg-cream"
              }`}
            >
              <Menu className="h-[1.15rem] w-[1.15rem]" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </Container>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 z-50 lg:hidden ${open ? "" : "pointer-events-none"}`}
        aria-hidden={!open}
      >
        <div
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-ink/45 backdrop-blur-[2px] transition-opacity duration-400 ${
            open ? "opacity-100" : "opacity-0"
          }`}
        />

        <div
          className={`absolute inset-y-0 right-0 flex w-full max-w-sm flex-col bg-forest text-cream transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex h-[4.5rem] items-center justify-between px-6">
            <span className="relative block h-8 w-[7.5rem]">
              <Image src="/logo-light.png" alt="" fill sizes="128px" className="object-contain object-left" />
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-cream/25 text-cream transition-colors hover:bg-cream/10"
            >
              <X className="h-[1.15rem] w-[1.15rem]" strokeWidth={1.5} />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-6 pt-6" aria-label="Mobile">
            <ul className="space-y-1">
              {nav.map((item, i) => (
                <li key={item.href} className="border-b border-cream/12">
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex items-baseline gap-4 py-4 font-display text-[1.65rem] leading-none transition-opacity duration-300 hover:opacity-70"
                    style={{
                      transitionDelay: open ? `${80 + i * 45}ms` : "0ms",
                      opacity: open ? 1 : 0,
                      transform: open ? "none" : "translateY(10px)",
                      transitionProperty: "opacity, transform",
                    }}
                  >
                    <span className="eyebrow text-sage-soft/60">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="space-y-3 px-6 pb-10 pt-6">
            <Link
              href={routes.orderNow}
              onClick={() => setOpen(false)}
              className="flex w-full items-center justify-center rounded-full bg-cream px-6 py-3.5 text-sm font-semibold text-forest"
            >
              Order Now
            </Link>
            <Link
              href={routes.cart}
              onClick={() => setOpen(false)}
              className="relative flex w-full items-center justify-center gap-2 rounded-full border border-cream/30 px-6 py-3.5 text-sm font-semibold text-cream"
            >
              <ShoppingBag className="h-4 w-4" strokeWidth={1.5} />
              Cart
              {itemCount > 0 && (
                <span className="ml-1 flex h-[1.15rem] min-w-[1.15rem] items-center justify-center rounded-full bg-sage-soft px-1 text-[0.65rem] font-semibold tabular-nums text-forest">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </Link>

            {isLoggedIn ? (
              <>
                <Link
                  href={routes.account}
                  onClick={() => setOpen(false)}
                  className="flex w-full items-center justify-center gap-2 rounded-full border border-cream/30 px-6 py-3.5 text-sm font-semibold text-cream"
                >
                  <User className="h-4 w-4" strokeWidth={1.5} />
                  Account
                </Link>
                <form action={logoutAction}>
                  <button
                    type="submit"
                    onClick={() => setOpen(false)}
                    className="flex w-full items-center justify-center gap-2 rounded-full border border-cream/30 px-6 py-3.5 text-sm font-semibold text-cream"
                  >
                    <LogOut className="h-4 w-4" strokeWidth={1.5} />
                    Logout
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link
                  href={routes.login}
                  onClick={() => setOpen(false)}
                  className="flex w-full items-center justify-center gap-2 rounded-full border border-cream/30 px-6 py-3.5 text-sm font-semibold text-cream"
                >
                  <User className="h-4 w-4" strokeWidth={1.5} />
                  Login
                </Link>
                <Link
                  href={routes.signup}
                  onClick={() => setOpen(false)}
                  className="flex w-full items-center justify-center rounded-full border border-cream/30 px-6 py-3.5 text-sm font-semibold text-cream"
                >
                  Sign Up
                </Link>
              </>
            )}

            <p className="pt-2 text-center text-[0.7rem] tracking-[0.14em] text-sage-soft/50 uppercase">
              {site.tagline}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
