import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    // Quality levels used across the site. Add here before using a new one.
    qualities: [62, 75, 78, 82],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
