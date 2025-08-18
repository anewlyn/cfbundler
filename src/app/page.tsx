import { Bundle } from '@/components/Bundle';
import LoopProvider from '@/contexts/LoopProvider';
import { BundleTypes, ProductTypes } from '@/types/bundleTypes';
import { getBundle } from './api/loop/getBundle';
import getProducts from './api/shopify/getProducts';

export const runtime = 'edge';

const Bundler = async () => {
  // Start with a basic check
  if (!process.env.NEXT_PUBLIC_LOOP_API_URL) {
    return (
      <div style={{ padding: '20px' }}>
        <h1>Configuration Error</h1>
        <p>Missing NEXT_PUBLIC_LOOP_API_URL environment variable</p>
      </div>
    );
  }

  try {
    // Try to get bundle data
    console.log('Starting to fetch bundle...');
    const bundleData = await getBundle();
    console.log('Bundle data received:', bundleData ? 'YES' : 'NO');
    
    // Check if we got valid data
    if (!bundleData) {
      return (
        <div style={{ padding: '20px' }}>
          <h1>Error: No bundle data</h1>
          <p>getBundle() returned null or undefined</p>
        </div>
      );
    }
    
    if (!bundleData.data) {
      return (
        <div style={{ padding: '20px' }}>
          <h1>Error: Invalid bundle structure</h1>
          <p>Bundle response missing .data property</p>
          <pre>{JSON.stringify(bundleData, null, 2)}</pre>
        </div>
      );
    }
    
    // Try to get product IDs
    const getShopifyIdsFromBundle = (bundleData: BundleTypes) => {
      if (!bundleData.products || !Array.isArray(bundleData.products)) {
        console.error('Invalid products array in bundle');
        return '';
      }
      return bundleData.products.map((product: ProductTypes) => product.shopifyId).join(',');
    };

    const shopifyIdString = getShopifyIdsFromBundle(bundleData.data);
    console.log('Shopify IDs:', shopifyIdString);
    
    if (!shopifyIdString) {
      return (
        <div style={{ padding: '20px' }}>
          <h1>Error: No products in bundle</h1>
          <p>Bundle has no products or invalid product structure</p>
        </div>
      );
    }
    
    // Try to get Shopify products
    console.log('Fetching Shopify products...');
    const shopifyProducts = await getProducts(shopifyIdString);
    console.log('Shopify products received:', shopifyProducts ? 'YES' : 'NO');
    
    if (!shopifyProducts) {
      return (
        <div style={{ padding: '20px' }}>
          <h1>Error: No Shopify products</h1>
          <p>getProducts() returned null or undefined</p>
          <p>Attempted to fetch IDs: {shopifyIdString}</p>
        </div>
      );
    }

    // If we got here, everything should be working
    return (
      <LoopProvider bundleData={bundleData.data} shopifyProducts={shopifyProducts}>
        <Bundle />
      </LoopProvider>
    );
    
  } catch (error: any) {
    console.error('Caught error in Bundler:', error);
    return (
      <div style={{ padding: '20px' }}>
        <h1>Error in Bundler</h1>
        <p>Error message: {error?.message || 'Unknown error'}</p>
        <details>
          <summary>Error Details</summary>
          <pre>{JSON.stringify(error, null, 2)}</pre>
        </details>
        <details>
          <summary>Stack Trace</summary>
          <pre>{error?.stack || 'No stack trace'}</pre>
        </details>
      </div>
    );
  }
};

export default Bundler;