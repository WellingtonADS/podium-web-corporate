/**
 * 🌉 Corporate Service Layer
 * Abstrair todas as chamadas à API para manter componentes limpos
 */

import {
    CorporateDashboardStats,
    CostCenter,
    CreateCostCenterInput,
    CreateEmployeeInput,
    User,
} from "../types";
import api from "./api";

export const CorporateService = {
  // ===== COST CENTERS =====
  
  getCostCenters: async (): Promise<CostCenter[]> => {
    const { data } = await api.get<CostCenter[]>("/corporate/cost-centers");
    return data;
  },

  getCostCenter: async (id: number): Promise<CostCenter> => {
    const { data } = await api.get<CostCenter>(`/corporate/cost-centers/${id}`);
    return data;
  },

  createCostCenter: async (payload: CreateCostCenterInput): Promise<CostCenter> => {
    const { data } = await api.post<CostCenter>(
      "/corporate/cost-centers",
      payload
    );
    return data;
  },

  updateCostCenter: async (id: number, payload: Partial<CreateCostCenterInput>): Promise<CostCenter> => {
    const { data } = await api.put<CostCenter>(
      `/corporate/cost-centers/${id}`,
      payload
    );
    return data;
  },

  deleteCostCenter: async (id: number): Promise<void> => {
    await api.delete(`/corporate/cost-centers/${id}`);
  },

  // ===== EMPLOYEES =====

  getEmployees: async (): Promise<User[]> => {
    // Backend filtra por company_id automaticamente via token
    const { data } = await api.get<User[]>("/users", {
      params: { role: "employee" },
    });
    return data;
  },

  getEmployee: async (id: number): Promise<User> => {
    const { data } = await api.get<User>(`/users/${id}`);
    return data;
  },

  createEmployee: async (payload: CreateEmployeeInput & { company_id: number; cost_center_id?: number }): Promise<User> => {
    const { data } = await api.post<User>(
      "/corporate/employees",
      payload
    );
    return data;
  },

  updateEmployee: async (id: number, payload: Partial<User>): Promise<User> => {
    const { data } = await api.put<User>(`/users/${id}`, payload);
    return data;
  },

  deleteEmployee: async (id: number): Promise<void> => {
    await api.delete(`/users/${id}`);
  },

  // ===== DASHBOARD & STATS =====

  getCorporateDashboard: async (): Promise<CorporateDashboardStats> => {
    const { data } = await api.get<CorporateDashboardStats>(
      "/stats/corporate/dashboard"
    );
    return data;
  },

  // ===== CURRENT USER =====

  getCurrentUser: async (): Promise<User> => {
    const { data } = await api.get<User>("/users/me");
    return data;
  },
};
