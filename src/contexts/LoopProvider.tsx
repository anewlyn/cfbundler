'use client';
import { createContext, useContext, useState } from 'react';
import createTransaction from '@/app/api/loop/createTransaction';

import { BenefitTierTypes, tiers } from '@/content/benefitTiers';
import { getCartValue, setProductsForRender } from '@/helpers/cartHelpers';
import { ShopifyProductType } from '@/types/app/api/shopifyTypes';
import { AllProductVariants, BundleTypes, DiscountTypes } from '@/types/bundleTypes';

export type LoopContextType = {
  addProductVariant: ({ shopifyId, quantity }: VariantType) => void;
  benefitTiers: { subtitle: string; footerMessage: string; value: number }[];
  bundle: BundleTypes;
  cart: CartType;
  currentOrderValue: number;
  handleTransaction: () => void;
  products: AllProductVariants[];
  sellingPlans: BundleTypes['sellingPlans'];
  setCart: (arg0: CartType) => void;
};

const LoopContext = createContext<LoopContextType>({} as LoopContextType);

const useLoopContext = () => useContext(LoopContext);

type VariantType = {
  shopifyId: number;
  quantity: number;
};

export type CartType = {
  boxSizeId: string;
  discountId: string;
  productVariants: VariantType[];
  quantity: number;
  sellingPlanId: number;
};

const setBenefitTierContents = (discounts: DiscountTypes[], tiers: BenefitTierTypes) => {
  return tiers.map((tier, index) => ({
    ...tier,
    value: discounts[index].minCartQuantity,
  }));
};

const LoopProvider = ({
  bundleData,
  shopifyProducts,
  children,
}: {
  bundleData: BundleTypes;
  shopifyProducts: Record<string, ShopifyProductType>;
  children: React.ReactNode;
}) => {
  const defaultCart: CartType = {
    boxSizeId: bundleData.boxSizes[0].id,
    discountId: bundleData.discounts[0].id,
    productVariants: [],
    quantity: 0,
    sellingPlanId: bundleData.sellingPlans[0].shopifyId,
  };
  const [cart, setCart] = useState<CartType>(defaultCart);
  const { products, discounts, sellingPlans } = bundleData;
  const productsForRender = setProductsForRender(products, shopifyProducts);

  const currentOrderValue = getCartValue(productsForRender, cart);

  const addProductVariant = ({ shopifyId, quantity }: VariantType) => {
    const productVariant = cart.productVariants?.find(
      (variant: VariantType) => variant.shopifyId === shopifyId,
    );

    if (productVariant) {
      if (quantity === 0) {
        setCart((prevCart) => ({
          ...prevCart,
          productVariants: prevCart.productVariants.filter(
            (variant: VariantType) => variant.shopifyId !== shopifyId,
          ),
        }));
      } else {
        setCart((prevCart) => ({
          ...prevCart,
          productVariants: prevCart.productVariants.map((variant) =>
            variant.shopifyId === shopifyId ? { ...variant, quantity: quantity } : variant,
          ),
        }));
      }
    } else {
      setCart((prevCart) => ({
        ...prevCart,
        productVariants: [...prevCart.productVariants, { shopifyId, quantity }],
      }));
    }
  };

  const handleTransaction = () => {
    createTransaction(cart, bundleData.id);
    // @todo navigate to cyclingfrog.com/cart
  };

  const benefitTiers = setBenefitTierContents(discounts, tiers);

  const contextValue = {
    addProductVariant,
    benefitTiers,
    bundle: bundleData,
    cart,
    currentOrderValue: currentOrderValue,
    handleTransaction,
    products: productsForRender,
    sellingPlans,
    setCart,
  };

  return <LoopContext.Provider value={contextValue}>{children}</LoopContext.Provider>;
};

export { useLoopContext };
export default LoopProvider;
