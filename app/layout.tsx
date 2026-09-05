import type { Metadata } from "next";
import { DM_Serif_Display, Manrope } from "next/font/google";
import { Splash } from "@/components/splash/Splash";
import { Navbar } from "@/components/navbar/Navbar";
import { Footer } from "@/components/footer/Footer";
import { CartProvider } from "@/lib/cart/CartContext";
import { site } from "@/lib/site";
import { SPLASH_SESSION_KEY } from "@/lib/splash";
import "./globals.css";

/**
 * Runs while the document is still parsing, before anything is painted.
 * If the splash has already played this session it marks the document so
 * the panel is hidden by CSS immediately — no flash on refresh.
 */
const splashPrePaint = `try{if(sessionStorage.getItem(${JSON.stringify(
  SPLASH_SESSION_KEY,
)})==="1"){document.documentElement.dataset.splash="done"}}catch(e){}`;

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
  metadataBase: new URL(site.url),
  title: {
    default: site.title,
    template: `%s — ${site.name}`,
  },
  description:
    "Premium herbal hair oil and pure RO drinking water, thoughtfully delivered to your doorstep. Pure by nature.",
  keywords: [
    "Al Aeraf",
    "herbal hair oil",
    "RO water",
    "water delivery",
    "Karachi",
    "Nazimabad",
  ],
  openGraph: {
    title: "Al Aeraf — Herbal Hair Care & Pure RO Water",
    description:
      "Premium herbal hair oil and pure RO drinking water, thoughtfully delivered to your doorstep.",
    type: "website",
    locale: "en_PK",
    siteName: "Al Aeraf",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 400,
        alt: "Al Aeraf — Pure by Nature",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Al Aeraf — Herbal Hair Care & Pure RO Water",
    description:
      "Premium herbal hair oil and pure RO drinking water, thoughtfully delivered to your doorstep.",
    images: ["/logo.png"],
  },
  icons: {
    apple: "/mark.png",
  },
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Deliberately NOT checking auth here: this layout wraps every page,
  // including the nine static marketing pages, and reading cookies()/
  // calling Supabase from a layout forces the whole route tree into
  // per-request dynamic rendering — it would silently turn the entire
  // static site dynamic just to know whether to show "Login" or "Account"
  // in the corner of the navbar. Navbar resolves its own auth state
  // client-side instead (see its file for the reasoning); every actual
  // security boundary (protecting /account, /account/addresses) still
  // happens server-side in proxy.ts and app/account/layout.tsx.
  return (
    <html
      lang="en"
      className={`${dmSerifDisplay.variable} ${manrope.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-ivory font-sans text-ink-text">
        <script dangerouslySetInnerHTML={{ __html: splashPrePaint }} />
        <CartProvider>
          <Splash />
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
