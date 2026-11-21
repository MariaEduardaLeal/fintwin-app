import React from 'react';
import { Text, View } from 'react-native';
import { Card } from '../../components/Card';
import { ScreenContainer } from '../../components/ScreenContainer';
import { StatusBadge } from '../../components/StatusBadge';

export function AdvisorScreen() {
  return (
    <ScreenContainer className="gap-5">
      <View className="gap-2">
        <StatusBadge label="Fase 5 · DeepSeek AI" tone="neutral" />
        <Text className="text-2xl font-bold text-slate-50">
          Conselheiro Financeiro AI
        </Text>
        <Text className="text-sm text-slate-400">
          Converse com o DeepSeek usando seu fluxo de caixa real e dívidas
          parceladas para decidir se vale a pena comprar agora ou esperar.
        </Text>
      </View>

      <Card className="gap-2">
        <Text className="text-base font-semibold text-slate-100">
          Integração DeepSeek Configurada na API
        </Text>
        <Text className="text-sm leading-5 text-slate-400">
          Na Fase 5 implementaremos o AiPurchaseDecisionService e habilitaremos o
          chat interativo nesta tela.
        </Text>
      </Card>
    </ScreenContainer>
  );
}
