import { createContext, useContext, useEffect, useState } from "react";
import mockData, { mockDataTypes } from "../data/mockData";

export type LoopContextType = {
  mockData: mockDataTypes;
  isMobile: boolean;
};

const LoopContext = createContext<LoopContextType>({} as LoopContextType);

const useLoopContext = () => useContext(LoopContext);

const LoopProvider = ({ children }: any) => {
  // @todo Get data from Loop API
  // @todo Create update functions to update the data

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleDeviceDetection = () => {
      if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    };

    handleDeviceDetection();
  }, []);


  const contextValue = {
    mockData,
    isMobile
  };

  return (
    <LoopContext.Provider value={contextValue}>
      {children}
    </LoopContext.Provider>
  );
};

export { useLoopContext };
export default LoopProvider;
