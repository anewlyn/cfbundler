const isCFPages = !!process.env.CF_PAGES;
const isPreview = isCFPages && process.env.CF_PAGES_BRANCH !== 'production';

// Respect empty strings - don't coerce them to the default
const ASSET_HOST = process.env.NEXT_PUBLIC_ASSET_HOST ?? 'https://bundler.cyclingfrog.com';

// In previews, force same-origin assets (prevents ORB).
// In production, keep current absolute host.
const assetPrefix = isPreview
  ? (process.env.NEXT_PUBLIC_ASSET_HOST_PREVIEW ?? '') // allow empty string
  : ASSET_HOST;

/** @type {import('next').NextConfig} */
export default {
  typescript: { ignoreBuildErrors: true },
  sassOptions: { includePaths: ['./src/styles/'] },

  assetPrefix,

  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.shopify.com' },
      // keep hardcoded image URLs; 
      // { protocol: 'https', hostname: 'bundler.cyclingfrog.com' },
    ],
  },
};
