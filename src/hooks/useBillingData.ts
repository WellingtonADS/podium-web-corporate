import { useCallback, useEffect, useState } from "react";
import {
  BillingFiltersPayload,
  BillingPeriod,
  RideRecord,
  fetchBillingRecords,
} from "../services/api";

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

export const useBillingData = (
  filters?: BillingFilters
): UseBillingDataResult => {
  const [billingPeriods, setBillingPeriods] = useState<BillingPeriod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const payload: BillingFiltersPayload = {
        period: filters?.period,
        employee_id: filters?.employee_id,
        cost_center_id: filters?.cost_center_id,
      };

      const data = await fetchBillingRecords(payload);
      // Backend may return either an array of periods or a single period object; normalize to array
      if (Array.isArray(data)) {
        setBillingPeriods(data);
      } else if (data) {
        setBillingPeriods([data as BillingPeriod]);
      } else {
        setBillingPeriods([]);
      }
    } catch (err: unknown) {
      const errorMsg =
        ((err as Record<string, unknown>)?.message as string) ||
        "Erro ao buscar dados de faturamento";
      setError(errorMsg);
      console.error("Erro em useBillingData:", err);

    } finally {
      setLoading(false);
    }
  }, [filters?.period, filters?.employee_id, filters?.cost_center_id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const allRides = billingPeriods.flatMap((period) => period.rides);

  return {
    billingPeriods,
    rides: allRides,
    loading,
    error,
    refetch: fetchData,
  };
};
