import axios, { InternalAxiosRequestConfig } from "axios";

// Base da API configurável via env, com fallback para localhost
// Tipagem explícita para evitar any e problemas com ImportMeta
type ImportMetaWithEnv = ImportMeta & { env: { VITE_API_URL?: string } };
const API_BASE =
  (import.meta as ImportMetaWithEnv).env?.VITE_API_URL ??
  "http://localhost:8000";
const API_URL = `${API_BASE}/api/v1`;

// Variável para injetar LoadingContext (evita circular dependency)
let loadingContext: {
  startLoading: () => void;
  stopLoading: () => void;
} | null = null;

// Helper to fetch employees (used by corporate hooks)
export const fetchEmployees = async (): Promise<User[]> => {
  const response = await api.get<User[]>("/users", {
    params: { role: "employee" },
  });
  return response.data;
};

export const setLoadingContext = (context: {
  startLoading: () => void;
  stopLoading: () => void;
}) => {
  loadingContext = context;
};

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000, // 30 segundos
});

export interface User {
  id: number;
  email: string;
  full_name: string;
  role: "admin" | "driver" | "employee";
  is_active: boolean;
  company_id: number;
  cost_center_id?: number;
  driver_profile?: {
    vehicle_model: string;
    vehicle_plate: string;
    cnh_number: string;
    current_lat?: number;
    current_lng?: number;
  };
  employee_profile?: {
    department: string;
    cost_center_id?: number;
  };
}

export interface DashboardStats {
  drivers_online: number;
  rides_today: number;
  revenue_today: number;
  average_ticket: number;
}

export interface CorporateDashboardStats {
  total_employees: number;
  active_employees: number;
  rides_completed: number;
  total_spent: number;
  remaining_budget: number;
}

export interface CostCenterUsage {
  cost_center_id: number;
  name: string;
  spent: number;
  percentage: number;
}

export interface RecentRide {
  employee_name: string;
  department: string;
  cost_center_name: string;
  price: number;
}

export interface CreateDriverData {
  email: string;
  password: string;
  full_name: string;
  role: "driver";
  vehicle_model: string;
  vehicle_plate: string;
  cnh_number: string;
}

export interface CreateEmployeeData {
  email: string;
  password: string;
  full_name: string;
  role: "employee";
  department: string;
  cost_center_id?: number;
}

export interface CostCenter {
  id: string;
  name: string;
  code: string;
  budget_limit: number;
  current_spent: number;
  active: boolean;
  company_id?: number;
  allowed_categories: string[];
  spending_limit_per_ride: number;
  business_hours?: {
    start: string; // HH:mm
    end: string; // HH:mm
  };
}

export interface CreateCostCenterData {
  name: string;
  code: string;
  budget_limit: number;
  active?: boolean;
  allowed_categories: string[];
  spending_limit_per_ride: number;
  business_hours?: {
    start: string;
    end: string;
  };
}

export interface RideRecord {
  id: number;
  employee_id: number;
  employee_name: string;
  cost_center_id: number;
  cost_center_name: string;
  ride_date: string; // ISO datetime
  distance_km: number;
  amount: number; // BRL
  category: string;
  policy_compliant: boolean;
  violation_reason?: string;
}

export interface BillingPeriod {
  period: string; // "2025-12"
  rides_count: number;
  total_amount: number;
  status: "pending" | "paid" | "disputed";
  rides: RideRecord[];
}

// ===== BOOKING TYPES =====
export interface Booking {
  id: number;
  status: string;
  origin_address: string;
  dest_address: string;
  passenger_id: number;
  cost_center_id: number;
  created_at: string;
  updated_at: string;
  notes?: string;
}

export interface CreateBookingData {
  origin_address: string;
  origin_lat: number;
  origin_lng: number;
  dest_address: string;
  dest_lat: number;
  dest_lng: number;
  passenger_id: number;
  cost_center_id?: number | null;
  scheduled_at?: string;
  notes?: string;
}

export const createBooking = async (
  data: CreateBookingData
): Promise<Booking> => {
  const response = await api.post<Booking>("/bookings", data);
  return response.data;
};

export const fetchBookings = async (): Promise<Booking[]> => {
  const response = await api.get<{ bookings: Booking[] }>("/bookings");
  return response.data.bookings;
};

// Interceptor tipado
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    loadingContext?.startLoading();

    const token = localStorage.getItem("@Podium:token");

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    loadingContext?.stopLoading();
    return Promise.reject(error);
  }
);

// Interceptor de resposta para tratamento de erro centralizado
api.interceptors.response.use(
  (response) => {
    loadingContext?.stopLoading();
    return response;
  },
  (error: unknown) => {
    loadingContext?.stopLoading();

    type AxiosLikeError = {
      response?: { status?: number; data?: { detail?: string } };
      message?: string;
    };
    const axiosError = error as AxiosLikeError;
    const status = axiosError?.response?.status;

    // 401/403: não autenticado ou sem permissão
    if (status === 401 || status === 403) {
      localStorage.removeItem("@Podium:token");
      localStorage.removeItem("@Podium:user");
      window.location.href = "/login";
    }

    // Extrair mensagem de erro do backend
    const detail =
      (axiosError?.response?.data as { detail?: string })?.detail ||
      (axiosError?.message as string) ||
      "Erro ao conectar com servidor";

    // Return a serializable error object to avoid worker serialization issues
    return Promise.reject({
      status,
      message: detail,
    });
  }
);

export const fetchCurrentUser = async (): Promise<User> => {
  const response = await api.get<User>("/users/me");
  return response.data;
};

// ========== BILLING ENDPOINTS ==========

export interface BillingFiltersPayload {
  period?: string; // "2025-12"
  employee_id?: number;
  cost_center_id?: number;
}

export const fetchBillingRecords = async (
  filters?: BillingFiltersPayload
): Promise<BillingPeriod[]> => {
  try {
    const response = await api.get<BillingPeriod[]>(
      "/stats/corporate/billing",
      {
        params: filters,
      }
    );
    return response.data;
  } catch (error: unknown) {
    console.error("Erro ao buscar registros de faturamento:", error);
    throw error;
  }
};

// ========== EMPLOYEE ENDPOINTS ==========

export const createEmployee = async (
  data: CreateEmployeeData
): Promise<User> => {
  try {
    const response = await api.post<User>("/corporate/employees", data);
    return response.data;
  } catch (error: unknown) {
    console.error("Erro ao criar funcionário:", error);
    throw error;
  }
};

// ========== COST CENTER ENDPOINTS ==========

export const fetchCostCenters = async (): Promise<CostCenter[]> => {
  try {
    const response = await api.get<CostCenter[]>("/corporate/cost-centers");
    return response.data;
  } catch (error: unknown) {
    console.error("Erro ao buscar centros de custo:", error);
    throw error;
  }
};

export const createCostCenter = async (
  data: CreateCostCenterData
): Promise<CostCenter> => {
  try {
    const response = await api.post<CostCenter>(
      "/corporate/cost-centers",
      data
    );
    return response.data;
  } catch (error: unknown) {
    console.error("Erro ao criar centro de custo:", error);
    throw error;
  }
};

export const updateCostCenter = async (
  id: string,
  data: Partial<CreateCostCenterData>
): Promise<CostCenter> => {
  try {
    const response = await api.patch<CostCenter>(
      `/corporate/cost-centers/${id}`,
      data
    );
    return response.data;
  } catch (error: unknown) {
    console.error("Erro ao atualizar centro de custo:", error);
    throw error;
  }
};

export default api;
