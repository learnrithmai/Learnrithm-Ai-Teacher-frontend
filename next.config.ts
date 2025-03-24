import type { NextConfig } from "next";
import { WebpackConfigContext } from "next/dist/server/config-shared";

const nextConfig: NextConfig = {
  experimental: {
    // Disable Turbopack for now to avoid conflicts
    // turbo: {},
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config: any, { isServer }: WebpackConfigContext) => {
    if (isServer) {
      // Mark certain packages as external to avoid bundling issues
      config.externals = [...(config.externals || []), 'canvas', 'jsdom'];
    } 
    
    // Provide browser polyfills for Node.js core modules
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      http: false, 
      https: false,
      url: false,
      path: false,
      stream: false,
      zlib: false,
      util: false,
      assert: false,
      buffer: require.resolve('buffer/'),
      process: require.resolve('process/browser'),
    };

    return config;
  },
};

export default nextConfig;