import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { env } from '../config/env';
import { useAuthStore } from '../store/useAuthStore';

interface LaravelErrorBody {
  message?: string;
  errors?: Record<string, string[]>;
}

const PUBLIC_AUTH_PATHS = ['/auth/login', '/auth/register', '/auth/google'];

export const apiClient = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 15000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    const status = error.response?.status;
    const requestUrl = error.config?.url ?? '';
    const isPublicAuthRequest = PUBLIC_AUTH_PATHS.some(path =>
      requestUrl.includes(path),
    );

    if (status === 401 && !isPublicAuthRequest) {
      await useAuthStore.getState().clearSession();
    }

    return Promise.reject(error);
  },
);

export function extractApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError<LaravelErrorBody>(error)) {
    const data = error.response?.data;
    if (data?.errors) {
      const firstFieldErrors = Object.values(data.errors).find(
        list => Array.isArray(list) && list.length > 0,
      );
      if (firstFieldErrors?.[0]) {
        return firstFieldErrors[0];
      }
    }

    if (typeof data?.message === 'string' && data.message.trim() !== '') {
      return data.message;
    }

    if (error.code === 'ECONNABORTED') {
      return 'Tempo limite excedido ao conectar com o servidor.';
    }

    return 'Não foi possível conectar com a API do FinTwin.';
  }

  if (error instanceof Error && error.message.trim() !== '') {
    return error.message;
  }

  return 'Ocorreu um erro inesperado.';
}
