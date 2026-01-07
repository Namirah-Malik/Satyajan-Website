import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: [
      "www.microtek.in",
      "fcms.microtek.in"
    ],
  },
};

export default nextConfig;
