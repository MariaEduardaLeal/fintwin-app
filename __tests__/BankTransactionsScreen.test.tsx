import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { BankTransactionsScreen } from '../src/screens/main/BankTransactionsScreen';
import { openFinanceService } from '../src/services/openFinanceService';

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ goBack: jest.fn() }),
  useRoute: () => ({
    params: {
      bankAccount: {
        id: 1,
        institution_name: 'Santander',
        name: 'Conta Corrente',
        type: 'checking',
        currency_code: 'BRL',
        balance: 834.65,
        last_synced_at: null,
      },
    },
  }),
}));

describe('BankTransactionsScreen', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('loads bank transactions and saves spending type and reason', async () => {
    jest.spyOn(openFinanceService, 'fetchCategories').mockResolvedValue([
      {
        id: 4,
        name: 'Alimentação',
        slug: 'alimentacao',
        type: 'expense',
        color: '#F59E0B',
        icon: 'utensils',
        is_essential: true,
      },
      {
        id: 8,
        name: 'Lazer e Assinaturas',
        slug: 'lazer',
        type: 'expense',
        color: '#F97316',
        icon: 'gamepad-2',
        is_essential: false,
      },
    ]);

    jest
      .spyOn(openFinanceService, 'fetchBankAccountTransactions')
      .mockResolvedValue({
        bank_account: {
          id: 1,
          institution_name: 'Santander',
          name: 'Conta Corrente',
          type: 'checking',
          currency_code: 'BRL',
          balance: 834.65,
          last_synced_at: null,
        },
        transactions: [
          {
            id: 101,
            description: 'Padaria do Bairro',
            notes: null,
            amount: 24.5,
            type: 'expense',
            transaction_date: '2026-11-23',
            status: 'posted',
            payment_method: null,
            is_category_manual: false,
            category: {
              id: 4,
              name: 'Alimentação',
              slug: 'alimentacao',
              type: 'expense',
              color: '#F59E0B',
              icon: 'utensils',
              is_essential: true,
            },
          },
        ],
        pagination: {
          current_page: 1,
          last_page: 1,
          per_page: 30,
          total: 1,
        },
      });

    const updateSpy = jest
      .spyOn(openFinanceService, 'updateTransaction')
      .mockResolvedValue({
        id: 101,
        description: 'Padaria do Bairro',
        notes: 'Café com a equipe',
        amount: 24.5,
        type: 'expense',
        transaction_date: '2026-11-23',
        status: 'posted',
        payment_method: null,
        is_category_manual: true,
        category: {
          id: 8,
          name: 'Lazer e Assinaturas',
          slug: 'lazer',
          type: 'expense',
          color: '#F97316',
          icon: 'gamepad-2',
          is_essential: false,
        },
      });

    let tree: ReactTestRenderer.ReactTestRenderer | undefined;

    try {
      await ReactTestRenderer.act(async () => {
        tree = ReactTestRenderer.create(<BankTransactionsScreen />);
      });

      const transactionCard = tree?.root.find(
        node => node.props.testID === 'transaction-row-101',
      );
      expect(transactionCard).toBeDefined();

      await ReactTestRenderer.act(async () => {
        transactionCard?.props.onPress();
      });

      const leisureChip = tree?.root.find(
        node => node.props.testID === 'category-chip-8',
      );
      expect(leisureChip).toBeDefined();

      await ReactTestRenderer.act(async () => {
        leisureChip?.props.onPress();
      });

      const notesInput = tree?.root.find(
        node => node.props.testID === 'notes-input',
      );
      expect(notesInput).toBeDefined();

      await ReactTestRenderer.act(async () => {
        notesInput?.props.onChangeText('Café com a equipe');
      });

      const saveButton = tree?.root.find(
        node =>
          node.props.title === 'Salvar' &&
          typeof node.props.onPress === 'function',
      );
      expect(saveButton).toBeDefined();

      await ReactTestRenderer.act(async () => {
        await saveButton?.props.onPress();
      });

      expect(updateSpy).toHaveBeenCalledWith(101, {
        notes: 'Café com a equipe',
        category_id: 8,
      });
    } finally {
      await ReactTestRenderer.act(async () => {
        tree?.unmount();
      });
    }
  });
});
