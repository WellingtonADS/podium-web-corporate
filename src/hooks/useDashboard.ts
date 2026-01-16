import { useEffect, useState } from "react";
import api, {
  CorporateDashboardStats,
  CostCenterUsage,
  RecentRide,
} from "../services/api";

export const useDashboard = () => {
  const [stats, setStats] = useState<CorporateDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await api.get<CorporateDashboardStats>(
          "/stats/corporate/dashboard"
        );
        setStats(response.data);
        setError(null);
      } catch (err: unknown) {
        console.error("Erro ao carregar stats:", err);
        setError(
          (err as { response?: { data?: { detail?: string } } }).response?.data
            ?.detail || "Erro ao conectar com o servidor"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading, error };
};

export const useCostCentersUsage = () => {
  const [data, setData] = useState<CostCenterUsage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await api.get<CostCenterUsage[]>(
          "/stats/corporate/cost-centers-usage"
        );
        setData(response.data);
        setError(null);
      } catch (err: unknown) {
        console.error("Erro ao carregar uso por centro de custo:", err);
        setError("Erro ao carregar dados");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
};

export const useRecentRides = () => {
  const [data, setData] = useState<RecentRide[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await api.get<RecentRide[]>(
          "/stats/corporate/recent-rides"
        );
        setData(response.data);
        setError(null);
      } catch (err: unknown) {
        console.error("Erro ao carregar últimas corridas:", err);
        setError("Erro ao carregar dados");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
};
