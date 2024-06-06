'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import mockOrder, { mockOrderTypes } from '@/data/mockOrder';
import { AllProductVariants, BundleTypes } from '@/data/mockProducts';
import { getCartValue, setProductsForRender } from '@/helpers/cartHelpers';

export type LoopContextType = {
  addProductVariant: ({ shopifyId, quantity }: variantType) => void;
  benefitTiers: { label: string; subtitle: string; footerMessage: string; value: number }[];
  currentOrderValue: number;
  deliverCadence: string[];
  mockOrder: mockOrderTypes;
  bundle: BundleTypes;
  products: AllProductVariants[];
  cart: cartType;
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
  sellingPlanId: Int32Array;
  productVariants: variantType[];
  quantity: number;
};

const defaultCart: cartType = {
  boxSizeId: '',
  discountId: '',
  sellingPlanId: new Int32Array(),
  productVariants: [],
  quantity: 0,
};

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
const LoopProvider = ({
  bundleData,
  children,
}: {
  bundleData: BundleTypes;
  children: React.ReactNode;
}) => {
  const [cart, setCart] = useState(defaultCart);
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

  // @todo Create update functions to update the data
  const benefitTiers = [
    {
      label: '$50',
      subtitle: 'Min. Order',
      footerMessage: 'Subscriptions require a $50 minimum order.',
      value: 50,
    },
    {
      label: '$100',
      footerMessage: 'Yay! You have free shipping.',
      subtitle: 'Free Shipping',
      value: 100,
    },
    {
      label: '$150',
      footerMessage: 'Yay! You have free shipping and a 10% discount.',
      subtitle: '10% off',
      value: 150,
    },
  ];

  const deliverCadence = ['2 WEEKS', '4 WEEKS', '6 WEEKS', '8 WEEKS'];

  const contextValue = {
    addProductVariant,
    benefitTiers,
    cart,
    currentOrderValue: currentOrderValue,
    deliverCadence,
    mockOrder,
    products: productsForRender,
    bundle: bundleData,
  };

  return <LoopContext.Provider value={contextValue}>{children}</LoopContext.Provider>;
};

export { useLoopContext };
export default LoopProvider;
