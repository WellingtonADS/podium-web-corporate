/**
 * 📦 Single Source of Truth para Tipagem
 * Espelhando os Schemas Pydantic do Backend
 */

// ===== USER & AUTHENTICATION =====

export interface User {
  id: number;
  email: string;
  full_name: string;
  role: "admin" | "driver" | "employee";
  is_active: boolean;
  created_at?: string;
  driver_profile?: DriverProfile;
  employee_profile?: EmployeeProfile;
}

export interface DriverProfile {
  id: number;
  user_id: number;
  vehicle_model: string;
  vehicle_plate: string;
  cnh_number: string;
  rating: number;
  current_lat?: number;
  current_lng?: number;
  last_location_at?: string;
}

export interface EmployeeProfile {
  id: number;
  user_id: number;
  company_id: number;
  cost_center_id?: number;
  department?: string;
  phone?: string;
}

// ===== COST CENTER =====

export interface CostCenter {
  id: number;
  name: string;
  code: string;
  budget_limit: number;
  is_active: boolean;
  company_id: number;
  current_spent?: number; // Calculado no frontend
}

export interface CreateCostCenterInput {
  name: string;
  code: string;
  budget_limit: number;
  is_active?: boolean;
}

// ===== EMPLOYEE & CREATION =====

export interface CreateEmployeeInput {
  email: string;
  full_name: string;
  password: string;
  cost_center_id?: number;
  department?: string;
  phone?: string;
}

// ===== COMPANY =====

export interface Company {
  id: number;
  name: string;
  cnpj: string;
  contract_status: "active" | "suspended";
  created_at?: string;
}

// ===== LOGIN =====

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

// ===== STATS & DASHBOARD =====

export interface CorporateDashboardStats {
  monthly_consumption: number;
  active_employees: number;
  rides_completed: number;
  remaining_budget: number;
  budget_percentage?: number;
}

export interface CostCenterStats {
  cost_center_id: number;
  total_rides: number;
  total_spent: number;
  average_ride_value: number;
}

// ===== API RESPONSE TYPES =====

export interface ApiError {
  detail: string;
  status?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
}
