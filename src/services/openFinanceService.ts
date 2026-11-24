import type {
  ApiEnvelope,
  BankAccountTransactionsPayload,
  BankTransactionItem,
  CategoryItem,
  DashboardSummaryPayload,
  OpenFinanceSyncPayload,
  PluggyConnectTokenPayload,
  UpdateTransactionPayload,
} from '../types/api';
import { apiClient } from './api';

export const openFinanceService = {
  async fetchDashboardSummary(): Promise<DashboardSummaryPayload> {
    const { data } = await apiClient.get<ApiEnvelope<DashboardSummaryPayload>>(
      '/dashboard/summary',
    );
    return data.data;
  },

  async fetchCategories(): Promise<CategoryItem[]> {
    const { data } = await apiClient.get<ApiEnvelope<CategoryItem[]>>(
      '/categories',
    );
    return data.data;
  },

  async fetchBankAccountTransactions(
    bankAccountId: number,
    params?: {
      page?: number;
      perPage?: number;
      search?: string;
      categoryId?: number;
    },
  ): Promise<BankAccountTransactionsPayload> {
    const { data } = await apiClient.get<
      ApiEnvelope<BankAccountTransactionsPayload>
    >(`/bank-accounts/${bankAccountId}/transactions`, {
      params: {
        page: params?.page ?? 1,
        per_page: params?.perPage ?? 30,
        ...(params?.search?.trim() ? { search: params.search.trim() } : {}),
        ...(params?.categoryId ? { category_id: params.categoryId } : {}),
      },
    });
    return data.data;
  },

  async updateTransaction(
    transactionId: number,
    payload: UpdateTransactionPayload,
  ): Promise<BankTransactionItem> {
    const { data } = await apiClient.patch<ApiEnvelope<BankTransactionItem>>(
      `/transactions/${transactionId}`,
      payload,
    );
    return data.data;
  },

  async createConnectToken(itemId?: string): Promise<PluggyConnectTokenPayload> {
    const { data } = await apiClient.post<ApiEnvelope<PluggyConnectTokenPayload>>(
      '/pluggy/connect-token',
      itemId ? { item_id: itemId } : {},
    );
    return data.data;
  },

  async requestSync(
    pluggyItemId: string,
    fromDate?: string,
  ): Promise<OpenFinanceSyncPayload> {
    const { data } = await apiClient.post<ApiEnvelope<OpenFinanceSyncPayload>>(
      '/sync/open-finance',
      {
        pluggy_item_id: pluggyItemId,
        ...(fromDate ? { from_date: fromDate } : {}),
      },
    );
    return data.data;
  },
};
