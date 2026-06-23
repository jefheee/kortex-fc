import { NextResponse } from 'next/server';
import { supabase } from '../../../utils/supabase';

export async function POST(request: Request) {
  try {
    const { csvData } = await request.json();
    if (!csvData || typeof csvData !== 'string') {
      return NextResponse.json({ message: 'Nenhum dado CSV enviado.' }, { status: 400 });
    }

    const userId = "usuario-padrao-uuid";

    // Parser simples do CSV
    const lines = csvData.split('\n');
    if (lines.length < 2) {
      return NextResponse.json({ message: 'Arquivo CSV vazio ou sem dados.' }, { status: 400 });
    }

    const headerLine = lines[0].replace(/\r/g, '');
    const headers = headerLine.split(',');

    const idIndex = headers.indexOf('Id');
    const untradeableIndex = headers.indexOf('Untradeable');
    const locationIndex = headers.indexOf('Location');

    if (idIndex === -1) {
      return NextResponse.json({ message: 'Coluna Id não encontrada.' }, { status: 400 });
    }

    const recordsToUpsert = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].replace(/\r/g, '');
      if (!line.trim()) continue;

      // regex rudimentar para lidar com vírgulas dentro de aspas no CSV
      const cols = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
      
      const rawId = cols[idIndex]?.replace(/"/g, '')?.trim();
      const rawUntradeable = untradeableIndex !== -1 ? cols[untradeableIndex]?.replace(/"/g, '')?.trim() : 'false';
      const rawLocation = locationIndex !== -1 ? cols[locationIndex]?.replace(/"/g, '')?.trim() : '';

      if (!rawId || isNaN(Number(rawId))) continue;

      const player_id = Number(rawId);
      const is_untradeable = (rawUntradeable.toLowerCase() === 'true' || rawUntradeable === '1');
      const is_duplicate = (rawLocation.toUpperCase() === 'SBCSTORAGE');

      recordsToUpsert.push({
        user_id: userId,
        player_id: player_id,
        is_untradeable: is_untradeable,
        is_duplicate: is_duplicate,
        asset_id: null
      });
    }

    if (recordsToUpsert.length === 0) {
      return NextResponse.json({ message: 'Nenhum registro válido extraído do CSV.' }, { status: 400 });
    }

    const { error } = await supabase
      .from('User_Inventory')
      .upsert(recordsToUpsert);

    if (error) {
      console.error('[Kortex API CSV Parser] Erro no Upsert Supabase:', error);
      return NextResponse.json({ message: 'Erro ao gravar os dados.' }, { status: 500 });
    }

    return NextResponse.json({ message: 'CSV processado com sucesso!', count: recordsToUpsert.length }, { status: 200 });
  } catch (err) {
    console.error('[Kortex API CSV Parser] Falha geral:', err);
    return NextResponse.json({ message: 'Erro interno no processamento do CSV.' }, { status: 500 });
  }
}
