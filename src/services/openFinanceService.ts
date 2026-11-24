import type {
  ApiEnvelope,
  DashboardSummaryPayload,
  OpenFinanceSyncPayload,
  PluggyConnectTokenPayload,
} from '../types/api';
import { apiClient } from './api';

export const openFinanceService = {
  async fetchDashboardSummary(): Promise<DashboardSummaryPayload> {
    const { data } = await apiClient.get<ApiEnvelope<DashboardSummaryPayload>>(
      '/dashboard/summary',
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
