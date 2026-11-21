import './global.css';
import { DarkTheme, NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from './src/navigation/RootNavigator';

const FinTwinDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: '#10B981',
    background: '#090D16',
    card: '#111827',
    text: '#F8FAFC',
    border: '#1E293B',
    notification: '#10B981',
  },
};

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer theme={FinTwinDarkTheme}>
        <RootNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
