'use client';

import { useEffect, useState } from 'react';
import { Bundle } from '@/components/Bundle';
import LoopProvider from '@/contexts/LoopProvider';
import { BundleTypes } from '@/types/bundleTypes';
import { ShopifyProductType } from '@/types/app/api/shopifyTypes';

// Move the API calls to client-side
async function fetchBundleData() {
  const options: RequestInit = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: process.env.NEXT_PUBLIC_LOOP_API_KEY || '',
    },
  };
  
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_LOOP_API_URL}${process.env.NEXT_PUBLIC_LOOP_API_VERSION}/bundle?myshopifyDomain=${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}`,
    options,
  );

  const bundleId = await response.json();

  const bundleResponse = await fetch(
    `${process.env.NEXT_PUBLIC_LOOP_API_URL}${process.env.NEXT_PUBLIC_LOOP_API_VERSION}/bundle/${bundleId.data[0].id}`,
    options,
  );

  return bundleResponse.json();
}

async function fetchProducts(shopifyIdString: string) {
  const options: RequestInit = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      'x-shopify-access-token': process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN || '',
    },
  };

  const response = await fetch(
    `https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/admin/api/2021-07/products.json?ids=${shopifyIdString}`,
    options,
  );

  const data = await response.json();

  const productsObject = data.products.reduce(
    (obj: ShopifyProductType, product: ShopifyProductType) => {
      return {
        ...obj,
        [product.id]: product,
      };
    },
    {},
  );

  return productsObject;
}

export default function Bundler() {
  const [bundleData, setBundleData] = useState<BundleTypes | null>(null);
  const [shopifyProducts, setShopifyProducts] = useState<Record<string, ShopifyProductType> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        console.log('Starting to load data...');
        
        // Fetch bundle data
        const bundle = await fetchBundleData();
        console.log('Bundle fetched:', bundle);
        
        if (!bundle?.data) {
          throw new Error('Invalid bundle data structure');
        }
        
        setBundleData(bundle.data);
        
        // Get product IDs
        const shopifyIdString = bundle.data.products
          .map((product: any) => product.shopifyId)
          .join(',');
        
        console.log('Fetching products for IDs:', shopifyIdString);
        
        // Fetch products
        const products = await fetchProducts(shopifyIdString);
        console.log('Products fetched:', products);
        
        setShopifyProducts(products);
        setLoading(false);
      } catch (err: any) {
        console.error('Error loading data:', err);
        setError(err.message || 'Failed to load bundler data');
        setLoading(false);
      }
    }
    
    loadData();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Loading bundler...</h2>
        <p>Fetching bundle and product data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px' }}>
        <h2>Error Loading Bundler</h2>
        <p style={{ color: 'red' }}>{error}</p>
        <details>
          <summary>Debug Information</summary>
          <pre>
            LOOP_API_URL: {process.env.NEXT_PUBLIC_LOOP_API_URL || 'NOT SET'}
            {'\n'}
            LOOP_API_VERSION: {process.env.NEXT_PUBLIC_LOOP_API_VERSION || 'NOT SET'}
            {'\n'}
            SHOPIFY_DOMAIN: {process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || 'NOT SET'}
            {'\n'}
            Has LOOP_KEY: {process.env.NEXT_PUBLIC_LOOP_API_KEY ? 'YES' : 'NO'}
            {'\n'}
            Has SHOPIFY_TOKEN: {process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN ? 'YES' : 'NO'}
          </pre>
        </details>
      </div>
    );
  }

  if (!bundleData || !shopifyProducts) {
    return (
      <div style={{ padding: '20px' }}>
        <h2>No Data Available</h2>
        <p>Bundle or products data is missing</p>
      </div>
    );
  }

  return (
    <LoopProvider bundleData={bundleData} shopifyProducts={shopifyProducts}>
      <Bundle />
    </LoopProvider>
  );
}