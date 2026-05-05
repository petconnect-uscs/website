import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "pet-connect.alwaysdata.net",
      },
    ],
  },
};

export default nextConfig;
