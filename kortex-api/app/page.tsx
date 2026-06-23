"use client";
import React, { useState } from 'react';

export default function DashboardPage() {
  const [uploadStatus, setUploadStatus] = useState<string>("Aguardando");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [totalCards, setTotalCards] = useState<number>(0);
  const [duplicatedCards, setDuplicatedCards] = useState<number>(0);
  const [lastSync, setLastSync] = useState<string>("--:--:--");

  // Vault state
  const [coins, setCoins] = useState<string>('');
  const [points, setPoints] = useState<string>('');
  const [tokens, setTokens] = useState<string>('');
  const [vaultStatus, setVaultStatus] = useState<string>('');

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadStatus("Processando...");

    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target?.result;
      if (typeof text !== 'string') {
        setUploadStatus("Erro");
        setIsUploading(false);
        return;
      }

      setUploadStatus("Sincronizando...");
      try {
        const response = await fetch('/api/upload-csv', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ csvData: text })
        });

        if (response.ok) {
          const data = await response.json();
          setTotalCards(data.count || 0);
          setDuplicatedCards(data.duplicatedCount || 0);
          
          const now = new Date();
          setLastSync(now.toLocaleTimeString('pt-BR'));
          
          setUploadStatus("Sincronizado");
        } else {
          setUploadStatus("Erro");
        }
      } catch (err) {
        console.error(err);
        setUploadStatus("Erro");
      } finally {
        setIsUploading(false);
      }
    };
    reader.readAsText(file);
  };

  const handleSyncVault = async () => {
    setVaultStatus("Sincronizando...");
    try {
      const response = await fetch('/api/sync-vault', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ coins, points, tokens })
      });
      if (response.ok) {
        setVaultStatus("Sincronizado");
      } else {
        setVaultStatus("Erro");
      }
    } catch {
      setVaultStatus("Erro");
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-black text-gray-100">
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
        </nav>
      </aside>

      <div className="flex-1 flex flex-col h-full bg-gray-950">
        <header className="h-16 border-b border-gray-900 flex items-center px-8 justify-between">
          <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">Kortex FC - Cérebro Analítico</h2>
          <div className="flex items-center gap-2 bg-gray-900 px-3 py-1.5 rounded-full border border-gray-800">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs text-gray-300 font-medium tracking-wider">TELEMETRIA ATIVA</span>
          </div>
        </header>

        <main className="flex-1 p-8 overflow-y-auto">
          {/* CSV Ingestion Zone */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-sm mb-6 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-widest">Injeção Paletools (CSV)</h3>
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
              </svg>
            </div>
            
            <label className="flex items-center justify-center w-full h-32 px-4 transition bg-gray-950 border-2 border-gray-800 border-dashed rounded-md appearance-none cursor-pointer hover:border-emerald-500 focus:outline-none">
                <span className="flex items-center space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    <span className="font-medium text-gray-400">
                        {isUploading ? "Processando..." : "Solte o arquivo club-analyzer.csv aqui ou clique para buscar"}
                    </span>
                </span>
                <input type="file" accept=".csv" className="hidden" onChange={handleFileUpload} disabled={isUploading} />
            </label>
            <div className="text-xs font-semibold px-2 py-1 rounded bg-black border border-gray-800 text-gray-400 max-w-fit">
              Status: <span className={uploadStatus === "Sincronizado" ? "text-emerald-400" : "text-yellow-400"}>{uploadStatus}</span>
            </div>
          </div>

          {/* Ativos Contábeis (Input Manual) */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-sm mb-6 flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-widest border-b border-gray-800 pb-2">Ativos Contábeis (Input Manual)</h3>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-400 mb-1">FC Coins</label>
                <input type="number" value={coins} onChange={e => setCoins(e.target.value)} className="w-full bg-gray-950 border border-gray-800 rounded p-2 text-gray-200 focus:outline-none focus:border-emerald-500" placeholder="Ex: 50000" />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-400 mb-1">FC Points</label>
                <input type="number" value={points} onChange={e => setPoints(e.target.value)} className="w-full bg-gray-950 border border-gray-800 rounded p-2 text-gray-200 focus:outline-none focus:border-emerald-500" placeholder="Ex: 100" />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-400 mb-1">Fichas / Tokens</label>
                <input type="number" value={tokens} onChange={e => setTokens(e.target.value)} className="w-full bg-gray-950 border border-gray-800 rounded p-2 text-gray-200 focus:outline-none focus:border-emerald-500" placeholder="Ex: 3" />
              </div>
              <div className="flex items-end">
                <button onClick={handleSyncVault} className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2 px-4 rounded transition-colors h-10 flex items-center justify-center min-w-[140px]">
                  {vaultStatus === "Sincronizando..." ? "Aguarde..." : "Sincronizar Cofre"}
                </button>
              </div>
            </div>
            {vaultStatus && vaultStatus !== "Sincronizando..." && (
              <div className={`text-xs mt-1 ${vaultStatus === "Sincronizado" ? "text-emerald-400" : "text-red-400"}`}>
                {vaultStatus === "Sincronizado" ? "✔ Atualizado com sucesso." : "✖ Falha na sincronização."}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Status da Sincronização</h3>
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"></path></svg>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${uploadStatus === "Sincronizado" ? "bg-emerald-500" : uploadStatus === "Processando..." ? "bg-blue-500" : uploadStatus === "Aguardando" ? "bg-yellow-500" : "bg-red-500"}`}></div>
                <span className="text-lg font-bold text-gray-100">{uploadStatus}</span>
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Duplicatas Inegociáveis</h3>
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-white">{duplicatedCards}</span>
                <span className="text-sm text-gray-500 font-medium">assets</span>
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Total de Ativos Mapeados</h3>
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-white">{totalCards}</span>
                <span className="text-sm text-gray-500 font-medium">assets</span>
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Último Upsert DB</h3>
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-gray-100">{lastSync}</span>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
