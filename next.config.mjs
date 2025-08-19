/** @type {import('next').NextConfig} */

// Detect CF Pages previews if you use them
const isCFPages = !!process.env.CF_PAGES;
const isPreview = isCFPages && process.env.CF_PAGES_BRANCH !== 'production';

// Keep your own prod switch if you prefer
const isProd = process.env.PROD_ENV === 'production' && !isPreview;

const nextConfig = {
  sassOptions: { includePaths: ['./src/styles/'] },

  images: {
    // External hosts you actually load from
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.shopify.com' },
      // Only needed if you ever embed absolute URLs to your own prod assets:
      ...(isProd ? [{ protocol: 'https', hostname: 'bundler.cyclingfrog.com' }] : []),
    ],
    // IMPORTANT: keep this relative in ALL envs (works with next-on-pages)
    path: '/_next/image',
  },

  // Only force chunks/assets to prod origin in production
  ...(isProd && {
    assetPrefix: 'https://bundler.cyclingfrog.com',
  }),

  // Avoid publicRuntimeConfig in Next 14—use NEXT_PUBLIC_* envs instead
};

export default nextConfig;
