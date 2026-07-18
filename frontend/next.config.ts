import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/Tech-Cost-Radar',
  assetPrefix: '/Tech-Cost-Radar',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
