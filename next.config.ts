import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "local-origin.dev",
    "*.local-origin.dev",
    "http://localhost:3000",
    "https://localhost:3000",
  ],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "scontent.fcnx4-1.fna.fbcdn.net",
      },
      {
        protocol: "https",
        hostname: "pub-498ad8603ab0419f9880841abf77260b.r2.dev",
      },
    ],
  },
}

export default nextConfig
