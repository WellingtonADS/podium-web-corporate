import { Button, useToast } from "@chakra-ui/react";
import { BillingPeriod } from "../../services/api";

interface ExportBillingButtonProps {
  periods: BillingPeriod[];
  filename?: string;
}

export const ExportBillingButton = ({
  periods,
  filename = "relatorio-faturamento.csv",
}: ExportBillingButtonProps) => {
  const toast = useToast();

  const exportToCSV = () => {
    try {
      const allRides = periods.flatMap((p) => p.rides);

      if (allRides.length === 0) {
        toast({
          title: "Nenhum dado para exportar",
          status: "warning",
          duration: 3000,
        });
        return;
      }

      // Cabeçalhos do CSV
      const headers = [
        "ID da Corrida",
        "Funcionário",
        "Centro de Custo",
        "Data/Hora",
        "Categoria",
        "Distância (km)",
        "Valor (R$)",
        "Conformidade",
        "Motivo da Violação",
      ];

      // Linhas de dados
      const rows = allRides.map((ride) => [
        ride.id,
        ride.employee_name,
        ride.cost_center_name,
        new Date(ride.ride_date).toLocaleString("pt-BR"),
        ride.category,
        ride.distance_km.toFixed(2),
        ride.amount.toFixed(2),
        ride.policy_compliant ? "Conforme" : "Violação",
        ride.violation_reason || "",
      ]);

      // Sumário por período
      const summary: string[] = [];
      summary.push("");
      summary.push("");
      summary.push("=== RESUMO POR PERÍODO ===");

      periods.forEach((period) => {
        const compliant = period.rides.filter((r) => r.policy_compliant).length;
        const violations = period.rides.filter(
          (r) => !r.policy_compliant
        ).length;
        summary.push("");
        summary.push(`Período,${period.period}`);
        summary.push(`Total de Corridas,${period.rides_count}`);
        summary.push(`Valor Total,R$ ${period.total_amount.toFixed(2)}`);
        summary.push(`Conforme,${compliant}`);
        summary.push(`Violações,${violations}`);
        summary.push(`Status,${period.status}`);
      });

      // Montar CSV completo
      const csvContent = [
        headers.join(","),
        ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
        ...summary,
      ].join("\n");

      // Criar Blob e download
      const blob = new Blob(["\ufeff" + csvContent], {
        type: "text/csv;charset=utf-8;",
      });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.visibility = "hidden";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Relatório exportado com sucesso!",
        status: "success",
        duration: 3000,
      });
    } catch (error) {
      console.error("Erro ao exportar CSV:", error);
      toast({
        title: "Erro ao exportar relatório",
        status: "error",
        duration: 3000,
      });
    }
  };

  return (
    <Button
      variant="outline"
      colorScheme="gold"
      size="sm"
      onClick={exportToCSV}
    >
      📥 Exportar CSV
    </Button>
  );
};
