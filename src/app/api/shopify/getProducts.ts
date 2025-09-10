import { ShopifyProductType } from '@/types/app/api/shopifyTypes'

const getProducts = async (shopifyIdString: string) => {
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
};

export default getProducts;
