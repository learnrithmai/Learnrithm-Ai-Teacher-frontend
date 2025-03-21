import type { NextConfig } from "next";
import { WebpackConfigContext } from "next/dist/server/config-shared";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Use the correct property name according to the error message
  serverExternalPackages: ['pdf-parse', 'mammoth'],
  webpack: (config: any, { isServer }: WebpackConfigContext) => {
    if (isServer) {
      // Mark certain packages as external to avoid bundling issues
      config.externals = [...(config.externals || []), 'canvas', 'jsdom'];
    }
    return config;
  },
};

export default nextConfig;