import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Enable React strict mode for better development experience
  reactStrictMode: true,

  // Configure for standalone output (better for deployment)
  output: 'standalone',
}

export default nextConfig
