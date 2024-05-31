'use client';

import { createContext, useContext } from 'react';
import mockOrder, { mockOrderTypes } from '@/data/mockOrder';
import mockProducts, { mockProductsTypes } from '@/data/mockProducts';

export type LoopContextType = {
  mockProducts: mockProductsTypes;
  mockOrder: mockOrderTypes;
  benefitTiers: { label: string; subtitle: string; footerMessage: string; value: number }[];
  currentOrderValue: number;
};

const LoopContext = createContext<LoopContextType>({} as LoopContextType);

const useLoopContext = () => useContext(LoopContext);

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
const LoopProvider = ({ children }: any) => {
  // @todo Get data from Loop API
  // const bundles = fetch(`${process.env.NEXT_PUBLIC_URL}/api/loop/bundles`).then((res) => res.json());
  // const bundles = Query.useQuery('bundles', () => fetch('/api/loop/bundles').then((res) => res.json()));
  // console.log('bundles: ', bundles);

  // const product = getProducts();
  // console.log('product: ', product);
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

  const currentOrderValue = 50;

  const contextValue = {
    mockProducts,
    mockOrder,
    benefitTiers,
    currentOrderValue,
  };

  return <LoopContext.Provider value={contextValue}>{children}</LoopContext.Provider>;
};

export { useLoopContext };
export default LoopProvider;
