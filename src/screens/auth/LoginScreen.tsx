import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Input } from '../../components/Input';
import { ScreenContainer } from '../../components/ScreenContainer';
import type { AuthStackParamList } from '../../navigation/RootNavigator';
import { extractApiErrorMessage } from '../../services/api';
import { authService } from '../../services/authService';
import { requestGoogleIdToken } from '../../services/googleSignIn';
import { useAuthStore } from '../../store/useAuthStore';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export function LoginScreen({ navigation }: Props) {
  const { setSession, error, setError } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);

  const handleEmailLogin = async () => {
    setError(null);
    setLoadingEmail(true);
    try {
      const payload = await authService.login({ email: email.trim(), password });
      await setSession(payload.token, payload.user);
    } catch (err) {
      setError(extractApiErrorMessage(err));
    } finally {
      setLoadingEmail(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setLoadingGoogle(true);
    try {
      const idToken = await requestGoogleIdToken();
      const payload = await authService.loginWithGoogle(idToken);
      await setSession(payload.token, payload.user);
    } catch (err) {
      setError(extractApiErrorMessage(err));
    } finally {
      setLoadingGoogle(false);
    }
  };

  return (
    <ScreenContainer className="justify-center">
      <View className="mb-8 gap-2">
        <Text className="text-xs font-semibold uppercase tracking-widest text-brand-light">
          Gêmeo Digital Financeiro
        </Text>
        <Text className="text-3xl font-bold text-slate-50">FinTwin</Text>
        <Text className="text-sm text-slate-400">
          Simule compras, antecipe parcelas e tome decisões com dados reais.
        </Text>
      </View>

      <Card className="gap-4">
        <Input
          label="E-mail"
          placeholder="voce@exemplo.com"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <Input
          label="Senha"
          placeholder="••••••••"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {error ? (
          <View className="rounded-xl border border-red-500/30 bg-red-500/10 p-3">
            <Text className="text-sm text-red-300">{error}</Text>
          </View>
        ) : null}

        <Button
          title="Entrar"
          onPress={handleEmailLogin}
          loading={loadingEmail}
          disabled={loadingGoogle}
        />

        <View className="my-1 flex-row items-center gap-3">
          <View className="h-px flex-1 bg-surface-border" />
          <Text className="text-xs uppercase text-slate-500">ou</Text>
          <View className="h-px flex-1 bg-surface-border" />
        </View>

        <Button
          title="Entrar com Google"
          variant="google"
          onPress={handleGoogleLogin}
          loading={loadingGoogle}
          disabled={loadingEmail}
        />
      </Card>

      <View className="mt-6">
        <Button
          title="Criar uma conta com e-mail"
          variant="ghost"
          onPress={() => {
            setError(null);
            navigation.navigate('Register');
          }}
        />
      </View>
    </ScreenContainer>
  );
}
