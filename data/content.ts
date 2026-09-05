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
      href: "/hair-oil",
      cta: "Explore Hair Care",
    },
    {
      no: "02",
      kicker: "Purified",
      title: "RO Drinking Water",
      note: "Fresh reverse-osmosis water, delivered to your door.",
      href: "/ro-water",
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
  /** Longer-form detail for the dedicated About page. */
  approach: [
    {
      title: "We keep the range small",
      body: "Al Aeraf isn't trying to be everything. One herbal hair oil, one RO water line — made properly, rather than a wide catalogue made quickly.",
    },
    {
      title: "We deliver what we make",
      body: "The same team that blends the oil and runs the RO plant also handles the neighbourhood delivery schedule, so feedback from your street actually reaches the people making the product.",
    },
    {
      title: "We say only what's true",
      body: "No invented certifications, no borrowed lab results, no medical claims. What's on the label and on this site is what we can stand behind.",
    },
  ],
  promise:
    "Al Aeraf is still a young, local brand — one hair oil, one RO water line, one delivery van. We'd rather grow slowly and keep that standard than expand faster than we can watch closely.",
} as const;

export const hairOil = {
  no: "01",
  eyebrow: "Herbal Hair Oil",
  tagline: "Nourished roots. Stronger you.",
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
  /** Formulation callouts as printed on the product label. */
  badges: ["No Parabens", "No Sulfates", "No Mineral Oil", "Cruelty-Free"],
  cta: "Explore Hair Oil",
  note: "A cosmetic hair-care product. Not intended to treat or prevent any condition.",
  /** As listed on the product label — not an exhaustive INCI list. */
  ingredients: [
    {
      name: "Coconut Oil",
      note: "A light carrier oil that helps the blend work through the scalp.",
    },
    {
      name: "Amla Extract",
      note: "A botanical long used in herbal hair-care traditions.",
    },
    {
      name: "Jasmine Extract",
      note: "Adds the blend's soft, natural fragrance.",
    },
    {
      name: "Almond Oil",
      note: "A nourishing oil that helps the finish feel light rather than heavy.",
    },
  ],
  howToUse: [
    {
      step: "01",
      title: "Warm a small amount",
      body: "Rub a few drops between your palms until the oil feels warm, not hot.",
    },
    {
      step: "02",
      title: "Massage into the scalp",
      body: "Work it through the roots in slow, circular motions, then comb through to the lengths.",
    },
    {
      step: "03",
      title: "Leave it to settle",
      body: "A few hours is enough for a quick routine; overnight suits a deeper weekly treatment.",
    },
    {
      step: "04",
      title: "Rinse as usual",
      body: "Wash out with your regular shampoo — no special routine required.",
    },
  ],
  faq: [
    {
      q: "How often should I use Al Aeraf hair oil?",
      a: "Most people use it two to three times a week, though a light daily scalp massage works too if your hair tends to be dry.",
    },
    {
      q: "Is it suitable for all hair types?",
      a: "Yes — the formulation is intentionally light so it doesn't weigh down finer hair while still feeling nourishing on thicker, drier hair.",
    },
    {
      q: "Does it help with hair fall or growth?",
      a: "We don't make medical or treatment claims. It's a cosmetic hair-care oil intended to nourish the scalp and hair as part of a regular routine.",
    },
    {
      q: "How is it packaged?",
      a: "In amber glass bottles, which help protect the botanical extracts from light.",
    },
  ],
} as const;

