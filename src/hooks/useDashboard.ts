import { useState, useEffect } from 'react';
import api, { DashboardStats } from '../services/api';

interface UseDashboardReturn {
  stats: DashboardStats | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useDashboard(): UseDashboardReturn {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get<DashboardStats>('/stats/dashboard');
      setStats(response.data);
    } catch (err: any) {
      // Silencia erro 401 (não autenticado) pois ainda está na tela de login
      if (err.response?.status !== 401) {
        const errorMessage = err.response?.data?.detail || err.message || 'Erro ao carregar dashboard';
        setError(errorMessage);
        console.error('Dashboard fetch error:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Só busca se tiver token (usuário autenticado)
    const token = localStorage.getItem('@Podium:token');
    if (token) {
      fetchDashboard();
    } else {
      setLoading(false);
    }
  }, []);

  return {
    stats,
    loading,
    error,
    refetch: fetchDashboard,
  };
}
