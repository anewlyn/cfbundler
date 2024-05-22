import { createContext, useContext } from "react";
import mockOrder, { mockOrderTypes } from "../data/mockOrder";
import mockProducts, { mockProductsTypes } from "../data/mockProducts";

export type LoopContextType = {
  mockProducts: mockProductsTypes;
  mockOrder: mockOrderTypes;
};

const LoopContext = createContext<LoopContextType>({} as LoopContextType);

const useLoopContext = () => useContext(LoopContext);

const LoopProvider = ({ children }: any) => {
  // @todo Get data from Loop API
  // @todo Create update functions to update the data

  const contextValue = {
    mockProducts,
    mockOrder,
  };

  return (
    <LoopContext.Provider value={contextValue}>
      {children}
    </LoopContext.Provider>
  );
};

export { useLoopContext };
export default LoopProvider;
