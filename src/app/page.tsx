import { Suspense } from 'react';
import { Bundle } from '@/components/Bundle';
import LoopProvider from '@/contexts/LoopProvider';
import { BundleTypes, ProductTypes } from '@/types/bundleTypes';
import { getBundle } from './api/loop/getBundle';
import getProducts from './api/shopify/getProducts';

export const runtime = 'edge';

// Wrap LoopProvider in a client component that has access to useSearchParams
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
  const getShopifyIdsFromBundle = (bundleData: BundleTypes) => {
    return bundleData.products.map((product: ProductTypes) => product.shopifyId).join(',');
  };

  const shopifyIdString = getShopifyIdsFromBundle(bundleData.data);

  const shopifyProducts = await getProducts(shopifyIdString);

  return (
    <LoopProviderWrapper bundleData={bundleData.data} shopifyProducts={shopifyProducts}>
      <Bundle />
    </LoopProviderWrapper>
  );
};

export default Bundler;