export interface ApiEnvelope<T> {
  data: T;
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  avatar_url: string | null;
  has_google_linked: boolean;
}

export interface AuthTokenPayload {
  token: string;
  token_type: 'Bearer';
  is_new_user: boolean;
  user: AuthUser;
}

export interface HealthCheckPayload {
  status: 'ok' | 'degraded';
  service: string;
  environment: string;
  services: {
    database: string;
    cache: string;
  };
  timestamp: string;
}

export interface PluggyConnectTokenPayload {
  access_token: string;
}

export interface OpenFinanceSyncPayload {
  status: string;
  pluggy_item_id: string;
  queues: string[];
  requested_at: string;
}
