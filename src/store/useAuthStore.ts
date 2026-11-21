import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import type { AuthUser } from '../types/api';

const AUTH_STORAGE_KEY = '@fintwin/auth';

interface PersistedAuthState {
  token: string;
  user: AuthUser;
}

export interface AuthState {
  token: string | null;
  user: AuthUser | null;
  isHydrated: boolean;
  isSubmitting: boolean;
  error: string | null;
  hydrate: () => Promise<void>;
  setSession: (token: string, user: AuthUser) => Promise<void>;
  clearSession: () => Promise<void>;
  setError: (message: string | null) => void;
  setSubmitting: (flag: boolean) => void;
}

export const useAuthStore = create<AuthState>(set => ({
  token: null,
  user: null,
  isHydrated: false,
  isSubmitting: false,
  error: null,

  hydrate: async () => {
    try {
      const raw = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<PersistedAuthState>;
        if (typeof parsed.token === 'string' && parsed.token !== '' && parsed.user) {
          set({
            token: parsed.token,
            user: parsed.user,
            isHydrated: true,
          });
          return;
        }
      }
    } catch {
      await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
    }

    set({ token: null, user: null, isHydrated: true });
  },

  setSession: async (token: string, user: AuthUser) => {
    const payload: PersistedAuthState = { token, user };
    await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(payload));
    set({ token, user, error: null });
  },

  clearSession: async () => {
    await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
    set({ token: null, user: null, error: null });
  },

  setError: (message: string | null) => set({ error: message }),

  setSubmitting: (flag: boolean) => set({ isSubmitting: flag }),
}));
