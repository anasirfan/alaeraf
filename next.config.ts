import type { NextConfig } from "next";

// Lets next/image optimize product photos served from the Supabase
// `product-images` Storage bucket (public.al-aeraf.com's catalog images).
// Derived from the same env var the app already uses, rather than
// hardcoding a project-specific hostname here.
const supabaseHostname = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : undefined;

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    // Quality levels used across the site. Add here before using a new one.
    qualities: [62, 75, 78, 82],
    formats: ["image/avif", "image/webp"],
    remotePatterns: supabaseHostname
      ? [
          {
            protocol: "https",
            hostname: supabaseHostname,
            pathname: "/storage/v1/object/public/**",
          },
        ]
      : [],
  },
};

export default nextConfig;
