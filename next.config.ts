import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.public.blob.vercel-storage.com",
      },
      {
        protocol: "https",
        hostname: "**.blob.vercel-storage.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/health-and-wellness",
        destination: "/services",
        permanent: true,
      },
      {
        source: "/health-and-wellness/:path*",
        destination: "/services/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
