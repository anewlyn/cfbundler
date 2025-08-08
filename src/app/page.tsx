import { Bundle } from '@/components/Bundle';
import LoopProvider from '@/contexts/LoopProvider';
import { ShopifyProductType } from '@/types/app/api/shopifyTypes';
import { BundleTypes, ProductTypes } from '@/types/bundleTypes';
import { getBundle } from './api/loop/getBundle';
import getProducts from './api/shopify/getProducts';

export const runtime = 'edge';

const Bundler = async () => {
  const bundleData = await getBundle();
  const getShopifyIdsFromBundle = (bundleData: BundleTypes) => {
    return bundleData.products.map((product: ProductTypes) => product.shopifyId).join(',');
  };

  const shopifyIdString = getShopifyIdsFromBundle(bundleData.data);

  const shopifyProducts = await getProducts(shopifyIdString);

  return (
    <LoopProvider bundleData={bundleData.data} shopifyProducts={shopifyProducts}>
      <Bundle />
    </LoopProvider>
  );
};

export default Bundler;