import React from 'react';

export default function DashboardPage() {
  return (
    <div className="flex h-screen overflow-hidden">
      <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col">
        <div className="p-6 border-b border-gray-800/50">
          <h1 className="text-xl font-bold tracking-tight text-white">Kortex FC</h1>
          <p className="text-xs text-gray-400 mt-1 tracking-wider uppercase">Data Engine</p>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-6">
          <a href="#" className="block px-4 py-3 rounded-lg bg-blue-600/10 text-blue-400 font-medium">
            Visão Geral
          </a>
          <a href="#" className="block px-4 py-3 rounded-lg hover:bg-gray-800 text-gray-300 transition-colors">
            DMEs Otimizados
          </a>
          <a href="#" className="block px-4 py-3 rounded-lg hover:bg-gray-800 text-gray-300 transition-colors">
            Inventário
          </a>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col h-full">
        <header className="h-16 bg-gray-900/50 border-b border-gray-800 flex items-center px-8 justify-between">
          <h2 className="text-sm font-medium text-gray-300">Dashboard / Visão Geral</h2>
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            <span className="text-xs text-gray-400">Sistema Conectado</span>
          </div>
        </header>

        <main className="flex-1 p-8 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h3 className="text-sm font-medium text-gray-400 mb-4">Status da Conexão com Web App</h3>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span className="text-base font-semibold text-gray-100">Aguardando Interceptação</span>
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h3 className="text-sm font-medium text-gray-400 mb-4">Cartas no Banco de Dados</h3>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold text-white">0</span>
                <span className="text-sm text-gray-500 mb-1">registros totais</span>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
