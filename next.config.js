/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "ipfs.io",
      "gateway.pinata.cloud",
      "cloudflare-ipfs.com",
      "yellow-imperial-wasp-317.mypinata.cloud",
    ],
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    return config;
  },
};

module.exports = nextConfig;
