/** @type {import('next').NextConfig} */

const nextConfig = {
  sassOptions: {
    includePaths: ['./src/styles/'],
  },
  images: {
    domains: ['cdn.shopify.com'],
  },

  // basePath: '/bundler',
  assetPrefix: '/bundler',
};

export default nextConfig;
