/**
 * Central site configuration.
 *
 * Every link that will later point at a real route, cart action or API call is
 * declared here, so backend integration (cart, checkout, subscriptions,
 * geolocation) only touches this file plus the handler it maps to.
 */

export const site = {
  name: "Al Aeraf",
  tagline: "Pure by Nature",
  title: "Al Aeraf — Herbal Hair Care & Pure RO Water",
  description:
    "Herbal hair oil and pure RO drinking water from Al Aeraf — nature-inspired everyday care, delivered simply across Karachi neighbourhoods.",
  url: "https://www.al-aeraf.com",
  locale: "en_PK",
} as const;

export const nav = [
  { label: "Home", href: "/" },
  { label: "Hair Oil", href: "/hair-oil" },
  { label: "RO Water", href: "/ro-water" },
  { label: "Subscription", href: "/subscription" },
  { label: "About", href: "/about" },
] as const;

/**
 * Real routes. `orderNow` and `cart` stay pointed at Contact until checkout
 * is wired up — there is no cart yet, so "ordering" today means reaching us.
 */
export const routes = {
  orderNow: "/contact",
  hairOil: "/hair-oil",
  water: "/ro-water",
  subscription: "/subscription",
  deliveryAreas: "/delivery-areas",
  contact: "/contact",
  faqs: "/faqs",
  cart: "/contact",
} as const;
