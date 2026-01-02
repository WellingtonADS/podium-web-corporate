import { useEffect, useState } from "react";
import api, { CorporateDashboardStats } from "../services/api";

export const useDashboard = () => {
  const [stats, setStats] = useState<CorporateDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        // Endpoint corporativo específico - filtrado por company_id do usuário
        const response = await api.get<CorporateDashboardStats>(
          "/stats/corporate/dashboard"
        );
        setStats(response.data);
        setError(null);
      } catch (err: any) {
        console.error("Erro ao carregar stats:", err);
        setError(
          err.response?.data?.detail || "Erro ao conectar com o servidor"
        );
        // Dados mockados para desenvolvimento
        setStats({
          monthly_consumption: 12500,
          active_employees: 45,
          rides_completed: 128,
          remaining_budget: 37500,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading, error };
};
