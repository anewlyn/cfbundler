'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { AllProductVariants, BundleTypes } from '@/data/mockProducts';
import { getCartValue, setProductsForRender } from '@/helpers/cartHelpers';

export type LoopContextType = {
  addProductVariant: ({ shopifyId, quantity }: variantType) => void;
  benefitTiers: { subtitle: string; footerMessage: string; value: number }[];
  currentOrderValue: number;
  deliverCadence: BundleTypes['sellingPlans'];
  bundle: BundleTypes;
  products: AllProductVariants[];
  cart: cartType;
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
  sellingPlanId: number;
  productVariants: variantType[];
  quantity: number;
};

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
const LoopProvider = ({
  bundleData,
  children,
}: {
  bundleData: BundleTypes;
  children: React.ReactNode;
}) => {
  const defaultCart: cartType = {
    boxSizeId: bundleData.boxSizes[0].id,
    discountId: bundleData.discounts[0].id,
    sellingPlanId: bundleData.sellingPlans[0].shopifyId,
    productVariants: [],
    quantity: 0,
  };
  const [cart, setCart] = useState<cartType>(defaultCart);
  const [currentOrderValue, setCurrentOrderValue] = useState(0);
  const { products } = bundleData;
  const productsForRender = setProductsForRender(products);

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

  // const setDiscountId = (discountId: string) => {
  //   const getCartValue = getCartValue()
  // }

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
    value: bundleData.discounts[index].minCartQuantity,
  }));

  const deliverCadence = bundleData.sellingPlans;

  const contextValue = {
    addProductVariant,
    benefitTiers,
    cart,
    currentOrderValue: currentOrderValue,
    deliverCadence,
    products: productsForRender,
    setCart,
    bundle: bundleData,
  };

  return <LoopContext.Provider value={contextValue}>{children}</LoopContext.Provider>;
};

export { useLoopContext };
export default LoopProvider;
