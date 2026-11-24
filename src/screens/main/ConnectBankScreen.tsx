import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { PluggyConnect } from 'react-native-pluggy-connect';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Input } from '../../components/Input';
import { ScreenContainer } from '../../components/ScreenContainer';
import { StatusBadge } from '../../components/StatusBadge';
import { extractApiErrorMessage } from '../../services/api';
import { openFinanceService } from '../../services/openFinanceService';

export function ConnectBankScreen() {
  const [connectToken, setConnectToken] = useState<string | null>(null);
  const [pluggyItemId, setPluggyItemId] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loadingToken, setLoadingToken] = useState(false);
  const [loadingSync, setLoadingSync] = useState(false);

  const handleOpenPluggyConnect = async () => {
    setErrorMessage(null);
    setStatusMessage(null);
    setLoadingToken(true);
    try {
      const payload = await openFinanceService.createConnectToken();
      setConnectToken(payload.access_token);
    } catch (err) {
      setErrorMessage(extractApiErrorMessage(err));
    } finally {
      setLoadingToken(false);
    }
  };

  const handleSyncItem = async (itemIdOverride?: string) => {
    const targetId = (itemIdOverride ?? pluggyItemId).trim();
    if (!targetId) {
      setErrorMessage('Informe o pluggy_item_id para disparar a sincronização.');
      return;
    }

    setErrorMessage(null);
    setLoadingSync(true);
    try {
      const res = await openFinanceService.requestSync(targetId);
      setStatusMessage(
        `Sincronização enfileirada na fila ${res.queues.join(', ')} (${res.pluggy_item_id}).`,
      );
    } catch (err) {
      setErrorMessage(extractApiErrorMessage(err));
    } finally {
      setLoadingSync(false);
    }
  };

  if (connectToken) {
    return (
      <ScreenContainer scroll={false} className="gap-3 px-0 py-0">
        <View className="flex-row items-center justify-between px-5 pt-3">
          <Text className="text-base font-semibold text-slate-100">
            Pluggy Connect
          </Text>
          <Button
            title="Fechar"
            variant="ghost"
            onPress={() => setConnectToken(null)}
          />
        </View>
        <View className="flex-1">
          <PluggyConnect
            connectToken={connectToken}
            includeSandbox
            language="pt"
            forceOauthInBrowser={false}
            onSuccess={data => {
              setConnectToken(null);
              const itemId = data?.item?.id;
              if (itemId) {
                setPluggyItemId(itemId);
                handleSyncItem(itemId);
              }
            }}
            onError={error => {
              setConnectToken(null);
              setErrorMessage(
                error?.message || 'Falha ao conectar instituição na Pluggy.',
              );
            }}
            onClose={() => setConnectToken(null)}
          />
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="gap-5">
      <View className="gap-2">
        <StatusBadge label="Open Finance · Pluggy" tone="ok" />
        <Text className="text-2xl font-bold text-slate-50">
          Conectar Contas e Cartões
        </Text>
        <Text className="text-sm text-slate-400">
          Autorize seu banco via Pluggy Connect ou dispare a ingestão assíncrona no
          Horizon para atualizar saldos, faturas e parcelas futuras.
        </Text>
      </View>

      <Card className="gap-4">
        <Button
          title="Abrir Pluggy Connect"
          onPress={handleOpenPluggyConnect}
          loading={loadingToken}
        />

        <View className="h-px bg-surface-border" />

        <Input
          label="Pluggy Item ID (Sincronização Manual)"
          placeholder="ex: 8f9c2a..."
          value={pluggyItemId}
          onChangeText={setPluggyItemId}
        />

        <Button
          title="Sincronizar Agora"
          variant="secondary"
          onPress={() => handleSyncItem()}
          loading={loadingSync}
        />

        {statusMessage ? (
          <View className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3">
            <Text className="text-sm text-emerald-300">{statusMessage}</Text>
          </View>
        ) : null}

        {errorMessage ? (
          <View className="rounded-xl border border-red-500/30 bg-red-500/10 p-3">
            <Text className="text-sm text-red-300">{errorMessage}</Text>
          </View>
        ) : null}
      </Card>
    </ScreenContainer>
  );
}
