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
    const headers = headerLine.split(',');

    const idIndex = headers.indexOf('Id');
    const untradeableIndex = headers.indexOf('Untradeable');
    const locationIndex = headers.indexOf('Location');
    
    // Novas colunas
    const nameIndex = headers.indexOf('Name');
    const ratingIndex = headers.indexOf('Rating');
    const posIndex = headers.indexOf('Position');
    const rarityIndex = headers.indexOf('Rarity');
    const countryIndex = headers.indexOf('Country');
    const leagueIndex = headers.indexOf('League');
    const clubIndex = headers.indexOf('Club');

    if (idIndex === -1) {
      return NextResponse.json({ message: 'Coluna Id não encontrada.' }, { status: 400 });
    }

    const recordsToUpsert = [];
    let duplicates = 0;

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].replace(/\r/g, '');
      if (!line.trim()) continue;

      const cols = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
      
      const rawId = cols[idIndex]?.replace(/"/g, '')?.trim();
      const rawUntradeable = untradeableIndex !== -1 ? cols[untradeableIndex]?.replace(/"/g, '')?.trim() : 'false';
      const rawLocation = locationIndex !== -1 ? cols[locationIndex]?.replace(/"/g, '')?.trim() : '';

      if (!rawId || isNaN(Number(rawId))) continue;

      const player_id = Number(rawId);
      const is_untradeable = (rawUntradeable.toLowerCase() === 'true' || rawUntradeable === '1');
      const is_duplicate = (rawLocation.toUpperCase() === 'SBCSTORAGE');

      if (is_duplicate) duplicates++;

      // Extração de metadados
      const name = nameIndex !== -1 ? cols[nameIndex]?.replace(/"/g, '')?.trim() : null;
      const rawRating = ratingIndex !== -1 ? cols[ratingIndex]?.replace(/"/g, '')?.trim() : null;
      const rating = rawRating ? parseInt(rawRating, 10) : null;
      const position = posIndex !== -1 ? cols[posIndex]?.replace(/"/g, '')?.trim() : null;
      const rarity = rarityIndex !== -1 ? cols[rarityIndex]?.replace(/"/g, '')?.trim() : null;
      const country = countryIndex !== -1 ? cols[countryIndex]?.replace(/"/g, '')?.trim() : null;
      const league = leagueIndex !== -1 ? cols[leagueIndex]?.replace(/"/g, '')?.trim() : null;
      const club = clubIndex !== -1 ? cols[clubIndex]?.replace(/"/g, '')?.trim() : null;

      recordsToUpsert.push({
        user_id: userId,
        player_id: player_id,
        is_untradeable: is_untradeable,
        is_duplicate: is_duplicate,
        asset_id: null,
        name,
        rating: isNaN(rating as any) ? null : rating,
        position,
        rarity,
        country,
        league,
        club
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
