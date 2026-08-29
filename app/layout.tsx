import type { Metadata } from "next";
import { DM_Serif_Display, Manrope } from "next/font/google";
import "./globals.css";

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
  metadataBase: new URL("https://alaeraf.com"),
  title: "Al Aeraf — Herbal Hair Care & Pure RO Water",
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
  return (
    <html
      lang="en"
      className={`${dmSerifDisplay.variable} ${manrope.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-ivory font-sans text-ink-text">
        {children}
      </body>
    </html>
  );
}
