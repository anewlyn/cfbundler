/** @type {import('next').NextConfig} */

const nextConfig = {
  crossOrigin: 'anonymous',
  sassOptions: {
    includePaths: ['./src/styles/'],
  },
  images: {
    domains: ['cdn.shopify.com'],
  },
};

export default nextConfig;
