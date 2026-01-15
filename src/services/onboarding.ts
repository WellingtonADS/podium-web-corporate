import { CreateEmployeeData, createEmployee } from "./api";

export interface ParsedEmployeeRow {
  line: number;
  full_name: string;
  email: string;
  department?: string;
  cost_center_id: number;
}

export interface ParseError {
  line: number;
  message: string;
  raw?: string;
}

export interface ImportResult {
  line: number;
  email: string;
  success: boolean;
  message?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const detectDelimiter = (headerLine: string): string => {
  if (headerLine.includes(";")) return ";";
  return ",";
};

const normalizeHeader = (value: string) => value.trim().toLowerCase();

const headerMap: Record<
  string,
  "full_name" | "email" | "cost_center_id" | "department"
> = {
  name: "full_name",
  nome: "full_name",
  fullname: "full_name",
  "full name": "full_name",
  email: "email",
  "e-mail": "email",
  mail: "email",
  cost_center: "cost_center_id",
  costcenter: "cost_center_id",
  cost_center_id: "cost_center_id",
  "centro de custo": "cost_center_id",
  cc: "cost_center_id",
  department: "department",
  departamento: "department",
};

const toNumber = (value: string): number | undefined => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

export const parseEmployeesCsv = async (
  file: File
): Promise<{ rows: ParsedEmployeeRow[]; errors: ParseError[] }> => {
  const text = await file.text();
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);

  if (lines.length === 0) {
    return { rows: [], errors: [{ line: 1, message: "Arquivo CSV vazio." }] };
  }

  const delimiter = detectDelimiter(lines[0]);
  const headers = lines[0].split(delimiter).map(normalizeHeader);

  const requiredFields: ("full_name" | "email" | "cost_center_id")[] = [
    "full_name",
    "email",
    "cost_center_id",
  ];
  const mappedHeaders = headers.map((h) => headerMap[h]);
  const missingRequired = requiredFields.filter(
    (field) => !mappedHeaders.includes(field)
  );

  if (missingRequired.length > 0) {
    return {
      rows: [],
      errors: [
        {
          line: 1,
          message: `Colunas obrigatórias ausentes: ${missingRequired.join(", ")}.`,
        },
      ],
    };
  }

  const rows: ParsedEmployeeRow[] = [];
  const errors: ParseError[] = [];

  for (let i = 1; i < lines.length; i++) {
    const raw = lines[i];
    if (!raw.trim()) continue;

    const columns = raw.split(delimiter);
    const record: Partial<ParsedEmployeeRow> = { line: i + 1 };

    headers.forEach((header, idx) => {
      const mapped = headerMap[header];
      if (!mapped) return;
      const value = (columns[idx] ?? "").trim();
      if (mapped === "cost_center_id") {
        record.cost_center_id = toNumber(value) ?? 0;
      } else if (mapped === "full_name") {
        record.full_name = value;
      } else if (mapped === "email") {
        record.email = value.toLowerCase();
      } else if (mapped === "department") {
        record.department = value;
      }
    });

    if (!record.full_name || record.full_name.length === 0) {
      errors.push({ line: i + 1, message: "Nome é obrigatório", raw });
      continue;
    }

    if (!record.email || !EMAIL_REGEX.test(record.email)) {
      errors.push({ line: i + 1, message: "Email inválido", raw });
      continue;
    }

    if (!record.cost_center_id || record.cost_center_id <= 0) {
      errors.push({ line: i + 1, message: "Centro de custo inválido", raw });
      continue;
    }

    rows.push(record as ParsedEmployeeRow);
  }

  return { rows, errors };
};

const buildPassword = () => `Podium#${Math.random().toString(36).slice(-8)}`;

import api from "./api";

export const importEmployeesSequential = async (
  rows: ParsedEmployeeRow[],
  onProgress?: (completed: number, total: number) => void
): Promise<ImportResult[]> => {
  const total = rows.length;
  const results: ImportResult[] = [];

  for (let idx = 0; idx < rows.length; idx++) {
    const row = rows[idx];
    try {
      const payload: CreateEmployeeData = {
        full_name: row.full_name,
        email: row.email,
        role: "employee",
        department: row.department ?? "",
        cost_center_id: row.cost_center_id,
        password: buildPassword(),
      };

      await createEmployee(payload);

      results.push({ line: row.line, email: row.email, success: true });
    } catch (error: unknown) {
      const errorObj = error as Record<string, unknown>;
      const message = (errorObj?.message as string) || "Falha ao importar";
      results.push({
        line: row.line,
        email: row.email,
        success: false,
        message,
      });
    } finally {
      onProgress?.(idx + 1, total);
    }
  }

  return results;
};

// New: batch import using backend `/users/batch` endpoint
export const importEmployeesBatch = async (
  rows: ParsedEmployeeRow[],
  onProgress?: (completed: number, total: number) => void
): Promise<ImportResult[]> => {
  if (!rows.length) return [];
  const total = rows.length;

  // Build payload and keep map of email -> original line for mapping results
  const payload = rows.map((row) => ({
    email: row.email,
    full_name: row.full_name,
    password: buildPassword(),
    role: "employee",
    department: row.department ?? "",
    cost_center_id: row.cost_center_id,
  }));

  const lineMap = new Map<string, number>();
  rows.forEach((r) => lineMap.set(r.email, r.line));

  const response = await api.post<{
    summary: {
      created: number;
      conflicts: number;
      errors: number;
      total: number;
    };
    results: Array<{ email: string; status: string; message?: string }>;
  }>("/users/batch", payload, {
    onUploadProgress: (ev) => {
      if (ev.total) {
        const completed = Math.round((ev.loaded / ev.total) * total);
        onProgress?.(completed, total);
      }
    },
  });

  const batchResults = response.data.results || [];

  const results: ImportResult[] = batchResults.map((r, idx) => {
    const line = lineMap.get(r.email) ?? idx + 1;
    const success = r.status === "created";
    const message = r.status === "conflict" ? "Registro já existe" : r.message;
    return { line, email: r.email, success, message } as ImportResult;
  });

  onProgress?.(total, total);
  return results;
};
