// Desc: This file contains the helper functions for the cart page.

import { shopifyProductType } from '@/app/api/shopify/getProducts';
import { cartType } from '@/contexts/LoopProvider';
import { AllProductVariants, ProductTypes } from '@/data/mockProducts';

type Discount = {
  id: string;
  minCartValue: number;
  name: string;
  type: string;
  value: number;
  purchaseType: string;
  conditionType: string;
  appliesOnEachItem: boolean;
  freeShipping: boolean;
  code: string;
  minCartQuantity: number;
  maxCartQuantity: number;
};

export const getDiscountId = (discounts: Discount[], cartValue: number) => {
  const discount = discounts.find((discount) => discount.minCartValue <= cartValue);
  return discount?.id;
};

export const getCartValue = (products: AllProductVariants[], cart: cartType) => {
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

export const setProductsForRender = (
  products: ProductTypes[],
  shopifyProducts: Record<string, shopifyProductType>,
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
