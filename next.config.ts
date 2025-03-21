import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  // module.exports = {
  //   productionBrowserSourceMaps: false, // Disable source maps in production
  //   webpack: (config, { isServer }) => {
  //     if (!isServer) {
  //       config.devtool = false; // Disable source maps in development
  //     }
  //     return config;
  //   },
  // };
};

export default nextConfig;
