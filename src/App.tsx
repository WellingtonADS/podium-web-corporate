import { ChakraProvider } from "@chakra-ui/react";
import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import theme from "./theme";

import { MainLayout } from "./layouts/MainLayout"; // <--- Novo Import
import { Dashboard } from "./pages/Dashboard";
import { Drivers } from "./pages/Drivers";
import { Login } from "./pages/Login";
import { PrivateRoute } from "./routes/PrivateRoute";

const App: React.FC = () => {
  return (
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route element={<PrivateRoute />}>
              {/* O MainLayout envolve as rotas internas */}
              <Route element={<MainLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/drivers" element={<Drivers />} />

                {/* Rotas Futuras (Placeholders) */}
                <Route path="/rides" element={<Dashboard />} />
                <Route path="/pricing" element={<Dashboard />} />
              </Route>

              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Route>

            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ChakraProvider>
  );
};

export default App;
