/**
 * All page copy lives here so it can be swapped for a CMS later without
 * touching layout or styling.
 *
 * Copy policy: no medical claims, no invented certifications, awards,
 * lab results or trading history. Testimonials are explicitly sample content.
 */

export const hero = {
  eyebrow: "Al Aeraf · Karachi",
  headline: ["Nature's care,", "purely delivered."],
  lede:
    "Herbal hair oil and pure RO drinking water — two everyday essentials, made with the same regard for what goes into them.",
  index: [
    {
      no: "01",
      kicker: "Botanical",
      title: "Herbal Hair Oil",
      note: "Nature-inspired oils for an unhurried hair-care routine.",
      href: "#hair-oil",
      cta: "Explore Hair Care",
    },
    {
      no: "02",
      kicker: "Purified",
      title: "RO Drinking Water",
      note: "Fresh reverse-osmosis water, delivered to your door.",
      href: "#ro-water",
      cta: "Explore RO Water",
    },
  ],
} as const;

export const brandStory = {
  eyebrow: "About Al Aeraf",
  headline: "Rooted in nature.\nMade for everyday life.",
  body: [
    "Al Aeraf began with a simple idea: the things you use every day deserve the same care as the things you save for special occasions.",
    "We make two of them. A herbal hair oil drawn from nature-inspired ingredients, and reverse-osmosis drinking water for the household. Different products, one standard — and one delivery van that knows your street.",
  ],
  pillars: [
    { label: "Natural care", note: "Nature-inspired ingredients" },
    { label: "Purity", note: "Reverse-osmosis filtration" },
    { label: "Everyday wellness", note: "Made for daily routines" },
    { label: "Local delivery", note: "Your neighbourhood, on schedule" },
  ],
} as const;

export const hairOil = {
  no: "01",
  eyebrow: "Herbal Hair Oil",
  headline: "A slower kind of\nhair care.",
  lede:
    "Warm, botanical and unhurried. Al Aeraf hair oil is made for the evening ritual — worked through the scalp, left to settle, rinsed the next morning.",
  points: [
    {
      title: "Nature-inspired ingredients",
      body: "Built around botanical oils rather than synthetic fillers.",
    },
    {
      title: "An everyday routine",
      body: "Light enough for regular use, rich enough to feel nourishing.",
    },
    {
      title: "Considered in small batches",
      body: "Blended and bottled with care, in quantities we can watch closely.",
    },
  ],
  cta: "Explore Hair Oil",
  note: "A cosmetic hair-care product. Not intended to treat or prevent any condition.",
} as const;

export const water = {
  no: "02",
  eyebrow: "RO Drinking Water",
  headline: "Pure water.\nDelivered to your doorstep.",
  lede:
    "Reverse-osmosis drinking water for the kitchen, the office cooler and everything in between — brought to your door within our supported areas.",
  stats: [
    { value: "RO", label: "Reverse-osmosis filtration" },
    { value: "19L", label: "Standard household bottle" },
    { value: "Local", label: "Neighbourhood delivery" },
  ],
  cta: "Order RO Water",
} as const;

export const subscription = {
  eyebrow: "Monthly Delivery",
  headline: "Never run out\nof pure water.",
  lede:
    "Set the number of bottles you go through in a month. We handle the rest — same day each cycle, same doorstep, no phone calls.",
  plans: [
    {
      name: "Essential",
      for: "Couples & small homes",
      detail: "A light monthly rhythm for one or two people.",
      features: ["Fixed monthly delivery day", "Bottle exchange included", "Pause any month"],
      featured: false,
    },
    {
      name: "Family",
      for: "Households of four or more",
      detail: "Our most common household schedule.",
      features: [
        "Fortnightly or weekly drops",
        "Bottle exchange included",
        "Priority delivery slot",
        "Adjust quantity any cycle",
      ],
      featured: true,
    },
    {
      name: "Custom",
      for: "Offices & shared spaces",
      detail: "Built around your actual consumption.",
      features: ["Volume-based schedule", "Dedicated point of contact", "Flexible invoicing"],
      featured: false,
    },
  ],
  cta: "Explore Plans",
  disclaimer: "Plans shown for illustration. Pricing and scheduling coming soon.",
} as const;

export const delivery = {
  eyebrow: "Delivery Areas",
  headline: "We already know\nyour street.",
  lede:
    "Al Aeraf delivers across a cluster of neighbourhoods in Karachi, with more added as we grow.",
  areas: [
    "Nazimabad",
    "Paposh Nagar",
    "North Nazimabad",
    "Orangi Town",
    "Allama Iqbal Town",
    "Nearby areas",
  ],
  cta: "Check Your Area",
  note: "Live coverage checking is coming soon.",
} as const;

export const why = {
  eyebrow: "Why Al Aeraf",
  headline: "Two products.\nOne standard.",
  cards: [
    {
      icon: "leaf",
      title: "Natural Care",
      body: "Nature-inspired personal care, made without shortcuts.",
    },
    {
      icon: "droplet",
      title: "Pure Water",
      body: "Fresh RO drinking water for the whole household.",
    },
    {
      icon: "map",
      title: "Local Delivery",
      body: "Convenient neighbourhood delivery on a schedule you set.",
    },
    {
      icon: "check",
      title: "Simple & Reliable",
      body: "An easy way to order the everyday essentials you already buy.",
    },
  ],
} as const;

/**
 * SAMPLE CONTENT — written to demonstrate layout only.
 * Replace with real, permissioned customer quotes before launch.
 */
export const testimonials = {
  eyebrow: "Sample Reviews",
  headline: "What people\nmight say.",
  disclaimer:
    "Demo content — these are illustrative placeholders, not real customer reviews.",
  items: [
    {
      quote:
        "The oil has become part of my evening routine. It feels like something made by hand rather than a factory.",
      name: "Sample Customer",
      meta: "Hair Oil · Nazimabad",
    },
    {
      quote:
        "Water arrives on the same day every month. I have genuinely stopped thinking about it, which is the point.",
      name: "Sample Customer",
      meta: "Monthly Subscription · North Nazimabad",
    },
    {
      quote:
        "Ordering is simple and the delivery team knows the building. Small things, but they add up.",
      name: "Sample Customer",
      meta: "RO Water · Paposh Nagar",
    },
  ],
} as const;

export const finalCta = {
  headline: "Bring a little more\nnature into your everyday.",
  lede: "Herbal hair care and pure drinking water, from one local brand.",
  primary: { label: "Shop Hair Oil", href: "#hair-oil" },
  secondary: { label: "Order Water", href: "#ro-water" },
} as const;

export const footer = {
  blurb:
    "Al Aeraf makes herbal hair oil and delivers pure RO drinking water across Karachi neighbourhoods. Pure by nature.",
  columns: [
    {
      title: "Explore",
      links: [
        { label: "Home", href: "#home" },
        { label: "Hair Oil", href: "#hair-oil" },
        { label: "RO Water", href: "#ro-water" },
        { label: "Subscription", href: "#subscription" },
        { label: "About", href: "#about" },
      ],
    },
    {
      title: "Customer",
      links: [
        { label: "Contact", href: "#contact" },
        { label: "Delivery Areas", href: "#delivery" },
        { label: "FAQs", href: "#faqs" },
      ],
    },
  ],
  /** Placeholders — replace with real business details before launch. */
  contact: [
    { label: "Phone", value: "Contact number to be added" },
    { label: "Email", value: "Email address to be added" },
    { label: "Service area", value: "Karachi — Nazimabad & nearby" },
  ],
} as const;
