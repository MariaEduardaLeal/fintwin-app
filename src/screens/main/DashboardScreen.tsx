import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ChevronRight } from 'lucide-react-native';
import React, { useCallback, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { ScreenContainer } from '../../components/ScreenContainer';
import { StatusBadge } from '../../components/StatusBadge';
import type { MainStackParamList } from '../../navigation/RootNavigator';
import { extractApiErrorMessage } from '../../services/api';
import { authService } from '../../services/authService';
import { openFinanceService } from '../../services/openFinanceService';
import { useAuthStore } from '../../store/useAuthStore';
import type { DashboardSummaryPayload, HealthCheckPayload } from '../../types/api';
import { formatBrl } from '../../utils/currency';

export function DashboardScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const { user, clearSession } = useAuthStore();
  const [health, setHealth] = useState<HealthCheckPayload | null>(null);
  const [healthError, setHealthError] = useState(false);
  const [summary, setSummary] = useState<DashboardSummaryPayload | null>(null);
  const [summaryError, setSummaryError] = useState<string | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const loadDashboard = useCallback(async () => {
    setLoadingSummary(true);
    setSummaryError(null);

    const [healthResult, summaryResult] = await Promise.allSettled([
      authService.fetchHealth(),
      openFinanceService.fetchDashboardSummary(),
    ]);

    if (healthResult.status === 'fulfilled') {
      setHealth(healthResult.value);
      setHealthError(false);
    } else {
      setHealthError(true);
    }

    if (summaryResult.status === 'fulfilled') {
      setSummary(summaryResult.value);
    } else {
      setSummaryError(extractApiErrorMessage(summaryResult.reason));
    }

    setLoadingSummary(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadDashboard();
    }, [loadDashboard]),
  );

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

  const accountsCount = summary?.accounts_count ?? 0;
  const cardsCount = summary?.credit_cards_count ?? 0;

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
          Saldo Total em Contas
        </Text>
        <Text className="text-3xl font-bold text-slate-50">
          {formatBrl(summary?.total_liquid_balance ?? 0)}
        </Text>
        <Text className="text-sm leading-5 text-slate-400">
          {accountsCount > 0 || cardsCount > 0
            ? `${accountsCount} conta(s) e ${cardsCount} cartão(ões) sincronizados via Open Finance.`
            : 'Conecte uma instituição via Open Finance na aba Bancos para acompanhar seu saldo e faturas reais.'}
        </Text>
        <Button
          title="Atualizar dados"
          variant="secondary"
          onPress={loadDashboard}
          loading={loadingSummary}
        />
      </Card>

      {summaryError ? (
        <View className="rounded-xl border border-red-500/30 bg-red-500/10 p-3">
          <Text className="text-sm text-red-300">{summaryError}</Text>
        </View>
      ) : null}

      <View className="flex-row gap-3">
        <Card className="flex-1 gap-1.5">
          <Text className="text-xs uppercase tracking-wider text-slate-400">
            Fatura Atual
          </Text>
          <Text className="text-xl font-bold text-brand-light">
            {formatBrl(summary?.current_month_invoices_total ?? 0)}
          </Text>
        </Card>
        <Card className="flex-1 gap-1.5">
          <Text className="text-xs uppercase tracking-wider text-slate-400">
            Parcelas Mês
          </Text>
          <Text className="text-xl font-bold text-slate-100">
            {formatBrl(summary?.current_month_installments ?? 0)}
          </Text>
        </Card>
      </View>

      {summary && summary.bank_accounts.length > 0 ? (
        <Card className="gap-3">
          <View className="flex-row items-center justify-between">
            <Text className="text-sm font-semibold text-slate-200">
              Contas Bancárias
            </Text>
            <Text className="text-[11px] text-slate-400">
              Toque para ver transações
            </Text>
          </View>
          {summary.bank_accounts.map(account => (
            <TouchableOpacity
              key={account.id}
              accessibilityRole="button"
              onPress={() =>
                navigation.navigate('BankTransactions', {
                  bankAccount: account,
                })
              }
              className="flex-row items-center justify-between border-t border-surface-border pt-2.5">
              <View className="flex-1 pr-3">
                <Text className="text-sm font-medium text-slate-100">
                  {account.institution_name}
                </Text>
                <Text className="text-xs text-slate-400">{account.name}</Text>
              </View>
              <View className="flex-row items-center gap-2">
                <Text className="text-sm font-semibold text-emerald-300">
                  {formatBrl(account.balance)}
                </Text>
                <ChevronRight color="#64748B" size={16} />
              </View>
            </TouchableOpacity>
          ))}
        </Card>
      ) : null}

      {summary && summary.credit_cards.length > 0 ? (
        <Card className="gap-3">
          <Text className="text-sm font-semibold text-slate-200">
            Cartões de Crédito
          </Text>
          {summary.credit_cards.map(card => (
            <View
              key={card.id}
              className="flex-row items-center justify-between border-t border-surface-border pt-2.5">
              <View className="flex-1 pr-3">
                <Text className="text-sm font-medium text-slate-100">
                  {card.name}
                  {card.last_four_digits ? ` · •••• ${card.last_four_digits}` : ''}
                </Text>
                <Text className="text-xs text-slate-400">
                  Limite: {formatBrl(card.credit_limit)}
                </Text>
              </View>
              <Text className="text-sm font-semibold text-amber-300">
                {formatBrl(card.current_invoice_amount)}
              </Text>
            </View>
          ))}
        </Card>
      ) : null}

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
