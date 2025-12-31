import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Billing from './pages/Billing';
import CostCenters from './pages/CostCenters';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Login from './pages/Login';

const App: React.FC = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/employees" element={<Employees />} />
      <Route path="/cost-centers" element={<CostCenters />} />
      <Route path="/billing" element={<Billing />} />
    </Routes>
  );
};

export default App;