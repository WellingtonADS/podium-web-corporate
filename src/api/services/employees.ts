// employees.ts
import api from '../api/axios';

export const getEmployees = async () => {
  const response = await api.get('/employees');
  return response.data;
};

export const createEmployee = async (data: any) => {
  const response = await api.post('/employees', data);
  return response.data;
};

// Adicionar outras funções conforme necessário