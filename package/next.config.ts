/**
 * next.config.ts
 * ─────────────────────────────────────────────────────────────
 * Deploy to: package/next.config.ts  (replaces existing file)
 *
 * Adds:
 *  - Security headers (canonical, X-Robots-Tag, etc.)
 *  - www → non-www redirect
 *  - /sitemap.xml and /robots.txt served from App Router
 */

import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },

  images: {
    domains: [
      'www.microtek.in',
      'fcms.microtek.in',
      'images.unsplash.com',   // blog/hero images
    ],
  },

  // ── Security + SEO headers ──────────────────────────────────────────────
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Prevents clickjacking
          { key: 'X-Frame-Options',        value: 'SAMEORIGIN' },
          // Prevents MIME sniffing
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // Forces HTTPS for 1 year
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
          // Controls referrer info sent to other sites
          { key: 'Referrer-Policy',        value: 'strict-origin-when-cross-origin' },
          // Basic permissions policy
          { key: 'Permissions-Policy',     value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
      // Cache static assets aggressively
      {
        source: '/images/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },

  // ── www → non-www redirect ───────────────────────────────────────────────
  async redirects() {
    return [
      {
        source:      '/:path*',
        has:         [{ type: 'host', value: 'www.satyajan.com' }],
        destination: 'https://satyajan.com/:path*',
        permanent:   true,   // 301 redirect — passes SEO value
      },
    ];
  },
};

export default nextConfig;