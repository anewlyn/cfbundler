type ImageType = {
  id: number;
  alt: string;
  position: number;
  product_id: number;
  created_at: string;
  updated_at: string;
  admin_graphql_api_id: string;
  width: number;
  height: number;
  src: string;
  variant_ids: number[];
};

type OptionType = {
  id: number;
  product_id: number;
  name: string;
  position: number;
  values: string[];
};

type VariantType = {
  id: number;
  product_id: number;
  title: string;
  price: string;
  sku: string;
  position: number;
  inventory_policy: string;
  compare_at_price: string;
  fulfillment_service: string;
  inventory_management: string;
  option1: string;
  option2: string;
  option3: string;
  created_at: string;
  updated_at: string;
  taxable: boolean;
  barcode: string;
  grams: number;
  weight: number;
  weight_unit: string;
  inventory_item_id: number;
  inventory_quantity: number;
  old_inventory_quantity: number;
  tax_code: string;
  requires_shipping: boolean;
  admin_graphql_api_id: string;
  image_id: number;
};

export type ShopifyProductType = {
  id: number;
  title: string;
  body_html: string;
  vendor: string;
  product_type: string;
  created_at: string;
  handle: string;
  updated_at: string;
  published_at: string;
  template_suffix: string;
  published_scope: string;
  tags: string;
  status: string;
  admin_graphql_api_id: string;
  variants: VariantType[];
  options: OptionType[];
  images: ImageType[];
  image: ImageType;
};

const getProducts = async () => {
  try {
    const options: RequestInit = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        'x-shopify-access-token': process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN || '',
      },
    };

    const response = await fetch(
      `https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/admin/api/2021-07/products.json`,
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
  } catch (err) {
    console.error(err);
  }
};
export default getProducts;
