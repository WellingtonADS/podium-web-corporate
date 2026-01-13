import { createContext, ReactNode, useContext, useState } from "react";

interface LoadingContextData {
  isLoading: boolean;
  requestCount: number;
  startLoading: () => void;
  stopLoading: () => void;
}

const LoadingContext = createContext<LoadingContextData>(
  {} as LoadingContextData
);

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [requestCount, setRequestCount] = useState(0);

  const startLoading = () => {
    setRequestCount((prev) => prev + 1);
  };

  const stopLoading = () => {
    setRequestCount((prev) => Math.max(0, prev - 1));
  };

  const isLoading = requestCount > 0;

  return (
    <LoadingContext.Provider
      value={{ isLoading, requestCount, startLoading, stopLoading }}
    >
      {children}
    </LoadingContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within LoadingProvider");
  }
  return context;
};
