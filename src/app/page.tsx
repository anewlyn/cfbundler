import { Suspense } from 'react';
import { Bundle } from '@/components/Bundle';
import LoopProvider from '@/contexts/LoopProvider';
import { ShopifyProductType } from '@/types/app/api/shopifyTypes';
import { BundleTypes, ProductTypes } from '@/types/bundleTypes';
import { getBundle } from './api/loop/getBundle';
import getProducts from './api/shopify/getProducts';

export const runtime = 'edge';

const queryString = `
query getBundlerProduct($id: ID!) {
  product(id:$id) {
    title: metafield(namespace:"dev", key:"product_title") {
      value
    }
    customCategory: metafield(namespace:"custom", key:"category") {
      value
    }
    category {
      name
    }
    colors: metafield(namespace:"custom", key:"scheme") {
      hex: jsonValue
    }
    variants(first: 10) {
      nodes {
        id
        title
        image {
          url
        }
        image1: metafield(namespace:"custom", key:"media_1") {
          reference {
            ...on MediaImage {
              image {
                url
              }
            }
          }
        }
        image2: metafield(namespace:"custom", key:"media_2") {
          reference {
            ...on MediaImage {
              image {
                url
              }
            }
          }
        }
        image3: metafield(namespace:"custom", key:"media_3") {
          reference {
            ...on MediaImage {
              image {
                url
              }
            }
          }
        }
        image4: metafield(namespace:"custom", key:"media_4") {
          reference {
            ...on MediaImage {
              image {
                url
              }
            }
          }
        }
        image5: metafield(namespace:"custom", key:"media_5") {
          reference {
            ...on MediaImage {
              image {
                url
              }
            }
          }
        }
      }
    }
    image1: metafield(namespace:"custom", key:"media_1") {
      reference {
        ...on MediaImage {
          image {
            url
          }
        }
      }
    }
    image2: metafield(namespace:"custom", key:"media_2") {
      reference {
        ...on MediaImage {
          image {
            url
          }
        }
      }
    }
    image3: metafield(namespace:"custom", key:"media_3") {
      reference {
        ...on MediaImage {
          image {
            url
          }
        }
      }
    }
    image4: metafield(namespace:"custom", key:"media_4") {
      reference {
        ...on MediaImage {
          image {
            url
          }
        }
      }
    }
    image5: metafield(namespace:"custom", key:"media_5") {
      reference {
        ...on MediaImage {
          image {
            url
          }
        }
      }
    }
  }
}
`

async function getCustomProductData(ids: string) {
  const idArray = ids.split(',')
  const productData: object[] = []
  for(let i = 0; i < idArray.length; i++) {
    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': process.env.SHOPIFY_ADMIN_ACCESS_TOKEN || '',
      },
      body: JSON.stringify({query: queryString, variables: { id: `gid://shopify/Product/${idArray[i]}` }})
    }
    const res = await fetch('https://cyclingfrog.myshopify.com/admin/api/2025-07/graphql.json', options)
    const json = await res.json()
    const product = { ...json?.data?.product }
    const variants = product.variants?.nodes?.map((node: any) => ({ 
      id: Number(node.id.split('/').pop()), 
      image: node.image?.url ?? product.image1.reference.image.url,
      images: [
        { imageURL: node.image1?.reference.image.url || product.image1?.reference.image.url || null, altText: '' },
        { imageURL: node.image2?.reference.image.url || product.image2?.reference.image.url || null, altText: '' },
        { imageURL: node.image3?.reference.image.url || product.image3?.reference.image.url || null, altText: '' },
        { imageURL: node.image4?.reference.image.url || product.image4?.reference.image.url || null, altText: '' },
        { imageURL: node.image5?.reference.image.url || product.image5?.reference.image.url || null, altText: '' },
      ],
    }))
    productData.push({
      productId: Number(idArray[i]),
      title: product.title.value,
      colors: product.colors.hex,
      customCategory: product.customCategory.value,
      category: product.category.name,
      variants: [...variants],
    })
  }
  console.log('productData', productData)
  return productData
}

// Wrap LoopProvider in a client component that has access to useSearchParams
const LoopProviderWrapper = ({
  bundleData,
  shopifyProducts,
  children,
}: {
  bundleData: BundleTypes;
  shopifyProducts: Record<string, ShopifyProductType>;
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
  
  const shopifyIdString = await getShopifyIdsFromBundle(bundleData.data)
  const customProductData = await getCustomProductData(shopifyIdString)
  
  const shopifyProducts = await getProducts(shopifyIdString);

  return (
    <LoopProviderWrapper bundleData={bundleData.data} shopifyProducts={shopifyProducts}>
      <Bundle customProductData={customProductData} />
    </LoopProviderWrapper>
  );
};

export default Bundler;