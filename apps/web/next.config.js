/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@trustbid/ui", "@trustbid/utils"],
  webpack: (config) => {
    // Suppress optional module warnings from wallet/logger deps
    config.resolve.fallback = {
      ...config.resolve.fallback,
      "pino-pretty": false,
      "@react-native-async-storage/async-storage": false,
    };
    return config;
  },
};

module.exports = nextConfig;
