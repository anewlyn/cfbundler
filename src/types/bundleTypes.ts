// Temporary file to define the shape of the data that will be used in the app.
export type VariantTypes = {
  shopifyId: number;
  title: string;
  price: number;
  position: number;
  taxable: boolean;
  imageURL: string;
  requiresShipping: boolean;
  outOfStock: boolean;
  limits: {
    boxSizeId: string;
    categoryId: string;
    maxValue: number;
  }[];
};

export type AllProductVariants = {
  productTitle: string;
  images: { imageURL: string; altText: string }[];
  price: number;
  outOfStock: boolean;
  shopifyId: number;
  title: string;
  body_html: string;
  limits: {
    boxSizeId: string;
    categoryId: string;
    maxValue: number;
  }[];
  isVariant: boolean;
  variants: VariantTypes[];
};

export type ProductTypes = {
  shopifyId: number;
  title: string;
  handle: string;
  status: string;
  options: {
    id: string;
    name: string;
    values: string[];
    position: number;
  }[];
  variants: VariantTypes[];
  categoryId: string;
  limits: {
    boxSizeId: string;
    categoryId: string;
    maxValue: number;
  }[];
};

export type BundleTypes = {
  id: string;
  name: string;
  description: string;
  imageURL: string;
  type: string;
  status: string;
  currencyCode: string;
  currencySymbol: string;
  purchaseType: string;
  boxSizes: {
    id: string;
    name: string;
    minSize: number;
    maxSize: number;
    defaultSelected: boolean;
  }[];
  discounts: {
    id: string;
    name: string;
    code: string;
    type: string;
    value: number;
    conditionType: string;
    minCartValue: number;
    minCartQuantity: number;
    purchaseType: string;
    appliesOnEachItem: boolean;
  }[];
  sellingPlans: {
    shopifyId: number;
    name: string;
    description: string;
    discounts: {
      type: string;
      value: number;
    }[];
    deliveryInterval: string;
    deliveryIntervalCount: number;
    billingInterval: string;
    billingIntervalCount: number;
  }[];
  categories: {
    id: string;
    title: string;
    subTitle: string;
    imageURL: string;
    limits: {
      boxSizeId: string;
      minValue: number;
      maxValue: number;
    }[];
  }[];
  products: ProductTypes[];
};
