import axios, { AxiosError } from 'axios';
import * as SecureStore from 'expo-secure-store';

// Ajuste aqui o IP/local conforme seu ambiente:
// - Android emulador: http://10.0.2.2:8000/api/v1
// - Dispositivo físico/IOS simulador: http://SEU_IPV4:8000/api/v1
// Use `ipconfig` no Windows e pegue o IPv4 da interface ativa.
const BASE_URL = 'http://192.168.15.18:8000/api/v1';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

// Interceptor de Request: injeta Authorization se existir token
api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync('podium_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('[API REQUEST] Token encontrado e injetado');
    } else {
      console.log('[API REQUEST] Nenhum token encontrado');
    }
    return config;
  },
  (error) => {
    console.warn('[API REQUEST ERROR]', error);
    return Promise.reject(error);
  }
);

// Interceptor de Response: logs detalhados de erro
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      // Erro HTTP vindo do servidor
      const { status, data, headers } = error.response;
      console.warn('[API HTTP ERROR]', {
        url: error.config?.url,
        method: error.config?.method,
        status,
        data,
        headers,
      });
    } else if (error.request) {
      // Sem resposta: rede/timeout/DNS/firewall
      console.warn('[API NETWORK/REQUEST ERROR]', {
        url: error.config?.url,
        method: error.config?.method,
        message: error.message,
      });
    } else {
      // Erro ao configurar requisição
      console.warn('[API SETUP ERROR]', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;