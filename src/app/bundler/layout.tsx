import LoopProvider from '@/contexts/LoopProvider';
import { getBundle } from '../api/loop/getBundle';
import getProducts from '../api/shopify/getProducts';

const BundlerLayout = async ({ children }: { children: React.ReactNode }) => {
  const bundleData = await getBundle();
  const shopifyProducts = await getProducts();

  return (
    <LoopProvider bundleData={bundleData.data} shopifyProducts={shopifyProducts}>
      <section>{children}</section>
    </LoopProvider>
  );
};

export default BundlerLayout;
