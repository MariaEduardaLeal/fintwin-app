import type { InternalAxiosRequestConfig } from 'axios';
import { apiClient, extractApiErrorMessage } from '../src/services/api';
import { useAuthStore } from '../src/store/useAuthStore';

describe('apiClient Sanctum interceptors', () => {
  beforeEach(async () => {
    await useAuthStore.getState().clearSession();
  });

  it('injects Authorization Bearer header when Sanctum token exists', async () => {
    await useAuthStore.getState().setSession('sanctum-token-123', {
      id: 1,
      name: 'Duda',
      email: 'duda@fintwin.test',
      avatar_url: null,
      has_google_linked: false,
    });

    const handlers = (
      apiClient.interceptors.request as unknown as {
        handlers: Array<{
          fulfilled: (
            config: InternalAxiosRequestConfig,
          ) => InternalAxiosRequestConfig;
        }>;
      }
    ).handlers;

    const config = handlers[0].fulfilled({
      headers: {},
    } as InternalAxiosRequestConfig);

    expect(config.headers.Authorization).toBe('Bearer sanctum-token-123');
  });

  it('omits Authorization header when unauthenticated', () => {
    const handlers = (
      apiClient.interceptors.request as unknown as {
        handlers: Array<{
          fulfilled: (
            config: InternalAxiosRequestConfig,
          ) => InternalAxiosRequestConfig;
        }>;
      }
    ).handlers;

    const config = handlers[0].fulfilled({
      headers: {},
    } as InternalAxiosRequestConfig);

    expect(config.headers.Authorization).toBeUndefined();
  });

  it('clears Zustand session on 401 for protected endpoints', async () => {
    await useAuthStore.getState().setSession('expired-token', {
      id: 1,
      name: 'Duda',
      email: 'duda@fintwin.test',
      avatar_url: null,
      has_google_linked: false,
    });

    const handlers = (
      apiClient.interceptors.response as unknown as {
        handlers: Array<{
          rejected: (error: unknown) => Promise<never>;
        }>;
      }
    ).handlers;

    await expect(
      handlers[0].rejected({
        response: { status: 401 },
        config: { url: '/me' },
      }),
    ).rejects.toBeDefined();

    expect(useAuthStore.getState().token).toBeNull();
    expect(useAuthStore.getState().user).toBeNull();
  });

  it('keeps error message extraction friendly for errors', () => {
    expect(extractApiErrorMessage(new Error('Falha controlada'))).toBe(
      'Falha controlada',
    );
  });
});
