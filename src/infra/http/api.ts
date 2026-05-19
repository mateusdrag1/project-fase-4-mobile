import axios from 'axios';
import { API_BASE_URL } from '../../core/constants/api';
import { StorageService } from '../storage/StorageService';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(async (config) => {
  const token = await StorageService.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (__DEV__) {
      console.error('[API Error]', {
        url: error.config?.url,
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
    }

    if (!error.response) {
      return Promise.reject(
        new Error(`Sem resposta do servidor (${error.message}). Verifique a URL da API e se o backend está rodando.`),
      );
    }

    const message =
      error.response?.data?.message ??
      error.response?.data?.error ??
      `Erro ${error.response.status}`;
    return Promise.reject(new Error(message));
  },
);
