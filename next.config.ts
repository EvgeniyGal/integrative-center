import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
