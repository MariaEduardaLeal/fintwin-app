import {
  buildPluggyConnectHtml,
  parsePluggyConnectMessage,
} from '../src/utils/pluggyConnectHtml';

describe('pluggyConnectHtml', () => {
  it('renders CDN script, escapes angle brackets in connectToken, and wires lifecycle callbacks', () => {
    const html = buildPluggyConnectHtml('tok_<script>alert(1)</script>', true);

    expect(html).toContain(
      'https://cdn.pluggy.ai/pluggy-connect/v2.7.0/pluggy-connect.js',
    );
    expect(html).toContain('tok_\\u003cscript>alert(1)\\u003c/script>');
    expect(html).toContain('onSuccess');
    expect(html).toContain('onError');
    expect(html).toContain('onClose');
    expect(html).toContain('onOpenExternalUrl');
  });

  it('parses onSuccess with direct itemId or legacy nested item.id', () => {
    expect(
      parsePluggyConnectMessage(
        JSON.stringify({ event: 'onSuccess', itemId: 'item-123' }),
      ),
    ).toEqual({ event: 'onSuccess', itemId: 'item-123' });

    expect(
      parsePluggyConnectMessage(
        JSON.stringify({ event: 'onSuccess', item: { id: 'item-legacy' } }),
      ),
    ).toEqual({ event: 'onSuccess', itemId: 'item-legacy' });
  });

  it('parses onError, onClose, and rejects malformed JSON', () => {
    expect(
      parsePluggyConnectMessage(
        JSON.stringify({ event: 'onError', message: 'Consentimento negado' }),
      ),
    ).toEqual({ event: 'onError', message: 'Consentimento negado' });

    expect(
      parsePluggyConnectMessage(JSON.stringify({ event: 'onClose' })),
    ).toEqual({ event: 'onClose' });

    expect(
      parsePluggyConnectMessage(
        JSON.stringify({
          event: 'onOpenExternalUrl',
          url: 'https://meu.pluggy.ai/oauth',
        }),
      ),
    ).toEqual({
      event: 'onOpenExternalUrl',
      url: 'https://meu.pluggy.ai/oauth',
    });

    expect(parsePluggyConnectMessage('{not-json')).toBeNull();
  });
});