export const water = {
  no: "02",
  eyebrow: "RO Drinking Water",
  tagline: "Pure water. Pure life.",
  headline: "Pure water.\nDelivered to your doorstep.",
  lede:
    "Reverse-osmosis drinking water for the kitchen, the office cooler and everything in between — brought to your door within our supported areas.",
  stats: [
    { value: "RO", label: "Reverse-osmosis filtration" },
    { value: "19L", label: "Standard household bottle" },
    { value: "Local", label: "Neighbourhood delivery" },
  ],
  /** Quality callouts as printed on the product label. */
  badges: ["100% Pure & Safe", "pH Balanced", "Refreshing Taste"],
  cta: "Order RO Water",
  process: [
    {
      step: "01",
      title: "Sourced",
      body: "Water is drawn from our supply source before treatment begins.",
    },
    {
      step: "02",
      title: "Reverse-osmosis filtration",
      body: "Passed through an RO membrane system to reduce dissolved impurities.",
    },
    {
      step: "03",
      title: "Quality checked",
      body: "Checked before bottling as part of our regular process.",
    },
    {
      step: "04",
      title: "Bottled & sealed",
      body: "Filled and sealed in the same facility, without intermediate handling.",
    },
    {
      step: "05",
      title: "Delivered to your door",
      body: "Out for delivery on your scheduled day, within our supported areas.",
    },
  ],
  faq: [
    {
      q: "What size bottles do you deliver?",
      a: "The standard household bottle is 19 litres, suited to a dispenser or cooler.",
    },
    {
      q: "Do you exchange empty bottles?",
      a: "Yes — bottle exchange is part of the regular delivery visit for subscription customers.",
    },
    {
      q: "Is the water tested?",
      a: "It goes through quality checks as part of our bottling process. We don't publish third-party lab certificates at this time.",
    },
    {
      q: "Can I order a one-off delivery without a subscription?",
      a: "Yes — reach out through the Contact page and we'll confirm availability for your area.",
    },
  ],
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
  disclaimer: "Your exact monthly price is calculated from the RO Water product's current price when you subscribe. Cash on Delivery — no online payment required.",
  howItWorks: [
    {
      step: "01",
      title: "Pick a plan",
      body: "Essential, Family or Custom — based on how many bottles your household or office goes through.",
    },
    {
      step: "02",
      title: "Set your schedule",
      body: "Weekly, fortnightly or monthly — whatever matches your actual usage.",
    },
    {
      step: "03",
      title: "We deliver and exchange",
      body: "Full bottles arrive, empties are collected, on the same day each cycle.",
    },
    {
      step: "04",
      title: "Adjust anytime",
      body: "Pause, resume or cancel from your account whenever your needs change.",
    },
  ],
  faq: [
    {
      q: "Is there a minimum commitment?",
      a: "No — you can pause or cancel from your account at any time, no minimum term.",
    },
    {
      q: "How do I sign up?",
      a: "Sign up on the Subscribe page — pick your plan, quantity and delivery address, and you're set. Payment is Cash on Delivery, same as a regular order.",
    },
    {
      q: "Can I change my plan later?",
      a: "You can pause, resume, or cancel anytime from My Account → Subscriptions. To change the product, quantity or address, cancel and start a new subscription.",
    },
  ],
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
  note: "Delivery eligibility is confirmed automatically from your saved address at checkout or when subscribing.",
  howDelivery: [
    {
      step: "01",
      title: "Confirm your area",
      body: "Check the list of neighbourhoods we currently serve.",
    },
    {
      step: "02",
      title: "Reach out",
      body: "Contact us with your address and what you'd like delivered.",
    },
    {
      step: "03",
      title: "Get a delivery day",
      body: "We confirm a day that fits our existing route through your neighbourhood.",
    },
    {
      step: "04",
      title: "Ongoing delivery",
      body: "One-off or recurring — set up whichever fits how you use hair oil and water.",
    },
  ],
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
  primary: { label: "Shop Hair Oil", href: "/hair-oil" },
  secondary: { label: "Order Water", href: "/ro-water" },
} as const;

/**
 * Contact page copy. Kept separate from footer.contact so the page can carry
 * a little more context without cluttering the footer's compact rows.
 */
export const contactPage = {
  eyebrow: "Get in Touch",
  headline: "We'd like\nto hear from you.",
  lede:
    "For orders, subscription set-up, delivery-area questions or anything else — reach out and we'll get back to you directly.",
  channels: [
    {
      label: "Call or WhatsApp",
      value: "0347 2249475",
      href: "tel:+923472249475",
      note: "Fastest way to reach us for orders and delivery questions.",
    },
    {
      label: "Website",
      value: "www.al-aeraf.com",
      href: "https://www.al-aeraf.com",
      note: "",
    },
    {
      label: "Service area",
      value: "Karachi — Nazimabad & nearby",
      href: null,
      note: "See the full list on the Delivery Areas page.",
    },
  ],
} as const;

/**
 * Aggregated FAQ page — pulls the same underlying questions from each
 * product/section so there is one place to search, grouped by topic.
 */
export const faqPage = {
  eyebrow: "FAQs",
  headline: "Common\nquestions.",
  lede: "Answers about the hair oil, the water, subscriptions and delivery, all in one place.",
} as const;

export const footer = {
  blurb:
    "Al Aeraf makes herbal hair oil and delivers pure RO drinking water across Karachi neighbourhoods. Pure by nature.",
  columns: [
    {
      title: "Explore",
      links: [
        { label: "Home", href: "/" },
        { label: "Hair Oil", href: "/hair-oil" },
        { label: "RO Water", href: "/ro-water" },
        { label: "Subscription", href: "/subscription" },
        { label: "About", href: "/about" },
      ],
    },
    {
      title: "Customer",
      links: [
        { label: "Contact", href: "/contact" },
        { label: "Delivery Areas", href: "/delivery-areas" },
        { label: "FAQs", href: "/faqs" },
      ],
    },
  ],
  contact: [
    { label: "Phone", value: "0347 2249475", href: "tel:+923472249475" },
    { label: "Website", value: "www.al-aeraf.com", href: "https://www.al-aeraf.com" },
    /** Placeholder — replace with a real inbox before launch. */
    { label: "Email", value: "Email address to be added" },
    { label: "Service area", value: "Karachi — Nazimabad & nearby" },
  ],
} as const;
