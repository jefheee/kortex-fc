import { NextResponse } from 'next/server';
import { supabase } from '../../../utils/supabase';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(request: Request) {
  try {
    const rawData = await request.json();
    const userId = "usuario-padrao-uuid";

    const items = Array.isArray(rawData) ? rawData : rawData?.itemData || [];
    
    if (!items || items.length === 0) {
      return NextResponse.json(
        { message: 'Nenhum dado válido para ingestão.' },
        { status: 400, headers: corsHeaders }
      );
    }

    const recordsToUpsert = items.map((item: any) => ({
      user_id: userId,
      player_id: Number(item.id),
      asset_id: item.assetId ? Number(item.assetId) : null,
      is_untradeable: Boolean(item.untradeable),
      is_duplicate: Boolean(item.duplicate)
    }));

    const { error } = await supabase
      .from('User_Inventory')
      .upsert(recordsToUpsert);

    if (error) {
      console.error('[Kortex API] Erro ao gravar dados no Supabase:', error);
      return NextResponse.json(
        { message: 'Falha na persistência de dados no banco.' },
        { status: 500, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      { message: 'Sucesso: Dados de inventário salvos.', count: recordsToUpsert.length },
      { status: 200, headers: corsHeaders }
    );
    
  } catch (error) {
    console.error('[Kortex API] Falha severa no endpoint:', error);
    return NextResponse.json(
      { message: 'Falha interna no servidor.' },
      { status: 500, headers: corsHeaders }
    );
  }
}
