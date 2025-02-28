/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: true,
  },
  images: {
    domains: [
      'localhost', 
      'printboothpro.com', 
      'printbooth-pro.vercel.app', 
      'printbooth-pro-git-camera-test.vercel.app',
      'printbooth-pro-git-camera-test-francoise-tonetos-projects.vercel.app',
      'printbooth-62zcllyci-francoise-tonetos-projects.vercel.app',
      'vercel.app'
    ],
    unoptimized: true
  },
  env: {
    // First try NEXT_PUBLIC_BASE_URL (your custom domain)
    // Then try VERCEL_URL with https
    // Finally fallback to localhost for development
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_BASE_URL || 
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')
  },
  // Add headers to ensure HTTPS and prevent caching
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains'
          },
          {
            key: 'Cache-Control',
            value: 'no-store, max-age=0'
          }
        ],
      },
      {
        source: '/camera/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, max-age=0'
          }
        ],
      },
      {
        source: '/event/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, max-age=0'
          }
        ],
      }
    ]
  },
  webpack: (config) => {
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
    }
    return config
  },
  // Update rewrites to handle all routes properly
  async rewrites() {
    return [
      {
        source: '/event/:path*',
        destination: '/event/:path*',
      },
      {
        source: '/camera/:id',
        destination: '/camera/:id',
      },
      {
        source: '/test-camera',
        destination: '/test-camera',
      },
      {
        source: '/subscription',
        destination: '/subscription',
      }
    ]
  },
  // Add redirects for old routes
  async redirects() {
    return [
      {
        source: '/camera',
        has: [
          {
            type: 'query',
            key: 'event',
            value: '(?<eventId>.*)',
          },
        ],
        destination: '/camera/:eventId',
        permanent: true,
      }
    ]
  },
}

module.exports = nextConfig
