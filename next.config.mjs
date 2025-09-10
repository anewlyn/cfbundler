/** @type {import('next').NextConfig} */

const isProd = process.env.PROD_ENV === 'production';

const prodDomains = [
  { protocol: 'https', hostname: 'cdn.shopify.com' },
  { protocol: 'https', hostname: 'bundler.cyclingfrog.com' },
];
const nonProdDomains = [{ protocol: 'https', hostname: 'cdn.shopify.com' }];

const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  sassOptions: {
    includePaths: ['./src/styles/'],
  },
  images: {
    remotePatterns: isProd ? prodDomains : nonProdDomains,
    ...(isProd && {
      path: 'https://bundler.cyclingfrog.com/_next/image',
    }),
  },
  ...(isProd && {
    assetPrefix: 'https://bundler.cyclingfrog.com',
    publicRuntimeConfig: {
      assetPrefix: 'https://bundler.cyclingfrog.com',
    },
  }),
};

export default nextConfig;
