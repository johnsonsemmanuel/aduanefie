// Explicit media hosts only. A wildcard remotePattern let any backend/CMS field
// make the Next image optimizer fetch arbitrary external or internal URLs
// (SSRF / visitor tracking). These are the known production and staging hosts;
// add new ones here deliberately, and keep them https-only.
const MEDIA_HOSTS = [
  "api.aduanefie.com",
  "aduanefie.com",
  "www.aduanefie.com",
  "web.aduanefie.com",
  "h.aduanefie.com",
  "aduanefie.ragnar66.com",
  "images.unsplash.com",
];

const SP = "'self'";
// Next Fast Refresh uses eval in development; production remains restricted.
const DEV_SCRIPT_SOURCE = process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : "";

// Baseline response headers. The inline-script origins below are the ones the
// app actually renders (analytics bootstrap, Google/Apple identity, theme).
// `object-src`, `base-uri` and `frame-ancestors` block the highest-impact
// injection and clickjacking paths without breaking the current inline UI
// scripts; a nonce-based script-src can replace 'unsafe-inline' once every
// inline script carries a per-request nonce.
const CONTENT_SECURITY_POLICY = [
  `default-src ${SP}`,
  `script-src ${SP}${DEV_SCRIPT_SOURCE} 'unsafe-inline' https://accounts.google.com https://appleid.cdn-apple.com https://www.googletagmanager.com https://www.google-analytics.com https://connect.facebook.net https://analytics.tiktok.com https://tr.snapchat.com https://static.ads-twitter.com https://s.pinimg.com https://www.gstatic.com https://maps.googleapis.com`,
  `style-src ${SP} 'unsafe-inline' https://fonts.googleapis.com`,
  `font-src ${SP} data: https://fonts.gstatic.com`,
  `img-src ${SP} data: blob: https:`,
  `media-src ${SP} blob: https:`,
  `connect-src ${SP} https: wss:`,
  `frame-src https:`,
  `worker-src ${SP} blob:`,
  "object-src 'none'",
  `base-uri ${SP}`,
  "frame-ancestors 'none'",
  `form-action ${SP}`,
].join("; ");

const nextConfig = {
  reactStrictMode: true,
  // The workspace has a root lockfile above this app. Pin the tracing root so
  // Next resolves all build paths from this app only.
  outputFileTracingRoot: __dirname,
  experimental: {
    swcPlugins: [],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'], // Keep error and warn, remove log, info, debug, etc.
    } : false,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: MEDIA_HOSTS.map((hostname) => ({
      protocol: 'https',
      hostname,
      pathname: '/**',
    })),
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Content-Security-Policy', value: CONTENT_SECURITY_POLICY },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(self), payment=(), usb=(), magnetometer=(), gyroscope=()',
          },
        ],
      },
    ];
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
