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
  url: "https://alaeraf.com",
  locale: "en_PK",
} as const;

export const nav = [
  { label: "Home", href: "#home" },
  { label: "Hair Oil", href: "#hair-oil" },
  { label: "RO Water", href: "#ro-water" },
  { label: "Subscription", href: "#subscription" },
  { label: "About", href: "#about" },
] as const;

/**
 * Placeholder destinations. Swap these for real routes when commerce is wired.
 * e.g. orderNow: "/checkout", hairOil: "/products/herbal-hair-oil"
 */
export const routes = {
  orderNow: "#order",
  hairOil: "#hair-oil",
  water: "#ro-water",
  subscription: "#subscription",
  deliveryAreas: "#delivery",
  contact: "#contact",
  faqs: "#faqs",
  cart: "#cart",
} as const;
