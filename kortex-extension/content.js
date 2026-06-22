// content.js
// Estabelece a ponte de comunicação e injeta o monitor de fetch na página
try {
  // Injeta o script reader.js no contexto principal da página
  const script = document.createElement('script');
  script.src = chrome.runtime.getURL('reader.js');
  script.onload = function() {
    this.remove();
  };
  (document.head || document.documentElement).appendChild(script);

  // Escuta os dados enviados pelo reader.js via postMessage
  window.addEventListener('message', async (event) => {
    // Verifica a origem e a identificação do payload
    if (event.source !== window || !event.data || event.data.type !== 'KORTEX_INVENTORY_DATA') {
      return;
    }

    try {
      const inventoryData = event.data.payload;
      
      // Encaminha os dados interceptados para o backend Next.js local
      const response = await fetch('http://localhost:3000/api/intercept', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(inventoryData)
      });

      if (!response.ok) {
        console.error('[Kortex FC] Falha no envio para o backend:', response.status, response.statusText);
      } else {
        console.log('[Kortex FC] Inventário sincronizado com sucesso!');
      }
    } catch (error) {
      console.error('[Kortex FC] Falha de conexão com o backend Next.js:', error);
    }
  });
} catch (error) {
  console.error('[Kortex FC] Erro ao injetar scripts da extensão:', error);
}
