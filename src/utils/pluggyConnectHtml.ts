export type PluggyWebViewEvent =
  | { event: 'onSuccess'; itemId: string }
  | { event: 'onError'; message: string }
  | { event: 'onClose' }
  | { event: 'onOpenExternalUrl'; url: string };

/**
 * Render an embedded HTML launcher that initializes Pluggy Connect v2 in React Native WebView
 * and bridges widget lifecycle events through window.ReactNativeWebView.postMessage.
 */
export function buildPluggyConnectHtml(
  connectToken: string,
  includeSandbox = true,
): string {
  const serializedToken = JSON.stringify(connectToken).replace(/</g, '\\u003c');
  const sandboxLiteral = includeSandbox ? 'true' : 'false';

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <title>Pluggy Connect</title>
  <style>
    html, body {
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;
      background-color: #0b1120;
      color: #f8fafc;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
    #pluggy-status {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      padding: 24px;
      text-align: center;
      font-size: 14px;
      color: #94a3b8;
    }
  </style>
</head>
<body>
  <div id="pluggy-status">Carregando Pluggy Connect...</div>
  <script src="https://cdn.pluggy.ai/pluggy-connect/v2.7.0/pluggy-connect.js"></script>
  <script>
    (function () {
      function sendToApp(payload) {
        if (window.ReactNativeWebView && typeof window.ReactNativeWebView.postMessage === 'function') {
          window.ReactNativeWebView.postMessage(JSON.stringify(payload));
        }
      }

      var originalOpen = window.open;
      window.open = function (url) {
        if (typeof url === 'string' && url.trim() !== '') {
          sendToApp({ event: 'onOpenExternalUrl', url: url.trim() });
        } else if (typeof originalOpen === 'function') {
          return originalOpen.apply(window, arguments);
        }
        return { closed: false, focus: function () {}, close: function () {} };
      };

      if (typeof window.PluggyConnect !== 'function') {
        sendToApp({
          event: 'onError',
          message: 'Não foi possível carregar o widget Pluggy Connect.'
        });
        return;
      }

      try {
        var pluggyConnect = new window.PluggyConnect({
          connectToken: ${serializedToken},
          includeSandbox: ${sandboxLiteral},
          onSuccess: function (itemData) {
            var itemId = itemData && itemData.item && itemData.item.id ? String(itemData.item.id) : '';
            if (itemId) {
              sendToApp({ event: 'onSuccess', itemId: itemId });
            } else {
              sendToApp({ event: 'onError', message: 'Conexão concluída sem itemId retornado.' });
            }
          },
          onError: function (error) {
            var msg = (error && error.message) ? String(error.message) : 'Falha ao conectar instituição.';
            sendToApp({ event: 'onError', message: msg });
          },
          onClose: function () {
            sendToApp({ event: 'onClose' });
          }
        });

        pluggyConnect.init();
      } catch (err) {
        sendToApp({
          event: 'onError',
          message: (err && err.message) ? String(err.message) : 'Erro ao inicializar Pluggy Connect.'
        });
      }
    })();
  </script>
</body>
</html>`;
}

/**
 * Parse a JSON postMessage payload emitted by the Pluggy Connect WebView bridge.
 */
export function parsePluggyConnectMessage(raw: string): PluggyWebViewEvent | null {
  try {
    const data = JSON.parse(raw) as {
      event?: string;
      type?: string;
      itemId?: unknown;
      item?: { id?: unknown };
      payload?: { item?: { id?: unknown } };
      message?: unknown;
      url?: unknown;
    };

    const rawItemId =
      data.itemId ?? data.item?.id ?? data.payload?.item?.id ?? null;

    if (
      (data.event === 'onSuccess' || data.type === 'SUCCESS') &&
      typeof rawItemId === 'string' &&
      rawItemId.trim() !== ''
    ) {
      return { event: 'onSuccess', itemId: rawItemId.trim() };
    }

    if (data.event === 'onError' || data.type === 'ERROR') {
      return {
        event: 'onError',
        message:
          typeof data.message === 'string' && data.message.trim() !== ''
            ? data.message.trim()
            : 'Falha ao conectar instituição.',
      };
    }

    if (data.event === 'onClose' || data.type === 'CLOSE') {
      return { event: 'onClose' };
    }

    if (
      data.event === 'onOpenExternalUrl' &&
      typeof data.url === 'string' &&
      data.url.trim() !== ''
    ) {
      return { event: 'onOpenExternalUrl', url: data.url.trim() };
    }

    return null;
  } catch {
    return null;
  }
}
