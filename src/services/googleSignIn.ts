import {
  GoogleSignin,
  isCancelledResponse,
  isSuccessResponse,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { env } from '../config/env';

let isConfigured = false;

export function configureGoogleSignIn(): boolean {
  if (!env.googleWebClientId) {
    return false;
  }

  if (!isConfigured) {
    GoogleSignin.configure({
      webClientId: env.googleWebClientId,
      offlineAccess: false,
    });
    isConfigured = true;
  }

  return true;
}

export async function requestGoogleIdToken(): Promise<string> {
  if (!configureGoogleSignIn()) {
    throw new Error(
      'Configure env.googleWebClientId em src/config/env.ts com o Client ID Web do Google Cloud para ativar o login com Google.',
    );
  }

  try {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    const response = await GoogleSignin.signIn();

    if (isCancelledResponse(response)) {
      throw new Error('Login com Google cancelado pelo usuário.');
    }

    if (!isSuccessResponse(response) || !response.data.idToken) {
      throw new Error('Não foi possível obter o idToken da conta Google.');
    }

    return response.data.idToken;
  } catch (error) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE
    ) {
      throw new Error('Google Play Services indisponível neste dispositivo.');
    }
    throw error;
  }
}
