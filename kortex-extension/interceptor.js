// interceptor.js
(function () {
  try {
    const originalFetch = window.fetch;

    window.fetch = async function (...args) {
      const response = await originalFetch.apply(this, args);

      try {
        const url = args[0] instanceof Request ? args[0].url : args[0];

        if (typeof url === 'string' && (url.includes('/club/players') || url.includes('/purchased/items'))) {
          const clone = response.clone();

          clone.json().then(async (data) => {
            try {
              await window.fetch('http://localhost:3000/api/intercept', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
              });
            } catch (postErr) {
              console.error('[Kortex FC] Falha ao transmitir dados para a API local:', postErr);
            }
          }).catch(err => {
            console.error('[Kortex FC] Falha ao processar JSON da resposta:', err);
          });
        }
      } catch (err) {
        console.error('[Kortex FC] Erro não-bloqueante no monitoramento:', err);
      }

      return response;
    };
  } catch (error) {
    console.error('[Kortex FC] Falha na injeção do interceptor MAIN world:', error);
  }
})();
