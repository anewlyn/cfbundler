// app/bundler/page.tsx (or your original file)
import { Suspense } from 'react';
import { Bundle } from '@/components/Bundle';
import LoopProvider from '@/contexts/LoopProvider';
import { BundleTypes, ProductTypes } from '@/types/bundleTypes';
import { getBundle } from './api/loop/getBundle';
import getProducts from './api/shopify/getProducts';

export const runtime = 'edge';

/**
 * ZERO-CHURN ENV USE:
 * - Admin token: prefer NEXT_PUBLIC_SHOPIFY_ADMIN_ACCESS_TOKEN,
 *   fallback to NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN (if that’s where you stored it).
 * - Domain & API version default to your known values if not set.
 */
const ADMIN_TOKEN =
  process.env.NEXT_PUBLIC_SHOPIFY_ADMIN_ACCESS_TOKEN ||
  process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN || // fallback if you previously put the admin token here
  '';

const STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN || 'cyclingfrog.myshopify.com';
const ADMIN_API_VERSION = process.env.SHOPIFY_ADMIN_API_VERSION || '2025-07';

// --- Admin GraphQL for extra metafields/media ---
const queryString = `
query getBundlerProduct($id: ID!) {
  product(id:$id) {
    title: metafield(namespace:"dev", key:"product_title") { value }
    colors: metafield(namespace:"custom", key:"scheme") { hex: jsonValue }
    variants(first: 10) {
      nodes {
        id
        title
        image { url }
        image1: metafield(namespace:"custom", key:"media_1") { reference { ...on MediaImage { image { url } } } }
        image2: metafield(namespace:"custom", key:"media_2") { reference { ...on MediaImage { image { url } } } }
        image3: metafield(namespace:"custom", key:"media_3") { reference { ...on MediaImage { image { url } } } }
        image4: metafield(namespace:"custom", key:"media_4") { reference { ...on MediaImage { image { url } } } }
        image5: metafield(namespace:"custom", key:"media_5") { reference { ...on MediaImage { image { url } } } }
      }
    }
    image1: metafield(namespace:"custom", key:"media_1") { reference { ...on MediaImage { image { url } } } }
    image2: metafield(namespace:"custom", key:"media_2") { reference { ...on MediaImage { image { url } } } }
    image3: metafield(namespace:"custom", key:"media_3") { reference { ...on MediaImage { image { url } } } }
    image4: metafield(namespace:"custom", key:"media_4") { reference { ...on MediaImage { image { url } } } }
    image5: metafield(namespace:"custom", key:"media_5") { reference { ...on MediaImage { image { url } } } }
  }
}
`;

async function getCustomProductData(ids: string) {
  const idArray = ids.split(',').map(s => s.trim()).filter(Boolean);
  const productData: Array<{
    productId: number;
    title?: string;
    colors?: unknown;
    variants: Array<{
      id: number;
      image?: string | null;
      images: Array<{ imageURL: string | null; altText: string }>;
    }>;
  }> = [];

  for (let i = 0; i < idArray.length; i++) {
    const res = await fetch(
      `https://${STORE_DOMAIN}/admin/api/${ADMIN_API_VERSION}/graphql.json`,
      {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': ADMIN_TOKEN, // ZERO-CHURN: keep existing binding name(s)
        },
        body: JSON.stringify({
          query: queryString,
          variables: { id: `gid://shopify/Product/${idArray[i]}` },
        }),
        cache: 'no-store',
      }
    );

    if (!res.ok) {
      // keep silent for now to avoid churn; optionally console.error text here
      continue;
    }

    const json = await res.json();
    const product = json?.data?.product ?? {};
    const variants =
      product?.variants?.nodes?.map((node: any) => ({
        id: Number(String(node?.id || '').split('/').pop()),
        image: node?.image?.url ?? product?.image1?.reference?.image?.url ?? null,
        images: [
          { imageURL: node?.image1?.reference?.image?.url ?? product?.image1?.reference?.image?.url ?? null, altText: '' },
          { imageURL: node?.image2?.reference?.image?.url ?? product?.image2?.reference?.image?.url ?? null, altText: '' },
          { imageURL: node?.image3?.reference?.image?.url ?? product?.image3?.reference?.image?.url ?? null, altText: '' },
          { imageURL: node?.image4?.reference?.image?.url ?? product?.image4?.reference?.image?.url ?? null, altText: '' },
          { imageURL: node?.image5?.reference?.image?.url ?? product?.image5?.reference?.image?.url ?? null, altText: '' },
        ],
      })) ?? [];

    productData.push({
      productId: Number(idArray[i]),
      title: product?.title?.value ?? undefined,
      colors: product?.colors?.hex,
      variants,
    });
  }

  return productData;
}

// --- Keep the wrapper introduced in the other branch ---
const LoopProviderWrapper = ({
  bundleData,
  shopifyProducts,
  children,
}: {
  bundleData: BundleTypes;
  shopifyProducts: any;
  children: React.ReactNode;
}) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoopProvider bundleData={bundleData} shopifyProducts={shopifyProducts}>
        {children}
      </LoopProvider>
    </Suspense>
  );
};

const Bundler = async () => {
  const bundleData = await getBundle();

  const getShopifyIdsFromBundle = (bd: BundleTypes) =>
    bd.products.map((p: ProductTypes) => p.shopifyId).join(',');

  const shopifyIdString = getShopifyIdsFromBundle(bundleData.data);

  // Faster: do storefront + admin in parallel, but keep your existing helpers untouched
  const [customProductData, shopifyProducts] = await Promise.all([
    getCustomProductData(shopifyIdString), // Admin (uses zero-churn env name(s))
    getProducts(shopifyIdString),          // Storefront (your existing helper)
  ]);

  return (
    <LoopProviderWrapper bundleData={bundleData.data} shopifyProducts={shopifyProducts}>
      <Bundle />
    </LoopProviderWrapper>
  );
};

export default Bundler;
