/** @type {import('next').NextConfig} */

const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  sassOptions: {
    includePaths: ['./src/styles/'],
  },
  images: {
    domains: ['cdn.shopify.com', 'bundler.cyclingfrog.com'],
    path: isProd ? 'https://bundler.cyclingfrog.com/_next/image' : undefined,
  },
  assetPrefix: isProd ? 'https://bundler.cyclingfrog.com' : '',
  publicRuntimeConfig: {
    assetPrefix: isProd ? 'https://bundler.cyclingfrog.com' : '',
  },
};

export default nextConfig;
