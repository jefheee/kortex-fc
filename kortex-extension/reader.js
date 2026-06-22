// reader.js
// Executa no contexto da página e intercepta a API Fetch nativa do navegador
(function() {
  try {
    const originalFetch = window.fetch;

    window.fetch = async function(...args) {
      // Deixa a requisição original seguir seu curso naturalmente
      const response = await originalFetch.apply(this, args);
      
      try {
        const url = args[0] instanceof Request ? args[0].url : args[0];
        
        // Verifica se a URL da requisição bate com o endpoint alvo do inventário
        if (typeof url === 'string' && url.includes('/club/players')) {
          // Clona a resposta para consumir o JSON sem consumir o body original
          const clone = response.clone();
          
          clone.json().then(data => {
            // Emite o JSON para o content.js da extensão via postMessage
            window.postMessage({
              type: 'KORTEX_INVENTORY_DATA',
              payload: data
            }, '*');
          }).catch(err => {
            console.error('[Kortex FC] Falha ao realizar parse do JSON:', err);
          });
        }
      } catch (err) {
        console.error('[Kortex FC] Falha durante monitoramento de fetch:', err);
      }

      // Retorna a resposta intocada para a aplicação cliente
      return response;
    };
    
    console.log('[Kortex FC] Monitoramento de rede inicializado e pronto.');
  } catch (error) {
    console.error('[Kortex FC] Falha crítica ao inicializar reader.js:', error);
  }
})();
