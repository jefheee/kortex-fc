import React from 'react';
import { supabase } from '../../utils/supabase';
import { getCardDesign } from '../../utils/cardMapper';

export const revalidate = 0; // ensure no caching so data is fresh

export default async function InventarioPage() {
  const userId = "00000000-0000-0000-0000-000000000000";

  const { data: inventory, error } = await supabase
    .from('User_Inventory')
    .select('*')
    .eq('user_id', userId)
    .order('rating', { ascending: false });

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
          <a href="/" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-900 hover:text-emerald-400 font-medium transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
            </svg>
            Visão Geral
          </a>
          <a href="/inventario" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-900 text-emerald-400 font-medium">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
            </svg>
            Inventário Interceptado
          </a>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col h-full bg-gray-950">
        <header className="h-16 border-b border-gray-900 flex items-center px-8 justify-between">
          <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">Kortex FC - Inventário Interceptado</h2>
          <div className="flex items-center gap-2 bg-gray-900 px-3 py-1.5 rounded-full border border-gray-800">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs text-gray-300 font-medium tracking-wider">TELEMETRIA ATIVA</span>
          </div>
        </header>

        <main className="flex-1 p-8 overflow-y-auto">
          {error ? (
            <div className="p-8 text-red-500 bg-gray-900 rounded-xl border border-red-900">
              Erro ao carregar o inventário: {error.message}
            </div>
          ) : (
            <>
              <div className="mb-6 flex justify-between items-end">
                <div>
                  <h1 className="text-2xl font-bold text-white mb-1">Seu Elenco</h1>
                  <p className="text-sm text-gray-400">Total de {inventory?.length || 0} cartas sincronizadas.</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {inventory?.map((player) => {
                  const imageName = getCardDesign(player.rarity, player.rating);
                  return (
                    <div 
                      key={player.id} 
                      className="relative flex flex-col justify-between p-3 rounded-lg shadow-xl aspect-[2/3] transform transition-transform hover:scale-105 hover:-translate-y-1 overflow-hidden bg-gray-900 border border-gray-800"
                      style={{ backgroundImage: `url(/fc-26-clean-card-designs/${imageName})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                    >
                      <div className="absolute inset-0 bg-black/20" /> {/* Overlay opcional para leitura */}
                      
                      <div className="relative z-10 flex flex-col items-start w-full text-white">
                        <span className="text-3xl font-extrabold leading-none drop-shadow-md">{player.rating || '--'}</span>
                        <span className="text-sm font-semibold tracking-wider mt-1 drop-shadow-md">{player.position || 'N/A'}</span>
                      </div>
                      
                      <div className="relative z-10 flex flex-col w-full text-center mt-auto pb-1 text-white">
                        <span className="text-[15px] font-bold uppercase tracking-tight truncate w-full px-1 pb-1 drop-shadow-md">
                          {player.lastname || player.name || 'Desconhecido'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
