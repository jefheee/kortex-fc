import React from 'react';

export default function DashboardPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-black text-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-950 border-r border-gray-900 flex flex-col">
        <div className="p-6 border-b border-gray-900">
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
            Kortex FC
          </h1>
          <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest font-semibold">Cérebro Analítico</p>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-6">
          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-900 text-emerald-400 font-medium">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
            </svg>
            Visão Geral
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-900 text-gray-400 hover:text-gray-200 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"></path>
            </svg>
            Inventário Interceptado
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-900 text-gray-400 hover:text-gray-200 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
            </svg>
            DMEs Solver
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full bg-gray-950">
        {/* Header */}
        <header className="h-16 border-b border-gray-900 flex items-center px-8 justify-between">
          <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">Kortex FC - Cérebro Analítico</h2>
          <div className="flex items-center gap-2 bg-gray-900 px-3 py-1.5 rounded-full border border-gray-800">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs text-gray-300 font-medium tracking-wider">TELEMETRIA ATIVA</span>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-8 overflow-y-auto">
          {/* Telemetry Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Card 1 */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Conexão Web App</h3>
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"></path></svg>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-gray-100">Escutando</span>
                <span className="text-emerald-400 text-sm">Intercept via MAIN</span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Moedas do Clube</h3>
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-white">0</span>
                <span className="text-sm text-gray-500 font-medium">FC</span>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Cartões Sincronizados</h3>
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-white">0</span>
                <span className="text-sm text-gray-500 font-medium">assets</span>
              </div>
            </div>

            {/* Card 4 */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Último Upsert DB</h3>
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-gray-100">--:--:--</span>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
