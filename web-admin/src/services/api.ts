import axios, { InternalAxiosRequestConfig } from 'axios';

// ATENÇÃO: Use o mesmo IP que você configurou no Mobile e no CORS do Backend
const API_URL = 'http://192.168.15.18:8000/api/v1'; 

const api = axios.create({
  baseURL: API_URL,
});

export interface User {
  id: number;
  email: string;
  full_name: string;
  role: 'admin' | 'driver' | 'employee';
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
  role: 'driver'; 
  vehicle_model: string;
  vehicle_plate: string;
  cnh_number: string;
}

// Interceptor tipado
api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('@Podium:token');
  
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

export default api;
