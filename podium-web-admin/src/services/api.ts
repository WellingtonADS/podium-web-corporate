import axios, { InternalAxiosRequestConfig } from "axios";

// Base da API configurável via env, com fallback para localhost
const API_BASE =
  (import.meta as any).env?.VITE_API_URL ?? "http://localhost:8000";
const API_URL = `${API_BASE}/api/v1`;

const api = axios.create({
  baseURL: API_URL,
});

export interface User {
  id: number;
  email: string;
  full_name: string;
  role: "admin" | "driver" | "employee";
  is_active: boolean;
  driver_profile?: {
    vehicle_model: string;
    vehicle_plate: string;
    cnh_number: string;
    current_lat?: number;
    current_lng?: number;
  };
}

export interface DashboardStats {
  drivers_online: number;
  rides_today: number;
  revenue_today: number;
  average_ticket: number;
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

// Interceptor tipado
api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem("@Podium:token");

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
