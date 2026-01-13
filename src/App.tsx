import { ChakraProvider, Flex, Spinner } from "@chakra-ui/react";
import React, { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { LoadingProvider, useLoading } from "./contexts/LoadingContext";
import { setLoadingContext } from "./services/api";
import theme from "./theme";

import { GlobalLoadingBar } from "./components/UI/GlobalLoadingBar";
import { MainLayout } from "./layouts/MainLayout";
import { Login } from "./pages/Login";
import { PrivateRoute } from "./routes/PrivateRoute";

// Lazy loading das páginas principais
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Employees = lazy(() => import("./pages/Employees"));
const CostCenters = lazy(() => import("./pages/CostCenters"));
const Billing = lazy(() => import("./pages/Billing"));

// Fallback de loading para Suspense
const PageFallback = () => (
  <Flex h="100vh" w="100vw" align="center" justify="center" bg="midnight.900">
    <Spinner size="xl" color="gold.600" thickness="4px" speed="0.65s" />
  </Flex>
);

// Componente helper para injetar LoadingContext no api.ts
function LoadingInjector() {
  const { startLoading, stopLoading } = useLoading();

  useEffect(() => {
    setLoadingContext({ startLoading, stopLoading });
  }, [startLoading, stopLoading]);

  return null;
}

const App: React.FC = () => {
  return (
    <ChakraProvider theme={theme}>
      <LoadingProvider>
        <LoadingInjector />
        <GlobalLoadingBar />
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />

              <Route element={<PrivateRoute />}>
                <Route element={<MainLayout />}>
                  <Route
                    path="/dashboard"
                    element={
                      <Suspense fallback={<PageFallback />}>
                        <Dashboard />
                      </Suspense>
                    }
                  />
                  <Route
                    path="/employees"
                    element={
                      <Suspense fallback={<PageFallback />}>
                        <Employees />
                      </Suspense>
                    }
                  />
                  <Route
                    path="/cost-centers"
                    element={
                      <Suspense fallback={<PageFallback />}>
                        <CostCenters />
                      </Suspense>
                    }
                  />
                  <Route
                    path="/billing"
                    element={
                      <Suspense fallback={<PageFallback />}>
                        <Billing />
                      </Suspense>
                    }
                  />
                  <Route
                    path="/"
                    element={<Navigate to="/dashboard" replace />}
                  />
                </Route>
              </Route>
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </LoadingProvider>
    </ChakraProvider>
  );
};

export default App;
