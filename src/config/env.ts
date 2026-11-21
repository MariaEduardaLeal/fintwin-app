/**
 * Central runtime environment settings for FinTwinMobile.
 *
 * Replace `googleWebClientId` with your Google Cloud OAuth 2.0 Web Client ID
 * matching `GOOGLE_CLIENT_IDS` configured in `fintwin-api/.env`.
 */
export const env = {
  apiBaseUrl: 'https://fintwin.freedevs.tech/api/v1',
  googleWebClientId:
    '177065050613-qi3c5kktp0n6ha9pmukpqllnbcmuo9hu.apps.googleusercontent.com',
  deviceName: 'fintwin-mobile',
} as const;
