import type { NextConfig } from "next";

const isCapacitor = process.env.CAPACITOR_BUILD === 'true';

const nextConfig: NextConfig = {
  ...(isCapacitor ? { output: 'export' } : {}),
  images: {
    unoptimized: true,
  },
  allowedDevOrigins: [
    "10.148.20.243:3000",
    "10.148.20.243",
    "192.168.56.1:3000",
    "192.168.56.1",
    "localhost:3000",
    "0.0.0.0:3000",
  ],
};

export default nextConfig;
