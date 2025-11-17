// next.config.mjs (or .js with ESM)

const DEFAULT_ASSET_HOST = 'https://bundler.cyclingfrog.com';

function resolveAssetPrefix() {
  const raw = process.env.NEXT_PUBLIC_ASSET_HOST;
  if (!raw) return DEFAULT_ASSET_HOST;
  if (raw === '/') return '';
  return raw;
}

const assetPrefix = resolveAssetPrefix();

/** @type {import('next').NextConfig} */
export default {
  typescript: { ignoreBuildErrors: true },
  sassOptions: { includePaths: ['./src/styles/'] },

  assetPrefix,
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.shopify.com' },
    ],
  },
};
