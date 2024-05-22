import { createContext, useContext } from "react";
import mockOrder, { mockOrderTypes } from "../data/mockOrder";
import mockProducts, { mockProductsTypes } from "../data/mockProducts";

export type LoopContextType = {
  mockProducts: mockProductsTypes;
  mockOrder: mockOrderTypes;
  benefitTiers: { label: string; subtitle: string; value: number }[];
  currentOrderValue: number;
};

const LoopContext = createContext<LoopContextType>({} as LoopContextType);

const useLoopContext = () => useContext(LoopContext);

const LoopProvider = ({ children }: any) => {
  // @todo Get data from Loop API
  // @todo Create update functions to update the data
  const benefitTiers = [
    { label: '$50', subtitle: 'Min. Order', value: 50 },
    { label: '$100', subtitle: 'Free Shipping', value: 100 },
    { label: '$150', subtitle: '10% off', value: 150 },
  ];

  const currentOrderValue = 42;

  const contextValue = {
    mockProducts,
    mockOrder,
    benefitTiers,
    currentOrderValue,
  };

  return (
    <LoopContext.Provider value={contextValue}>
      {children}
    </LoopContext.Provider>
  );
};

export { useLoopContext };
export default LoopProvider;
