/** @type {import('next').NextConfig} */

const isProd = process.env.NODE_ENV === 'production';

const prodDomains = ['cdn.shopify.com', 'bundler.cyclingfrog.com'];
const nonProdDomains = ['cdn.shopify.com'];

const nextConfig = {
  sassOptions: {
    includePaths: ['./src/styles/'],
  },
  images: {
    domains: isProd ? prodDomains : nonProdDomains,
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
