'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import createTransaction from '@/app/api/loop/createTransaction';
import { ShopifyProductType } from '@/app/api/shopify/getProducts';
import { getCartValue, setProductsForRender } from '@/helpers/cartHelpers';
import { AllProductVariants, BundleTypes } from '@/types/bundleTypes';

export type LoopContextType = {
  addProductVariant: ({ shopifyId, quantity }: variantType) => void;
  benefitTiers: { subtitle: string; footerMessage: string; value: number }[];
  bundle: BundleTypes;
  cart: cartType;
  currentOrderValue: number;
  handleTransaction: () => void;
  products: AllProductVariants[];
  sellingPlans: BundleTypes['sellingPlans'];
  setCart: (arg0: cartType) => void;
};

const LoopContext = createContext<LoopContextType>({} as LoopContextType);

const useLoopContext = () => useContext(LoopContext);

type variantType = {
  shopifyId: number;
  quantity: number;
};

export type cartType = {
  boxSizeId: string;
  discountId: string;
  productVariants: variantType[];
  quantity: number;
  sellingPlanId: number;
};

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
const LoopProvider = ({
  bundleData,
  shopifyProducts,
  children,
}: {
  bundleData: BundleTypes;
  shopifyProducts: Record<string, ShopifyProductType>;
  children: React.ReactNode;
}) => {
  const defaultCart: cartType = {
    boxSizeId: bundleData.boxSizes[0].id,
    discountId: bundleData.discounts[0].id,
    productVariants: [],
    quantity: 0,
    sellingPlanId: bundleData.sellingPlans[0].shopifyId,
  };
  const [cart, setCart] = useState<cartType>(defaultCart);
  const [currentOrderValue, setCurrentOrderValue] = useState(0);
  const { products, discounts, sellingPlans } = bundleData;
  const productsForRender = setProductsForRender(products, shopifyProducts);

  useEffect(() => {
    setCurrentOrderValue(getCartValue(productsForRender, cart));
  }, [cart, productsForRender]);

  const addProductVariant = ({ shopifyId, quantity }: variantType) => {
    const productVariant = cart.productVariants?.find(
      (variant: variantType) => variant.shopifyId === shopifyId,
    );

    if (productVariant) {
      if (quantity === 0) {
        setCart((prevCart) => ({
          ...prevCart,
          productVariants: prevCart.productVariants.filter(
            (variant: variantType) => variant.shopifyId !== shopifyId,
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

  const benefitTiers = [
    {
      subtitle: 'Min. Order',
      footerMessage: 'Subscriptions require a $50 minimum order.',
    },
    {
      footerMessage: 'Yay! You have free shipping.',
      subtitle: 'Free Shipping',
    },
    {
      footerMessage: 'Yay! You have free shipping and a 10% discount.',
      subtitle: '10% off',
    },
  ].map((tier, index) => ({
    ...tier,
    value: discounts[index].minCartQuantity,
  }));

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
