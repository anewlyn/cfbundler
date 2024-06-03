'use client';

import { createContext, useContext, useState } from 'react';
import useBundle from '@/app/hooks/use-bundle';
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

const initialCart = {
  boxSizeId: '01HHC6A5VTFZQT1DW7A79QCY9F',
  discountId: '01HHC6AHF4RCWF3X5PBP9CVBK7',
  sellingPlanId: new Int32Array([765296849]),
  productVariants: [
    { shopifyId: 40847671722193, quantity: 1 },
    { shopifyId: 40249531367633, quantity: 3 },
    { shopifyId: 41529306185937, quantity: 1 },
  ],
  quantity: 0,
};
/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
const LoopProvider = ({ children }: any) => {
  const [cart, setCart] = useState<cartType>(initialCart);
  const { data, isLoading } = useBundle();

  if (isLoading) {
    return null;
  }

  const { products } = data.data;
  // const flatProducts = setProductsForRender(products);

  const addProductVariant = ({ shopifyId, quantity }: variantType) => {
    const productVariant = cart.productVariants.find(
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
          productVariants: [...prevCart.productVariants, { shopifyId, quantity }],
        }));
      }
    } else {
      setCart((prevCart) => ({
        ...prevCart,
        productVariants: [...prevCart.productVariants, { shopifyId, quantity }],
      }));
    }
  };

  const value = getCartValue(products, cart);
  console.log('value: ', value);
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

  const currentOrderValue = 50;

  const contextValue = {
    addProductVariant,
    benefitTiers,
    cart,
    currentOrderValue,
    deliverCadence,
    mockOrder,
    products: setProductsForRender(products),
    bundle: data.data,
  };

  return <LoopContext.Provider value={contextValue}>{children}</LoopContext.Provider>;
};

export { useLoopContext };
export default LoopProvider;
