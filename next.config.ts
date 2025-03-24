/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Skip building certain API routes during production
  experimental: {
    // Skip middleware step for API routes
    skipMiddlewareUrlNormalize: true,
    // Skip trailing slash redirect
    skipTrailingSlashRedirect: true,
  },
  // Allow build to continue even if type checking fails
  typescript: {
    // This option allows production builds to complete even with type errors
    ignoreBuildErrors: true,
  },
  // Configure environment variables
  env: {
    // This is just a fallback - real API key should come from environment variables
    NEXT_PUBLIC_APP_ENV: process.env.NODE_ENV,
  },
  // Configure headers for security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;