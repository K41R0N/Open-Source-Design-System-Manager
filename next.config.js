/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // This setting helps with hydration errors by ignoring specific attributes
  // that might be added by browser extensions like Grammarly
  compiler: {
    // Ignore data attributes added by browser extensions
    reactRemoveProperties: { properties: ['^data-gr-', '^data-new-gr-'] },
  },
  // Disable image optimization since we're not using next/image
  // This prevents the sharp dependency from causing build issues
  images: {
    unoptimized: true,
  },
  // Security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          },
          // CSP configured for Supabase and OAuth providers
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https://*.supabase.co https://ui-avatars.com https://avatars.githubusercontent.com https://lh3.googleusercontent.com",
              "font-src 'self' data:",
              "connect-src 'self' https://*.supabase.co https://accounts.google.com https://*.googleapis.com",
              "frame-src 'self'",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'self'",
            ].join('; ')
          }
        ],
      },
    ]
  },
}

module.exports = nextConfig
