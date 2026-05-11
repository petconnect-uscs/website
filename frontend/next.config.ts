import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "pet-connect.alwaysdata.net",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3002",
        pathname: "/public/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "3002",
        pathname: "/public/**",
      },
    ],
  },
};

export default nextConfig;
