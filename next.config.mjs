// next.config.mjs

const ASSET_HOST =
  process.env.NEXT_PUBLIC_ASSET_HOST || 'https://bundler.cyclingfrog.com';
const isCFPages = !!process.env.CF_PAGES;
const isPreview = isCFPages && process.env.CF_PAGES_BRANCH !== 'production';

export default {
  typescript: {
    ignoreBuildErrors: true,
  },
  sassOptions: {
    includePaths: ['./src/styles/'],
  },

  // Always emit absolute URLs for _next/* assets
  assetPrefix: ASSET_HOST,

  images: {
    // Disable Next's /_next/image optimizer — avoids storefront 404s
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.shopify.com' },
    ],
    // Note: no `path` key when unoptimized
  },

  // Optional: swap assetPrefix for CF Pages previews
  ...(isPreview && {
    assetPrefix: process.env.NEXT_PUBLIC_ASSET_HOST_PREVIEW || ASSET_HOST,
  }),
};
