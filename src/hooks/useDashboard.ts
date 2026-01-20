import { useEffect, useState } from "react";
import {
  BillingPeriod,
  CorporateDashboardStats,
  CostCenterUsage,
  RecentRide,
  fetchBillingRecords,
} from "../services/api";

function formatPeriod(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export const useDashboard = () => {
  const [stats, setStats] = useState<CorporateDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const period = formatPeriod();
        const billing = await fetchBillingRecords({ period });
        const p: BillingPeriod | undefined =
          billing && billing.length > 0 ? billing[0] : undefined;

        const mapped: CorporateDashboardStats = {
          total_employees: 0, // backend does not provide this in billing; populate elsewhere if needed
          active_employees: 0,
          rides_completed: p ? p.rides_count : 0,
          total_spent: p ? p.total_amount : 0,
          remaining_budget: 0,
        };

        setStats(mapped);
        setError(null);
      } catch (err: unknown) {
        console.error("Erro ao carregar stats:", err);
        setError(
          (err as { response?: { data?: { detail?: string } } }).response?.data
            ?.detail || "Erro ao conectar com o servidor",
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
        const period = formatPeriod();
        const billing = await fetchBillingRecords({ period });
        const p = billing && billing.length > 0 ? billing[0] : undefined;
        const breakdown = p?.breakdown ?? [];
        const total =
          p?.total_amount ??
          breakdown.reduce((s, b) => s + (b.total_amount || 0), 0);

        const mapped: CostCenterUsage[] = breakdown.map((b) => ({
          cost_center_id: b.cost_center_id ?? 0,
          name: b.cost_center_name ?? "",
          spent: b.total_amount,
          percentage: total > 0 ? (b.total_amount / total) * 100 : 0,
        }));

        setData(mapped);
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
        const period = formatPeriod();
        const billing = await fetchBillingRecords({ period });
        const p = billing && billing.length > 0 ? billing[0] : undefined;
        const rides = p?.rides ?? [];

        const mapped: RecentRide[] = rides.map((r) => ({
          employee_name: r.employee_name ?? "",
          department: "",
          cost_center_name: r.cost_center_name ?? "",
          price: r.amount,
        }));

        setData(mapped);
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
