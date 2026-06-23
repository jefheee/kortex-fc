"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabase';
import { getCardDesign, formatPlayerName, getFallbackCard } from '../../utils/cardMapper';

const ITEMS_PER_PAGE = 50;

export default function InventarioPage() {
  const [inventory, setInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPlayer, setSelectedPlayer] = useState<any | null>(null);

  useEffect(() => {
    async function fetchInventory() {
      const userId = "00000000-0000-0000-0000-000000000000";
      const { data, error } = await supabase
        .from('User_Inventory')
        .select('*')
        .eq('user_id', userId)
        .order('rating', { ascending: false });

      if (error) {
        setError(error.message);
      } else {
        setInventory(data || []);
      }
      setLoading(false);
    }

    fetchInventory();
  }, []);

  const totalPages = Math.ceil((inventory?.length || 0) / ITEMS_PER_PAGE);
  const currentSlice = inventory.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="flex h-screen overflow-hidden bg-black text-gray-100 relative">
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
          {loading ? (
            <div className="p-8 text-center text-gray-400">Carregando telemetria...</div>
          ) : error ? (
            <div className="p-8 text-red-500 bg-gray-900 rounded-xl border border-red-900">
              Erro ao carregar o inventário: {error}
            </div>
          ) : (
            <>
              <div className="mb-6 flex justify-between items-end">
                <div>
                  <h1 className="text-2xl font-bold text-white mb-1">Seu Elenco</h1>
                  <p className="text-sm text-gray-400">Total de {inventory?.length || 0} cartas sincronizadas.</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 mb-8">
                {currentSlice.map((player) => {
                  const imageName = getCardDesign(player.rarity, player.rating);
                  return (
                    <div 
                      key={player.id} 
                      onClick={() => setSelectedPlayer(player)}
                      className="group cursor-pointer relative flex flex-col justify-between p-3 rounded-lg shadow-xl aspect-[2/3] transform transition-transform hover:scale-105 hover:-translate-y-1 overflow-hidden bg-gray-900 border border-gray-800"
                    >
                      <img 
                        src={`/fc-26-clean-card-designs/${imageName}`}
                        alt={formatPlayerName(player)}
                        className="absolute inset-0 z-0 w-full h-full object-cover"
                        onError={(e) => { e.currentTarget.src = getFallbackCard(player.rating); }}
                      />
                      
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors z-0" />
                      
                      <div className="relative z-10 flex flex-col items-start w-full text-white pointer-events-none">
                        <span className="text-3xl font-extrabold leading-none drop-shadow-md">{player.rating || '--'}</span>
                        <span className="text-sm font-semibold tracking-wider mt-1 drop-shadow-md">{player.position || 'N/A'}</span>
                      </div>
                      
                      <div className="relative z-10 flex flex-col w-full text-center mt-auto pb-1 text-white pointer-events-none">
                        <span className="text-[15px] font-bold uppercase tracking-tight truncate w-full px-1 pb-1 drop-shadow-md">
                          {formatPlayerName(player)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-between py-4 border-t border-gray-900 mt-4">
                  <button 
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed rounded border border-gray-800 font-medium transition-colors"
                  >
                    Anterior
                  </button>
                  <span className="text-sm text-gray-400 font-medium">Página {currentPage} de {totalPages}</span>
                  <button 
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed rounded border border-gray-800 font-medium transition-colors"
                  >
                    Próximo
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {selectedPlayer && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-950 border border-gray-800 rounded-2xl w-full max-w-4xl shadow-2xl relative flex flex-col max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-gray-900">
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                <span className="text-3xl">{selectedPlayer.rating}</span>
                {formatPlayerName(selectedPlayer)}
                <span className="text-sm font-normal text-emerald-400 px-2 py-0.5 rounded bg-emerald-400/10 border border-emerald-400/20">{selectedPlayer.rarity}</span>
              </h2>
              <button 
                onClick={() => setSelectedPlayer(null)}
                className="text-gray-400 hover:text-white bg-gray-900 hover:bg-gray-800 p-2 rounded-full transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Identificação */}
                <div className="bg-gray-900/50 p-5 rounded-xl border border-gray-800/50">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest border-b border-gray-800 pb-2 mb-3">Identificação</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-gray-400">Player ID</span><span className="text-gray-200 font-mono">{selectedPlayer.player_id}</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">Name</span><span className="text-gray-200">{selectedPlayer.name || '-'}</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">Lastname</span><span className="text-gray-200">{selectedPlayer.lastname || '-'}</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">Country</span><span className="text-gray-200">{selectedPlayer.country || '-'}</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">League</span><span className="text-gray-200">{selectedPlayer.league || '-'}</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">Club</span><span className="text-gray-200">{selectedPlayer.club || '-'}</span></div>
                  </div>
                </div>

                {/* Atributos In-Game */}
                <div className="bg-gray-900/50 p-5 rounded-xl border border-gray-800/50">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest border-b border-gray-800 pb-2 mb-3">Atributos In-Game</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-gray-400">Rating</span><span className="text-emerald-400 font-bold">{selectedPlayer.rating}</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">Position</span><span className="text-gray-200 font-bold">{selectedPlayer.position}</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">Skill Moves</span><span className="text-gray-200">{selectedPlayer.skill_moves}</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">Weak Foot</span><span className="text-gray-200">{selectedPlayer.weak_foot}</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">Chemistry Style</span><span className="text-gray-200">{selectedPlayer.chemistry || '-'}</span></div>
                  </div>
                </div>

                {/* Desempenho */}
                <div className="bg-gray-900/50 p-5 rounded-xl border border-gray-800/50">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest border-b border-gray-800 pb-2 mb-3">Desempenho</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-gray-400">Games Played</span><span className="text-gray-200">{selectedPlayer.games_played || 0}</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">Goals</span><span className="text-gray-200">{selectedPlayer.goals || 0}</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">Assists</span><span className="text-gray-200">{selectedPlayer.assists || 0}</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">Yellow Cards</span><span className="text-gray-200">{selectedPlayer.yellow_cards || 0}</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">Red Cards</span><span className="text-gray-200">{selectedPlayer.red_cards || 0}</span></div>
                  </div>
                </div>

                {/* Mercado */}
                <div className="bg-gray-900/50 p-5 rounded-xl border border-gray-800/50">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest border-b border-gray-800 pb-2 mb-3">Mercado</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-gray-400">Untradeable</span><span className={selectedPlayer.is_untradeable ? "text-red-400" : "text-emerald-400"}>{selectedPlayer.is_untradeable ? 'Sim' : 'Não'}</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">Location</span><span className="text-gray-200">{selectedPlayer.location || '-'}</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">Duplicate</span><span className={selectedPlayer.is_duplicate ? "text-yellow-400" : "text-gray-200"}>{selectedPlayer.is_duplicate ? 'Sim' : 'Não'}</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">Bought For</span><span className="text-yellow-400 font-medium">{selectedPlayer.bought_for || 0}</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">Discard Value</span><span className="text-yellow-400 font-medium">{selectedPlayer.discard_value || 0}</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">Market Average</span><span className="text-yellow-400 font-medium">{selectedPlayer.market_average || 0}</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">Price Range</span><span className="text-gray-200">{selectedPlayer.price_range || '-'}</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">Loans</span><span className="text-gray-200">{selectedPlayer.loans || 0}</span></div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
