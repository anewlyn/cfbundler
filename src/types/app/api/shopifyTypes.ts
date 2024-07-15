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

export type ShopifyAttribute = {
  key: string;
  value: string;
};

export type ShopifyCartLine = {
  id: string;
  quantity: number;
  attributes: ShopifyAttribute[];
  merchandise: {
    id: string;
  };
};

export type ShopifyCart = {
  id: string;
  lines: {
    edges: {
      node: ShopifyCartLine;
    }[];
  };
};

export type ShopifyError = {
  message: string;
  locations: { line: number; column: number }[];
  path?: string[];
  extensions?: {
    code?: string;
    typeName?: string;
    fieldName?: string;
  };
};

export type ShopifyCartLineEdge = {
  node: ShopifyCartLine;
};

export type ShopifyFetchResponse = {
  data?: {
    cart?: ShopifyCart;
  };
  errors?: ShopifyError[];
};

export type ShopifyCreateCartResponse = {
  data?: {
    cartCreate?: {
      cart: ShopifyCart;
    };
  };
  errors?: ShopifyError[];
};
