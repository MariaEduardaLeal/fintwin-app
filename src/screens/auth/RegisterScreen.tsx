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
import { useAuthStore } from '../../store/useAuthStore';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

export function RegisterScreen({ navigation }: Props) {
  const { setSession, error, setError } = useAuthStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setError(null);
    setLoading(true);
    try {
      const payload = await authService.register({
        name: name.trim(),
        email: email.trim(),
        password,
        password_confirmation: passwordConfirmation,
      });
      await setSession(payload.token, payload.user);
    } catch (err) {
      setError(extractApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer className="justify-center">
      <View className="mb-8 gap-2">
        <Text className="text-3xl font-bold text-slate-50">Criar Conta</Text>
        <Text className="text-sm text-slate-400">
          Seu perfil financeiro padrão já é criado automaticamente.
        </Text>
      </View>

      <Card className="gap-4">
        <Input
          label="Nome"
          placeholder="Maria Eduarda"
          value={name}
          onChangeText={setName}
        />

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
          placeholder="Mínimo 8 caracteres"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Input
          label="Confirmar Senha"
          placeholder="Repita sua senha"
          secureTextEntry
          value={passwordConfirmation}
          onChangeText={setPasswordConfirmation}
        />

        {error ? (
          <View className="rounded-xl border border-red-500/30 bg-red-500/10 p-3">
            <Text className="text-sm text-red-300">{error}</Text>
          </View>
        ) : null}

        <Button title="Cadastrar" onPress={handleRegister} loading={loading} />
      </Card>

      <View className="mt-6">
        <Button
          title="Já tenho conta — Entrar"
          variant="ghost"
          onPress={() => {
            setError(null);
            navigation.goBack();
          }}
        />
      </View>
    </ScreenContainer>
  );
}
