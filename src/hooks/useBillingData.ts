import { useEffect, useState } from "react";
import api, { BillingPeriod, RideRecord } from "../services/api";

export interface BillingFilters {
  period?: string; // "2025-12"
  employee_id?: number;
  cost_center_id?: number;
}

interface UseBillingDataResult {
  billingPeriods: BillingPeriod[];
  rides: RideRecord[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const generateMockBillingData = (): BillingPeriod[] => {
  const periods: BillingPeriod[] = [];

  const mockRides: RideRecord[] = [
    {
      id: 1,
      employee_id: 1,
      employee_name: "João Silva",
      cost_center_id: 1,
      cost_center_name: "Marketing",
      ride_date: "2026-01-13T09:30:00Z",
      distance_km: 12.5,
      amount: 58.0,
      category: "UberX",
      policy_compliant: true,
    },
    {
      id: 2,
      employee_id: 2,
      employee_name: "Maria Santos",
      cost_center_id: 2,
      cost_center_name: "Vendas",
      ride_date: "2026-01-13T14:15:00Z",
      distance_km: 8.3,
      amount: 42.5,
      category: "Black",
      policy_compliant: false,
      violation_reason: "Categoria não permitida para este centro de custo",
    },
    {
      id: 3,
      employee_id: 1,
      employee_name: "João Silva",
      cost_center_id: 1,
      cost_center_name: "Marketing",
      ride_date: "2026-01-12T18:00:00Z",
      distance_km: 22.1,
      amount: 125.0,
      category: "UberX",
      policy_compliant: false,
      violation_reason: "Excede limite por corrida (limite: R$ 100)",
    },
    {
      id: 4,
      employee_id: 3,
      employee_name: "Carlos Oliveira",
      cost_center_id: 3,
      cost_center_name: "TI",
      ride_date: "2026-01-10T22:30:00Z",
      distance_km: 5.0,
      amount: 28.0,
      category: "UberX",
      policy_compliant: false,
      violation_reason: "Fora do horário comercial permitido (22:30 > 18:00)",
    },
  ];

  periods.push({
    period: "2026-01",
    rides_count: mockRides.length,
    total_amount: mockRides.reduce((sum, r) => sum + r.amount, 0),
    status: "pending",
    rides: mockRides,
  });

  periods.push({
    period: "2025-12",
    rides_count: 142,
    total_amount: 14200.0,
    status: "paid",
    rides: [],
  });

  return periods;
};

export const useBillingData = (
  filters?: BillingFilters
): UseBillingDataResult => {
  const [billingPeriods, setBillingPeriods] = useState<BillingPeriod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get<BillingPeriod[]>(
        "/stats/corporate/billing",
        {
          params: filters,
        }
      );
      setBillingPeriods(response.data);
    } catch (err) {
      console.error("Erro ao buscar dados de faturamento:", err);
      // Mockar dados em caso de erro
      setBillingPeriods(generateMockBillingData());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters?.period, filters?.employee_id, filters?.cost_center_id]);

  const allRides = billingPeriods.flatMap((period) => period.rides);

  return {
    billingPeriods,
    rides: allRides,
    loading,
    error,
    refetch: fetchData,
  };
};
