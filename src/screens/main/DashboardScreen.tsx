import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { ScreenContainer } from '../../components/ScreenContainer';
import { StatusBadge } from '../../components/StatusBadge';
import { authService } from '../../services/authService';
import { useAuthStore } from '../../store/useAuthStore';
import type { HealthCheckPayload } from '../../types/api';

export function DashboardScreen() {
  const { user, clearSession } = useAuthStore();
  const [health, setHealth] = useState<HealthCheckPayload | null>(null);
  const [healthError, setHealthError] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    let active = true;
    authService
      .fetchHealth()
      .then(data => {
        if (active) {
          setHealth(data);
          setHealthError(false);
        }
      })
      .catch(() => {
        if (active) {
          setHealthError(true);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await authService.logout();
    } catch {
      // Clear local Sanctum session even if token already expired remotely.
    } finally {
      await clearSession();
      setLoggingOut(false);
    }
  };

  return (
    <ScreenContainer className="gap-5">
      <View className="flex-row items-center justify-between">
        <View className="flex-1 gap-1">
          <Text className="text-xs font-semibold uppercase tracking-widest text-brand-light">
            FinTwin · Gêmeo Digital
          </Text>
          <Text className="text-2xl font-bold text-slate-50">
            Olá, {user?.name ?? 'Investidor'}
          </Text>
        </View>
        <StatusBadge
          label={
            healthError
              ? 'API Offline'
              : health?.status === 'ok'
                ? 'API Online'
                : 'Verificando...'
          }
          tone={healthError ? 'danger' : health?.status === 'ok' ? 'ok' : 'neutral'}
        />
      </View>

      <Card className="gap-3">
        <Text className="text-xs font-medium uppercase tracking-wider text-slate-400">
          Simulador "E Se?" (Fase 4 / 7.2)
        </Text>
        <Text className="text-3xl font-bold text-slate-50">R$ 0,00</Text>
        <Text className="text-sm leading-5 text-slate-400">
          Conecte uma instituição via Open Finance na aba Bancos para alimentar seu
          fluxo de caixa real e desbloquear projeções com cache Redis a 60fps.
        </Text>
      </Card>

      <View className="flex-row gap-3">
        <Card className="flex-1 gap-1.5">
          <Text className="text-xs uppercase tracking-wider text-slate-400">
            Saldo Líquido
          </Text>
          <Text className="text-xl font-bold text-brand-light">R$ 0,00</Text>
        </Card>
        <Card className="flex-1 gap-1.5">
          <Text className="text-xs uppercase tracking-wider text-slate-400">
            Parcelas Mês
          </Text>
          <Text className="text-xl font-bold text-slate-100">R$ 0,00</Text>
        </Card>
      </View>

      <Card className="gap-2">
        <Text className="text-sm font-semibold text-slate-200">
          Status dos Serviços Remotos
        </Text>
        <Text className="text-xs text-slate-400">
          Backend: {health ? `${health.service} (${health.environment})` : '—'}
        </Text>
        <Text className="text-xs text-slate-400">
          MySQL: {health?.services.database ?? '—'} · Redis:{' '}
          {health?.services.cache ?? '—'}
        </Text>
      </Card>

      <Button
        title="Sair da conta"
        variant="secondary"
        onPress={handleLogout}
        loading={loggingOut}
      />
    </ScreenContainer>
  );
}
