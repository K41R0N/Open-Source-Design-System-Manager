/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // This setting helps with hydration errors by ignoring specific attributes
  // that might be added by browser extensions like Grammarly
  compiler: {
    // Ignore data attributes added by browser extensions
    reactRemoveProperties: { properties: ['^data-gr-', '^data-new-gr-'] },
  },
}

module.exports = nextConfig
