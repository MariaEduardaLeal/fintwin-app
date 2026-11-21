import { env } from '../config/env';
import type {
  ApiEnvelope,
  AuthTokenPayload,
  AuthUser,
  HealthCheckPayload,
} from '../types/api';
import { apiClient } from './api';

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  device_name?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
  device_name?: string;
}

export const authService = {
  async register(payload: RegisterPayload): Promise<AuthTokenPayload> {
    const { data } = await apiClient.post<ApiEnvelope<AuthTokenPayload>>(
      '/auth/register',
      {
        ...payload,
        device_name: payload.device_name ?? env.deviceName,
      },
    );
    return data.data;
  },

  async login(payload: LoginPayload): Promise<AuthTokenPayload> {
    const { data } = await apiClient.post<ApiEnvelope<AuthTokenPayload>>(
      '/auth/login',
      {
        ...payload,
        device_name: payload.device_name ?? env.deviceName,
      },
    );
    return data.data;
  },

  async loginWithGoogle(
    idToken: string,
    deviceName: string = env.deviceName,
  ): Promise<AuthTokenPayload> {
    const { data } = await apiClient.post<ApiEnvelope<AuthTokenPayload>>(
      '/auth/google',
      {
        id_token: idToken,
        device_name: deviceName,
      },
    );
    return data.data;
  },

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout');
  },

  async fetchMe(): Promise<AuthUser> {
    const { data } = await apiClient.get<ApiEnvelope<AuthUser>>('/me');
    return data.data;
  },

  async fetchHealth(): Promise<HealthCheckPayload> {
    const { data } = await apiClient.get<ApiEnvelope<HealthCheckPayload>>(
      '/health',
    );
    return data.data;
  },
};
