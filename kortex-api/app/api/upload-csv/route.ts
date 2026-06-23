import { NextResponse } from 'next/server';
import { supabase } from '../../../utils/supabase';

export async function POST(request: Request) {
  try {
    const { csvData } = await request.json();
    if (!csvData || typeof csvData !== 'string') {
      return NextResponse.json({ message: 'Nenhum dado CSV enviado.' }, { status: 400 });
    }

    const userId = "00000000-0000-0000-0000-000000000000";

    await supabase.from('Club_Meta').upsert({ 
      user_id: userId, 
      coins: 0, 
      points: 0, 
      tokens: 0,
      last_sync: new Date().toISOString() 
    }, { onConflict: 'user_id' });

    const lines = csvData.split('\n');
    if (lines.length < 2) {
      return NextResponse.json({ message: 'Arquivo CSV vazio ou sem dados.' }, { status: 400 });
    }

    const headerLine = lines[0].replace(/\r/g, '');
    const headers = headerLine.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(h => h.replace(/^"|"$/g, '').trim());

    const getIndex = (name: string) => {
      const idx = headers.indexOf(name);
      if (idx !== -1) return idx;
      // try without spaces
      return headers.indexOf(name.replace(/\s+/g, ''));
    };

    const idIndex = getIndex('Id');
    if (idIndex === -1) {
      return NextResponse.json({ message: 'Coluna Id não encontrada.' }, { status: 400 });
    }

    const lastnameIndex = getIndex('Lastname');
    const nameIndex = getIndex('Name');
    const ratingIndex = getIndex('Rating');
    const positionIndex = getIndex('Position');
    const rarityIndex = getIndex('Rarity');
    const skillMovesIndex = getIndex('Skill Moves');
    const weakFootIndex = getIndex('Weak Foot');
    const chemistryIndex = getIndex('Chemistry');
    const countryIndex = getIndex('Country');
    const leagueIndex = getIndex('League');
    const clubIndex = getIndex('Club');
    const untradeableIndex = getIndex('Untradeable');
    const loansIndex = getIndex('Loans');
    const boughtForIndex = getIndex('Bought For');
    const priceRangeIndex = getIndex('Price Range');
    const discardValueIndex = getIndex('Discard Value');
    const marketAverageIndex = getIndex('Market Average');
    const gamesPlayedIndex = getIndex('Games Played');
    const goalsIndex = getIndex('Goals');
    const assistsIndex = getIndex('Assists');
    const yellowCardsIndex = getIndex('Yellow Cards');
    const redCardsIndex = getIndex('Red Cards');
    const priceUpdatedAtIndex = getIndex('Price Updated At');
    const locationIndex = getIndex('Location');

    const positionMap: Record<string, string> = { "0":"GK", "2":"RWB", "3":"RB", "5":"CB", "7":"LB", "8":"LWB", "10":"CDM", "14":"CM", "12":"RM", "16":"LM", "18":"CAM", "21":"CF", "23":"ST", "25":"RW", "27":"LW" };

    const recordsToUpsert = [];
    let duplicates = 0;

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].replace(/\r/g, '');
      if (!line.trim()) continue;

      const cols = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);

      const getStr = (index: number) => {
        if (index === -1 || cols[index] === undefined) return null;
        const val = cols[index].replace(/^"|"$/g, '').trim();
        return val === "" ? null : val;
      };
      
      const getInt = (index: number) => {
        const str = getStr(index);
        if (!str) return 0;
        const parsed = parseInt(str, 10);
        return isNaN(parsed) ? 0 : parsed;
      };
      
      const rawId = getStr(idIndex);
      if (!rawId || isNaN(Number(rawId))) continue;

      const player_id = Number(rawId);
      
      const rawUntradeable = getStr(untradeableIndex);
      const is_untradeable = rawUntradeable ? (rawUntradeable.toLowerCase() === 'true' || rawUntradeable === '1') : false;
      
      const rawLocation = getStr(locationIndex);
      const is_duplicate = rawLocation ? (rawLocation.toUpperCase() === 'SBCSTORAGE') : false;

      if (is_duplicate) duplicates++;

      const rawPosition = getStr(positionIndex);
      const parsedPosition = rawPosition ? (positionMap[rawPosition] || rawPosition) : null;

      recordsToUpsert.push({
        user_id: userId,
        player_id: player_id,
        lastname: getStr(lastnameIndex),
        name: getStr(nameIndex),
        rating: getInt(ratingIndex),
        position: parsedPosition,
        rarity: getStr(rarityIndex),
        skill_moves: getInt(skillMovesIndex),
        weak_foot: getInt(weakFootIndex),
        chemistry: getStr(chemistryIndex),
        country: getStr(countryIndex),
        league: getStr(leagueIndex),
        club: getStr(clubIndex),
        is_untradeable: is_untradeable,
        loans: getInt(loansIndex),
        bought_for: getInt(boughtForIndex),
        price_range: getStr(priceRangeIndex),
        discard_value: getInt(discardValueIndex),
        market_average: getInt(marketAverageIndex),
        games_played: getInt(gamesPlayedIndex),
        goals: getInt(goalsIndex),
        assists: getInt(assistsIndex),
        yellow_cards: getInt(yellowCardsIndex),
        red_cards: getInt(redCardsIndex),
        price_updated_at: getStr(priceUpdatedAtIndex),
        location: rawLocation,
        is_duplicate: is_duplicate
      });
    }

    if (recordsToUpsert.length === 0) {
      return NextResponse.json({ message: 'Nenhum registro válido extraído do CSV.' }, { status: 400 });
    }

    await supabase.from('User_Inventory').delete().eq('user_id', userId);

    const { error } = await supabase
      .from('User_Inventory')
      .upsert(recordsToUpsert);

    if (error) {
      console.error('[Kortex API CSV Parser] Erro no Upsert Supabase:', error);
      return NextResponse.json({ message: 'Erro ao gravar os dados.' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Sucesso', count: recordsToUpsert.length, duplicatedCount: duplicates }, { status: 200 });
  } catch (err) {
    console.error('[Kortex API CSV Parser] Falha geral:', err);
    return NextResponse.json({ message: 'Erro interno no processamento do CSV.' }, { status: 500 });
  }
}
