import type { NextConfig } from "next";
import { WebpackConfigContext } from "next/dist/server/config-shared";

const nextConfig: NextConfig = {
  experimental: {
    // Enable Turbopack
    turbo: {},
    // Remove forceSwcTransforms if causing issues
    // forceSwcTransforms: false,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  serverExternalPackages: ['pdf-parse', 'mammoth'],
  // Webpack config still needed for parts that might not use Turbopack
  webpack: (config: any, { isServer }: WebpackConfigContext) => {
    if (isServer) {
      // Mark certain packages as external to avoid bundling issues
      config.externals = [...(config.externals || []), 'canvas', 'jsdom'];
    }
    return config;
  },
};

export default nextConfig;