import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthStore } from '../src/store/useAuthStore';

describe('useAuthStore', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    useAuthStore.setState({
      token: null,
      user: null,
      isHydrated: false,
      isSubmitting: false,
      error: null,
    });
  });

  it('persists session and hydrates it back from AsyncStorage', async () => {
    const user = {
      id: 7,
      name: 'Maria Eduarda',
      email: 'duda@fintwin.test',
      avatar_url: 'https://example.com/a.png',
      has_google_linked: true,
    };

    await useAuthStore.getState().setSession('fintwin_tok_777', user);

    useAuthStore.setState({ token: null, user: null, isHydrated: false });
    await useAuthStore.getState().hydrate();

    expect(useAuthStore.getState().isHydrated).toBe(true);
    expect(useAuthStore.getState().token).toBe('fintwin_tok_777');
    expect(useAuthStore.getState().user).toEqual(user);
  });

  it('clears persisted session on clearSession', async () => {
    await useAuthStore.getState().setSession('tok', {
      id: 1,
      name: 'Duda',
      email: 'duda@fintwin.test',
      avatar_url: null,
      has_google_linked: false,
    });

    await useAuthStore.getState().clearSession();

    expect(useAuthStore.getState().token).toBeNull();
    expect(await AsyncStorage.getItem('@fintwin/auth')).toBeNull();
  });
});
