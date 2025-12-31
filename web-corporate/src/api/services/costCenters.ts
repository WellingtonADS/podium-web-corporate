// costCenters.ts
import api from '../api/axios';

export const getCostCenters = async () => {
  const response = await api.get('/cost-centers');
  return response.data;
};

// Adicionar outras funções