import { type RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ArrowLeft, Search, Tag } from 'lucide-react-native';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../components/Button';
import type { MainStackParamList } from '../../navigation/RootNavigator';
import { extractApiErrorMessage } from '../../services/api';
import { openFinanceService } from '../../services/openFinanceService';
import type {
  BankTransactionItem,
  CategoryItem,
  PaginationMeta,
} from '../../types/api';
import { formatBrl, formatShortDate } from '../../utils/currency';

export function BankTransactionsScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const route =
    useRoute<RouteProp<MainStackParamList, 'BankTransactions'>>();
  const { bankAccount } = route.params;

  const [transactions, setTransactions] = useState<BankTransactionItem[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({
    current_page: 1,
    last_page: 1,
    per_page: 30,
    total: 0,
  });
  const [searchInput, setSearchInput] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [selectedTx, setSelectedTx] = useState<BankTransactionItem | null>(
    null,
  );
  const [notesDraft, setNotesDraft] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null,
  );
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    const trimmed = searchInput.trim();
    if (trimmed === appliedSearch) {
      return;
    }
    const timer = setTimeout(() => {
      setAppliedSearch(trimmed);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchInput, appliedSearch]);

  useEffect(() => {
    let active = true;
    openFinanceService
      .fetchCategories()
      .then(data => {
        if (active) {
          setCategories(data);
        }
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, []);

  const loadPage = useCallback(
    async (page: number, mode: 'initial' | 'refresh' | 'more') => {
      if (mode === 'initial') {
        setLoading(true);
      } else if (mode === 'refresh') {
        setRefreshing(true);
      } else {
        setLoadingMore(true);
      }
      setErrorMessage(null);

      try {
        const res = await openFinanceService.fetchBankAccountTransactions(
          bankAccount.id,
          {
            page,
            perPage: 30,
            search: appliedSearch,
          },
        );
        setPagination(res.pagination);
        setTransactions(prev =>
          page === 1 ? res.transactions : [...prev, ...res.transactions],
        );
      } catch (err) {
        setErrorMessage(extractApiErrorMessage(err));
      } finally {
        setLoading(false);
        setRefreshing(false);
        setLoadingMore(false);
      }
    },
    [bankAccount.id, appliedSearch],
  );

  useEffect(() => {
    loadPage(1, 'initial');
  }, [loadPage]);

  const handleLoadMore = () => {
    if (loading || loadingMore || refreshing) {
      return;
    }
    if (pagination.current_page < pagination.last_page) {
      loadPage(pagination.current_page + 1, 'more');
    }
  };

  const openEditor = (tx: BankTransactionItem) => {
    setSelectedTx(tx);
    setNotesDraft(tx.notes ?? '');
    setSelectedCategoryId(tx.category?.id ?? null);
    setSaveError(null);
  };

  const handleSave = async () => {
    if (!selectedTx) {
      return;
    }
    setSaving(true);
    setSaveError(null);
    try {
      const updated = await openFinanceService.updateTransaction(
        selectedTx.id,
        {
          notes: notesDraft.trim() !== '' ? notesDraft.trim() : null,
          category_id: selectedCategoryId,
        },
      );
      setTransactions(prev =>
        prev.map(item => (item.id === updated.id ? updated : item)),
      );
      setSelectedTx(null);
    } catch (err) {
      setSaveError(extractApiErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const renderItem = ({ item }: { item: BankTransactionItem }) => {
    const isIncome = item.type === 'income';
    const isExpense = item.type === 'expense';
    const amountColor = isIncome
      ? 'text-emerald-300'
      : isExpense
        ? 'text-red-300'
        : 'text-slate-200';
    const amountPrefix = isIncome ? '+' : isExpense ? '-' : '';

    return (
      <TouchableOpacity
        testID={`transaction-row-${item.id}`}
        accessibilityRole="button"
        onPress={() => openEditor(item)}
        className="mb-3 rounded-2xl border border-surface-border bg-surface-card p-4"
      >
        <View className="flex-row items-start justify-between gap-3">
          <View className="flex-1">
            <Text className="text-sm font-semibold text-slate-100">
              {item.description}
            </Text>
            <Text className="mt-1 text-xs text-slate-400">
              {formatShortDate(item.transaction_date)}
            </Text>
          </View>
          <Text className={`text-sm font-bold ${amountColor}`}>
            {amountPrefix}
            {formatBrl(item.amount)}
          </Text>
        </View>

        <View className="mt-3 flex-row flex-wrap items-center gap-2">
          <View className="flex-row items-center gap-1.5 rounded-full border border-surface-border bg-surface-elevated px-2.5 py-1">
            <Tag color={item.category?.color ?? '#94A3B8'} size={12} />
            <Text className="text-xs font-medium text-slate-200">
              {item.category?.name ?? 'Sem tipo de gasto'}
            </Text>
          </View>
          {item.is_category_manual ? (
            <Text className="text-[11px] font-medium text-brand-light">
              Manual
            </Text>
          ) : null}
        </View>

        <Text
          className={`mt-2.5 text-xs ${
            item.notes ? 'text-slate-200' : 'italic text-slate-500'
          }`}
        >
          {item.notes
            ? `Porquê: ${item.notes}`
            : 'Toque para adicionar um porquê e escolher o tipo de gasto'}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top', 'left', 'right']}>
      <View className="border-b border-surface-border px-5 py-3">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Voltar"
            onPress={() => navigation.goBack()}
            className="flex-row items-center gap-2 py-1 pr-3"
          >
            <ArrowLeft color="#E2E8F0" size={20} />
            <Text className="text-sm font-medium text-slate-200">Voltar</Text>
          </TouchableOpacity>
          <Text className="text-base font-bold text-emerald-300">
            {formatBrl(bankAccount.balance)}
          </Text>
        </View>

        <Text className="mt-1 text-xl font-bold text-slate-50">
          {bankAccount.institution_name}
        </Text>
        <Text className="text-xs text-slate-400">
          {bankAccount.name} · {pagination.total} transação(ões)
        </Text>

        <View className="mt-3 flex-row items-center gap-2 rounded-xl border border-surface-border bg-surface-card px-3 py-2">
          <Search color="#64748B" size={16} />
          <TextInput
            value={searchInput}
            onChangeText={setSearchInput}
            placeholder="Buscar por descrição ou porquê..."
            placeholderTextColor="#64748B"
            className="flex-1 text-sm text-slate-100"
          />
        </View>
      </View>

      {errorMessage ? (
        <View className="mx-5 mt-3 rounded-xl border border-red-500/30 bg-red-500/10 p-3">
          <Text className="text-sm text-red-300">{errorMessage}</Text>
        </View>
      ) : null}

      {loading && transactions.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#10B981" />
        </View>
      ) : (
        <FlatList
          data={transactions}
          keyExtractor={item => String(item.id)}
          renderItem={renderItem}
          contentContainerClassName="px-5 py-4 pb-8"
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.4}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => loadPage(1, 'refresh')}
              tintColor="#10B981"
            />
          }
          ListEmptyComponent={
            <View className="items-center py-12">
              <Text className="text-sm text-slate-400">
                Nenhuma transação encontrada para esta conta.
              </Text>
            </View>
          }
          ListFooterComponent={
            loadingMore ? (
              <View className="py-4">
                <ActivityIndicator size="small" color="#10B981" />
              </View>
            ) : undefined
          }
        />
      )}

      <Modal
        visible={selectedTx !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedTx(null)}
      >
        <View className="flex-1 justify-end bg-black/70">
          <View className="max-h-[85%] rounded-t-3xl border-t border-surface-border bg-surface-card px-5 pb-6 pt-5">
            <Text className="text-xs font-semibold uppercase tracking-wider text-brand-light">
              Detalhar Gasto
            </Text>
            <Text className="mt-1 text-lg font-bold text-slate-50">
              {selectedTx?.description}
            </Text>
            <Text className="mt-0.5 text-xs text-slate-400">
              {selectedTx
                ? `${formatShortDate(selectedTx.transaction_date)} · ${formatBrl(
                    selectedTx.amount,
                  )}`
                : ''}
            </Text>

            <ScrollView className="mt-4" showsVerticalScrollIndicator={false}>
              <Text className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-400">
                Tipo de gasto (Categoria)
              </Text>
              <View className="mb-4 flex-row flex-wrap gap-2">
                {categories.map(cat => {
                  const isSelected = selectedCategoryId === cat.id;
                  return (
                    <TouchableOpacity
                      key={cat.id}
                      testID={`category-chip-${cat.id}`}
                      accessibilityRole="button"
                      onPress={() => setSelectedCategoryId(cat.id)}
                      className={`rounded-full border px-3 py-1.5 ${
                        isSelected
                          ? 'border-brand bg-brand/20'
                          : 'border-surface-border bg-surface-elevated'
                      }`}
                    >
                      <Text
                        className={`text-xs font-medium ${
                          isSelected ? 'text-emerald-300' : 'text-slate-300'
                        }`}
                      >
                        {cat.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <Text className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-400">
                Por quê? (Motivo do gasto)
              </Text>
              <TextInput
                testID="notes-input"
                value={notesDraft}
                onChangeText={setNotesDraft}
                placeholder="Ex: Almoço de trabalho, compra do mês..."
                placeholderTextColor="#64748B"
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                className="min-h-[88px] rounded-xl border border-surface-border bg-surface-elevated p-3 text-sm text-slate-100"
              />

              {saveError ? (
                <View className="mt-3 rounded-xl border border-red-500/30 bg-red-500/10 p-3">
                  <Text className="text-sm text-red-300">{saveError}</Text>
                </View>
              ) : null}
            </ScrollView>

            <View className="mt-4 flex-row gap-3">
              <View className="flex-1">
                <Button
                  title="Cancelar"
                  variant="secondary"
                  onPress={() => setSelectedTx(null)}
                />
              </View>
              <View className="flex-1">
                <Button title="Salvar" onPress={handleSave} loading={saving} />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
