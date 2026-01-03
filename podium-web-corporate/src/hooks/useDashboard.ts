import { useEffect, useState } from "react";
import { CorporateService } from "../services/corporate";
import { CorporateDashboardStats } from "../types";

export const useDashboard = () => {
  const [stats, setStats] = useState<CorporateDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await CorporateService.getCorporateDashboard();
        setStats(data);
        setError(null);
      } catch (err: any) {
        console.error("Erro ao carregar dashboard:", err);
        setError(
          err.response?.data?.detail || "Erro ao conectar com o servidor"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading, error };
};
