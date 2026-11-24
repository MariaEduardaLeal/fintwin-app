import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { ConnectBankScreen } from '../src/screens/main/ConnectBankScreen';
import { openFinanceService } from '../src/services/openFinanceService';

describe('ConnectBankScreen', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('opens official PluggyConnect widget and triggers sync on onSuccess', async () => {
    const createTokenSpy = jest
      .spyOn(openFinanceService, 'createConnectToken')
      .mockResolvedValue({ access_token: 'connect-token-123' });

    const requestSyncSpy = jest
      .spyOn(openFinanceService, 'requestSync')
      .mockResolvedValue({
        status: 'queued',
        pluggy_item_id: 'item-pluggy-999',
        queues: ['open-finance'],
        requested_at: '2026-11-24T19:00:00Z',
      });

    let tree: ReactTestRenderer.ReactTestRenderer | undefined;

    await ReactTestRenderer.act(async () => {
      tree = ReactTestRenderer.create(<ConnectBankScreen />);
    });

    const openButton = tree?.root.find(
      node =>
        node.props.title === 'Abrir Pluggy Connect' &&
        typeof node.props.onPress === 'function',
    );

    expect(openButton).toBeDefined();

    await ReactTestRenderer.act(async () => {
      await openButton?.props.onPress();
    });

    expect(createTokenSpy).toHaveBeenCalledTimes(1);

    const pluggyWidget = tree?.root.find(
      node => String(node.type) === 'PluggyConnect',
    );
    expect(pluggyWidget).toBeDefined();
    expect(pluggyWidget?.props.connectToken).toBe('connect-token-123');
    expect(pluggyWidget?.props.forceOauthInBrowser).toBe(false);

    await ReactTestRenderer.act(async () => {
      pluggyWidget?.props.onSuccess({
        item: { id: 'item-pluggy-999' },
      });
    });

    expect(requestSyncSpy).toHaveBeenCalledWith('item-pluggy-999');
  });
});
