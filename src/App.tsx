import { ChakraProvider } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { LoadingProvider, useLoading } from "./contexts/LoadingContext";
import { setLoadingContext } from "./services/api";
import theme from "./theme";

import { GlobalLoadingBar } from "./components/UI/GlobalLoadingBar";
import { MainLayout } from "./layouts/MainLayout";
import Billing from "./pages/Billing";
import CostCenters from "./pages/CostCenters";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import { Login } from "./pages/Login";
import { PrivateRoute } from "./routes/PrivateRoute";

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
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/employees" element={<Employees />} />
                  <Route path="/cost-centers" element={<CostCenters />} />
                  <Route path="/billing" element={<Billing />} />
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
