import {
  Box,
  Button,
  Flex,
  HStack,
  Input,
  List,
  ListItem,
  Progress,
  SimpleGrid,
  Spinner,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import {
  BookingForm,
  EmployeesTable,
  FormInput,
  FormModal,
  FormSelect,
} from "../components";
import { EmployeeRow } from "../components/Tables/EmployeesTable";
import api, {
  CostCenter,
  CreateEmployeeData,
  fetchCostCenters,
  User,
} from "../services/api";
import {
  importEmployeesBatch,
  importEmployeesSequential,
  ImportResult,
  ParsedEmployeeRow,
  parseEmployeesCsv,
} from "../services/onboarding";

const Employees: React.FC = () => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isImportOpen,
    onOpen: onOpenImport,
    onClose: onCloseImport,
  } = useDisclosure();

  const [employees, setEmployees] = useState<EmployeeRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [costCenters, setCostCenters] = useState<CostCenter[]>([]);

  const [importRows, setImportRows] = useState<ParsedEmployeeRow[]>([]);
  const [parseIssues, setParseIssues] = useState<
    { line: number; message: string }[]
  >([]);
  const [importResults, setImportResults] = useState<ImportResult[]>([]);
  const [importProgress, setImportProgress] = useState<{
    completed: number;
    total: number;
  }>({
    completed: 0,
    total: 0,
  });

  // Booking modal
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingPassengerId, setBookingPassengerId] = useState<
    number | undefined
  >(undefined);
  const openBookingFor = (employeeId: number) => {
    setBookingPassengerId(employeeId);
    setIsBookingOpen(true);
  };
  const closeBooking = () => {
    setBookingPassengerId(undefined);
    setIsBookingOpen(false);
  };
  const [isImporting, setIsImporting] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [importFileName, setImportFileName] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [formData, setFormData] = useState<CreateEmployeeData>({
    full_name: "",
    email: "",
    password: "",
    role: "employee",
    department: "",
    cost_center_id: undefined,
  });

  const [editingEmployee, setEditingEmployee] = useState<EmployeeRow | null>(
    null
  );
  const [editFormData, setEditFormData] = useState<{
    department: string;
    cost_center_id?: number;
  }>({
    department: "",
    cost_center_id: undefined,
  });

  const normalizeEmployee = (
    user: User,
    ccMap: Map<number, string> | null = null
  ): EmployeeRow => {
    const cost_center_id =
      user.employee_profile?.cost_center_id ?? user.cost_center_id ?? undefined;
    return {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      department: user.employee_profile?.department || "",
      cost_center_id: cost_center_id,
      cost_center_name: cost_center_id ? ccMap?.get(cost_center_id) : undefined,
      is_active: user.is_active,
    };
  };

  const fetchEmployees = async () => {
    try {
      setLoading(true);

      const [ccs, usersResp] = await Promise.all([
        fetchCostCenters(),
        api.get<User[]>("/users/", { params: { role: "employee" } }),
      ]);

      setCostCenters(ccs);

      const ccMap = new Map<number, string>(
        ccs.map((c: CostCenter) => [Number(c.id), c.name])
      );

      console.log("🔍 DADOS RAW DA API:", usersResp.data.slice(0, 2));
      console.log(
        "🔍 APÓS NORMALIZAÇÃO:",
        usersResp.data.slice(0, 2).map((u) => normalizeEmployee(u, ccMap))
      );

      setEmployees(usersResp.data.map((u) => normalizeEmployee(u, ccMap)));
    } catch (error) {
      console.error("Erro ao buscar funcionários:", error);
      toast({
        title: "Erro ao carregar funcionários",
        description:
          "Não foi possível conectar à API. Verifique se o backend está rodando.",
        status: "error",
        duration: 5000,
      });
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreateEmployee = async () => {
    try {
      setIsSaving(true);
      await api.post("/corporate/employees", formData);

      toast({
        title: "Funcionário cadastrado!",
        status: "success",
        duration: 3000,
      });

      onClose();
      setFormData({
        full_name: "",
        email: "",
        password: "",
        role: "employee",
        department: "",
        cost_center_id: undefined,
      });
      fetchEmployees();
    } catch {
      toast({
        title: "Erro ao criar funcionário",
        description: "Verifique os dados e tente novamente.",
        status: "error",
        duration: 4000,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditEmployee = (employee: EmployeeRow) => {
    setEditingEmployee(employee);
    setEditFormData({
      department: employee.department,
      cost_center_id: employee.cost_center_id,
    });
  };

  const handleUpdateEmployee = async () => {
    if (!editingEmployee) return;

    try {
      setIsSaving(true);
      await api.patch(
        `/corporate/employees/${editingEmployee.id}`,
        editFormData
      );

      toast({
        title: "Funcionário atualizado!",
        status: "success",
        duration: 3000,
      });

      setEditingEmployee(null);
      fetchEmployees();
    } catch {
      toast({
        title: "Erro ao atualizar funcionário",
        description: "Verifique os dados e tente novamente.",
        status: "error",
        duration: 4000,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCloseEditModal = () => {
    setEditingEmployee(null);
    setEditFormData({ department: "", cost_center_id: undefined });
  };

  const resetImportState = () => {
    setImportRows([]);
    setParseIssues([]);
    setImportResults([]);
    setImportProgress({ completed: 0, total: 0 });
    setImportFileName("");
    setIsParsing(false);
    setIsImporting(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleCloseImport = () => {
    resetImportState();
    onCloseImport();
  };

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImportFileName(file.name);
    setIsParsing(true);
    setParseIssues([]);
    setImportResults([]);
    setImportRows([]);
    setImportProgress({ completed: 0, total: 0 });

    try {
      const { rows, errors } = await parseEmployeesCsv(file);
      setImportRows(rows);
      setImportProgress({ completed: 0, total: rows.length });
      setParseIssues(
        errors.map((err) => ({ line: err.line, message: err.message }))
      );

      if (errors.length > 0) {
        toast({
          title: "Erros encontrados no CSV",
          description: "Revise as linhas indicadas antes de importar.",
          status: "warning",
          duration: 4000,
        });
      }
    } catch {
      toast({
        title: "Falha ao ler CSV",
        status: "error",
        duration: 4000,
      });
    } finally {
      setIsParsing(false);
    }
  };

  const handleImport = async () => {
    if (!importRows.length) {
      toast({
        title: "Selecione um arquivo CSV válido",
        status: "warning",
        duration: 3000,
      });
      return;
    }

    setIsImporting(true);
    setImportResults([]);
    setImportProgress({ completed: 0, total: importRows.length });

    try {
      // Try batch API first
      const results = await importEmployeesBatch(
        importRows,
        (completed, total) => {
          setImportProgress({ completed, total });
        }
      );

      setImportResults(results);

      const successCount = results.filter((r) => r.success).length;
      const errorCount = results.length - successCount;

      toast({
        title: `Importação concluída: ${successCount} sucesso(s), ${errorCount} erro(s)`,
        status: errorCount > 0 ? "warning" : "success",
        duration: 5000,
      });

      if (successCount > 0) {
        fetchEmployees();
      }
    } catch (err) {
      // Fallback para modo sequencial caso o endpoint não exista ou falhe
      console.warn(
        "Batch import failed, falling back to sequential import:",
        err
      );
      try {
        toast({
          title: "Usando modo de fallback: importação sequencial",
          status: "info",
          duration: 4000,
        });

        const results = await importEmployeesSequential(
          importRows,
          (completed, total) => {
            setImportProgress({ completed, total });
          }
        );

        setImportResults(results);

        const successCount = results.filter((r) => r.success).length;
        const errorCount = results.length - successCount;

        toast({
          title: `Importação concluída: ${successCount} sucesso(s), ${errorCount} erro(s)`,
          status: errorCount > 0 ? "warning" : "success",
          duration: 5000,
        });

        if (successCount > 0) {
          fetchEmployees();
        }
      } catch {
        toast({
          title: "Falha ao importar colaboradores",
          status: "error",
          duration: 4000,
        });
      }
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <Box>
      {/* Título e Botão */}
      <Flex align="center" justify="space-between" mb={6}>
        <Text textStyle="h2" color="white">
          Gestão de{" "}
          <Text as="span" color="brand.600">
            Funcionários
          </Text>
        </Text>
        <HStack spacing={3}>
          <Button
            variant="outline"
            colorScheme="gold"
            size="sm"
            onClick={onOpenImport}
          >
            Importar CSV
          </Button>
          <Button colorScheme="gold" size="sm" onClick={onOpen}>
            + Novo Funcionário
          </Button>
        </HStack>
      </Flex>

      {/* Tabela de Listagem */}
      {loading ? (
        <Flex justify="center" p={10}>
          <Spinner color="brand.600" />
        </Flex>
      ) : (
        <EmployeesTable
          employees={employees}
          onEdit={handleEditEmployee}
          actions={(employee) => (
            <>
              <Button
                size="sm"
                colorScheme="green"
                onClick={() => openBookingFor(employee.id)}
              >
                Solicitar Corrida
              </Button>
            </>
          )}
        />
      )}

      <FormModal
        isOpen={isImportOpen}
        onClose={handleCloseImport}
        title="Importar colaboradores via CSV"
        onSubmit={handleImport}
        isLoading={isImporting}
        submitLabel={isImporting ? "Importando..." : "Importar"}
      >
        {" "}
      </FormModal>

      <BookingForm
        isOpen={isBookingOpen}
        onClose={closeBooking}
        initialPassengerId={bookingPassengerId}
      />

      <FormModal
        isOpen={isOpen}
        onClose={onClose}
        title="Novo Funcionário"
        onSubmit={handleCreateEmployee}
        isLoading={isSaving}
        submitLabel="Salvar Funcionário"
      >
        {" "}
        <Text fontSize="sm" color="midnight.600" mb={3}>
          Campos obrigatórios: Nome, Email, Centro de Custo (ID). Delimitador
          "," ou ";". Máximo recomendado: 500 linhas.
        </Text>
        <Input
          type="file"
          accept=".csv"
          onChange={handleFileSelect}
          ref={fileInputRef}
          mb={3}
          cursor="pointer"
          disabled={isParsing || isImporting}
        />
        {importFileName && (
          <Text fontSize="sm" fontWeight="600" mb={2}>
            Arquivo: {importFileName}
          </Text>
        )}
        {isParsing && (
          <Text fontSize="sm" color="midnight.600" mb={2}>
            Lendo e validando arquivo...
          </Text>
        )}
        {importProgress.total > 0 && (
          <Box mb={3}>
            <Text fontSize="sm" mb={1}>
              Linhas prontas: {importRows.length}
            </Text>
            <Progress
              value={
                importProgress.total === 0
                  ? 0
                  : (importProgress.completed / importProgress.total) * 100
              }
              size="sm"
              colorScheme="gold"
              isAnimated={isImporting}
            />
            {isImporting && (
              <Text fontSize="xs" color="midnight.600" mt={1}>
                {importProgress.completed}/{importProgress.total} processadas
              </Text>
            )}
          </Box>
        )}
        {parseIssues.length > 0 && (
          <Box mb={3}>
            <Text fontSize="sm" fontWeight="600" mb={1}>
              Erros de validação ({parseIssues.length})
            </Text>
            <List spacing={1} maxH="120px" overflowY="auto">
              {parseIssues.map((err) => (
                <ListItem
                  key={`${err.line}-${err.message}`}
                  fontSize="sm"
                  color="red.500"
                >
                  Linha {err.line}: {err.message}
                </ListItem>
              ))}
            </List>
          </Box>
        )}
        {importResults.length > 0 && (
          <Box mt={2} maxH="160px" overflowY="auto">
            <Text fontSize="sm" fontWeight="600" mb={1}>
              Resultado da importação
            </Text>
            <List spacing={1}>
              {importResults.map((result) => (
                <ListItem
                  key={`${result.line}-${result.email}`}
                  fontSize="sm"
                  color={result.success ? "green.600" : "red.500"}
                >
                  Linha {result.line} — {result.email}:{" "}
                  {result.success ? "Sucesso" : result.message || "Erro"}
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </FormModal>

      {/* Modal de Cadastro */}
      <FormModal
        isOpen={isOpen}
        onClose={onClose}
        title="Novo Funcionário"
        onSubmit={handleCreateEmployee}
        isLoading={isSaving}
        submitLabel="Salvar Funcionário"
      >
        <SimpleGrid columns={2} spacing={4}>
          <FormInput
            label="Nome Completo"
            isRequired
            value={formData.full_name}
            onChange={(e) =>
              setFormData({ ...formData, full_name: e.target.value })
            }
          />
          <FormInput
            label="Email"
            type="email"
            isRequired
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
          <FormInput
            label="Senha"
            type="password"
            isRequired
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
          <FormInput
            label="Departamento"
            placeholder="Ex: Marketing"
            isRequired
            value={formData.department}
            onChange={(e) =>
              setFormData({ ...formData, department: e.target.value })
            }
          />
          <FormSelect
            label="Centro de Custo"
            value={formData.cost_center_id || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                cost_center_id: e.target.value
                  ? Number(e.target.value)
                  : undefined,
              })
            }
            options={[
              { value: "", label: "Selecione..." },
              ...costCenters.map((c) => ({
                value: String(c.id),
                label: `${c.code} - ${c.name}`,
              })),
            ]}
          />
        </SimpleGrid>
      </FormModal>

      {/* Modal de Edição de Departamento e Centro de Custo */}
      <FormModal
        isOpen={editingEmployee !== null}
        onClose={handleCloseEditModal}
        title={`Editar: ${editingEmployee?.full_name}`}
        onSubmit={handleUpdateEmployee}
        isLoading={isSaving}
        submitLabel="Atualizar"
      >
        <SimpleGrid columns={2} spacing={4}>
          <FormInput
            label="Departamento"
            placeholder="Ex: Marketing"
            isRequired
            value={editFormData.department}
            onChange={(e) =>
              setEditFormData({ ...editFormData, department: e.target.value })
            }
          />
          <FormSelect
            label="Centro de Custo"
            value={editFormData.cost_center_id || ""}
            onChange={(e) =>
              setEditFormData({
                ...editFormData,
                cost_center_id: e.target.value
                  ? Number(e.target.value)
                  : undefined,
              })
            }
            options={[
              { value: "", label: "Selecione..." },
              ...costCenters.map((c) => ({
                value: String(c.id),
                label: `${c.code} - ${c.name}`,
              })),
            ]}
          />
        </SimpleGrid>
      </FormModal>
    </Box>
  );
};

export default Employees;
