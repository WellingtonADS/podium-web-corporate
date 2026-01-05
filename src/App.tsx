import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import theme from "./theme";

import { Login } from "./pages/Login";
import { PrivateRoute } from "./routes/PrivateRoute";
import { MainLayout } from "./layouts/MainLayout";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import CostCenters from "./pages/CostCenters";
import Billing from "./pages/Billing";

const App: React.FC = () => {
  return (
    <ChakraProvider theme={theme}>
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
    </ChakraProvider>
  );
};

export default App;
