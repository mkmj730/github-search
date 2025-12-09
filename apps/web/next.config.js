/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    turbo: true
  },
  transpilePackages: ["@workspace/core", "@workspace/data", "@workspace/ui", "@workspace/wasm"]
};

module.exports = nextConfig;
