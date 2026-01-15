// useCorporateStats.ts
import { useQuery } from "@tanstack/react-query";
import { fetchEmployees } from "../services/api";

export const useCorporateStats = () => {
  return useQuery({
    queryKey: ["corporate-stats"],
    queryFn: async () => {
      // Implementar lógica para buscar stats
      const employees = await fetchEmployees();
      return { totalEmployees: employees.length };
    },
  });
};
