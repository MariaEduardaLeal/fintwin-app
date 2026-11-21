import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import App from '../App';

describe('App', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('renders login screen after hydrating unauthenticated state', async () => {
    let tree: ReactTestRenderer.ReactTestRenderer | undefined;

    await ReactTestRenderer.act(async () => {
      tree = ReactTestRenderer.create(<App />);
    });

    const json = JSON.stringify(tree?.toJSON());
    expect(json).toContain('FinTwin');
    expect(json).toContain('Entrar com Google');
  });
});
