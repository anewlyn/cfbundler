import { createContext, useContext } from "react";
import mockData, { mockDataTypes } from "../data/mockData";

export type LoopContextType = {
  mockData: mockDataTypes;
};

const LoopContext = createContext<LoopContextType | undefined>(undefined);

const useLoopContext = () => useContext(LoopContext);

const LoopProvider = ({ children }: any) => {


  const contextValue = {
    mockData
  };

  return (
    <LoopContext.Provider value={contextValue}>
      {children}
    </LoopContext.Provider>
  );
};

export { useLoopContext };
export default LoopProvider;
