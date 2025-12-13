import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { theme } from './theme';

import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/Login';
import { PrivateRoute } from './routes/PrivateRoute';

const App: React.FC = () => {
  return (
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Rota Pública */}
            <Route path="/login" element={<Login />} />

            {/* Rotas Privadas (Protegidas) */}
            <Route element={<PrivateRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              {/* Redirecionar raiz para dashboard */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Route>
            
            {/* Rota 404 - Opcional */}
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ChakraProvider>
  );
};

export default App;