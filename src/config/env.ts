/**
 * Central runtime environment settings for FinTwinMobile.
 *
 * Replace `googleWebClientId` with your Google Cloud OAuth 2.0 Web Client ID
 * matching `GOOGLE_CLIENT_IDS` configured in `fintwin-api/.env`.
 */
export const env = {
  apiBaseUrl: 'https://fintwin.freedevs.tech/api/v1',
  googleWebClientId: '',
  deviceName: 'fintwin-mobile',
} as const;
