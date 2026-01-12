// Desc: This file contains the helper functions for the cart page.

import { CartType } from '@/contexts/LoopProvider';
import { ShopifyProductType } from '@/types/app/api/shopifyTypes';
import { AllProductVariants, DiscountTypes, ProductTypes } from '@/types/bundleTypes';

export const getDiscount = (
  discounts: DiscountTypes[],
  currentOrderValue: number,
): DiscountTypes | null => {
  let newDiscount;

  discounts.forEach((discount) => {
    if (currentOrderValue >= discount.minCartQuantity) {
      newDiscount = discount;
    }
  });

  if (newDiscount) {
    return newDiscount;
  }
  return null;
};

export const getCartValue = (products: AllProductVariants[], cart: CartType) => {
  if (!cart.productVariants) {
    return 0;
  }

  const cartProducts = cart.productVariants;

  let total = 0;
  cartProducts.forEach((cartProduct) => {
    const product = products.find((product) => {
      return product.shopifyId === cartProduct.shopifyId;
    });

    if (product) {
      total += product?.price * cartProduct.quantity;
      return;
    }
  });

  return total;
};

const moveOutOfStockToEnd = (products: AllProductVariants[]) => {
  const inStock = products.filter((product) => {
    return !product.outOfStock;
  });

  const outOfStock = products.filter((product) => {
    return product.outOfStock;
  });

  return [...inStock, ...outOfStock];
};

export const sortByProductType = (products: AllProductVariants[]) => {
  if (!process.env.NEXT_PUBLIC_PRODUCT_SORT_ORDER) {
    return moveOutOfStockToEnd(products);
  }

  const sortOrder = process.env.NEXT_PUBLIC_PRODUCT_SORT_ORDER?.split(',');
  const orderedByType = [];
  sortOrder?.forEach((type) => {
    const sortedProducts = products.filter((product) => {
      return product.productType?.includes(type);
    });
    orderedByType.push(...sortedProducts);
  });
  const sortedNonTypedProducts = products.filter((product) => {
    return sortOrder?.every((type) => !product.productType?.includes(type));
  });
  orderedByType.push(...sortedNonTypedProducts);

  return moveOutOfStockToEnd(orderedByType);
};

export const setProductsForRender = (
  products: ProductTypes[],
  shopifyProducts: Record<string, ShopifyProductType>,
): AllProductVariants[] => {
  return products
    .map((product) => {
      const body_html = shopifyProducts[product.shopifyId]?.body_html;
      const isVariant = product.variants.length > 1;
      const variants = product.variants.map((variant) => {
        const images = [
          { imageURL: variant.imageURL, altText: variant.title },
          ...(shopifyProducts[product.shopifyId]?.images ?? []).map((image) => {
            return { imageURL: image.src, altText: variant.title };
          }),
        ];

        return {
          productTitle: product.title,
          productType: shopifyProducts[product.shopifyId]?.product_type,
          looxReviewId: product.shopifyId,
          images: images,
          price: variant.price,
          outOfStock: variant.outOfStock,
          shopifyId: variant.shopifyId,
          title: variant.title,
          limits: product.limits,
          isVariant,
          body_html: body_html,
        };
      });

      return variants;
    })
    .flat() as AllProductVariants[];
};

export const currencyFormatter = (
  value: number,
  currencyCode: string,
  maximumFractionDigits = 2,
) => {
  return Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
    maximumFractionDigits: maximumFractionDigits,
  }).format(value);
};

export const getDiscountValue = (discount: number, price: number) => {
  const discountAmount = (price * discount) / 100;
  return price - discountAmount;
};
