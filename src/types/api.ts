export interface ApiEnvelope<T> {
  data: T;
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  avatar_url: string | null;
  has_google_linked: boolean;
}

export interface AuthTokenPayload {
  token: string;
  token_type: 'Bearer';
  is_new_user: boolean;
  user: AuthUser;
}

export interface HealthCheckPayload {
  status: 'ok' | 'degraded';
  service: string;
  environment: string;
  services: {
    database: string;
    cache: string;
  };
  timestamp: string;
}

export interface PluggyConnectTokenPayload {
  access_token: string;
}

export interface OpenFinanceSyncPayload {
  status: string;
  pluggy_item_id: string;
  queues: string[];
  requested_at: string;
}

export interface DashboardBankAccount {
  id: number;
  institution_name: string;
  name: string;
  type: string;
  currency_code: string;
  balance: number;
  last_synced_at: string | null;
}

export interface DashboardCreditCard {
  id: number;
  name: string;
  brand: string | null;
  last_four_digits: string | null;
  credit_limit: number;
  available_limit: number;
  current_invoice_amount: number;
  current_invoice_due_date: string | null;
  last_synced_at: string | null;
}

export interface DashboardSummaryPayload {
  total_liquid_balance: number;
  total_credit_limit: number;
  total_credit_used: number;
  current_month_invoices_total: number;
  current_month_installments: number;
  accounts_count: number;
  credit_cards_count: number;
  last_synced_at: string | null;
  bank_accounts: DashboardBankAccount[];
  credit_cards: DashboardCreditCard[];
}

export interface CategoryItem {
  id: number;
  name: string;
  slug: string;
  type: string;
  color: string | null;
  icon: string | null;
  is_essential: boolean;
}

export interface BankTransactionItem {
  id: number;
  description: string;
  notes: string | null;
  amount: number;
  type: 'income' | 'expense' | 'transfer';
  transaction_date: string;
  status: string;
  payment_method: string | null;
  is_category_manual: boolean;
  category: CategoryItem | null;
}

export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface BankAccountTransactionsPayload {
  bank_account: DashboardBankAccount;
  transactions: BankTransactionItem[];
  pagination: PaginationMeta;
}

export interface UpdateTransactionPayload {
  notes?: string | null;
  category_id?: number | null;
}
