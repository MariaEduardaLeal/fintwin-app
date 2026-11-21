import React from 'react';
import { Text, View } from 'react-native';
import { Card } from '../../components/Card';
import { ScreenContainer } from '../../components/ScreenContainer';
import { StatusBadge } from '../../components/StatusBadge';

export function TimelineScreen() {
  return (
    <ScreenContainer className="gap-5">
      <View className="gap-2">
        <StatusBadge label="Fase 4 · Em breve" tone="warning" />
        <Text className="text-2xl font-bold text-slate-50">
          Timeline de Renda e Parcelas
        </Text>
        <Text className="text-sm text-slate-400">
          Visualização mês a mês do alívio de parcelas do cartão e proventos
          projetados a 60fps com Reanimated e Skia.
        </Text>
      </View>

      <Card className="gap-2">
        <Text className="text-base font-semibold text-slate-100">
          Motor de Unrolling Pronto no Backend
        </Text>
        <Text className="text-sm leading-5 text-slate-400">
          O backend já desdobra compras parceladas mês a mês em
          credit_transactions. Assim que a Fase 4 expor os endpoints de projeção,
          o gráfico Burn-down aparecerá aqui.
        </Text>
      </Card>
    </ScreenContainer>
  );
}
