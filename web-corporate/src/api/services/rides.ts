// rides.ts
import api from '../api/axios';

export const getRides = async () => {
  const response = await api.get('/rides');
  return response.data;
};

// Adicionar outras funções