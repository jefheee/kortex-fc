import { NextResponse } from 'next/server';
import { supabase } from '../../../utils/supabase';

export async function POST(request: Request) {
  try {
    const { coins, points, tokens } = await request.json();
    const userId = "00000000-0000-0000-0000-000000000000";

    const { error } = await supabase.from('Club_Meta').upsert({
      user_id: userId,
      coins: parseInt(coins) || 0,
      points: parseInt(points) || 0,
      tokens: parseInt(tokens) || 0,
      last_sync: new Date().toISOString()
    }, { onConflict: 'user_id' });

    if (error) {
      return NextResponse.json({ message: 'Erro ao sincronizar cofre.' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Cofre sincronizado com sucesso.' }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: 'Erro interno.' }, { status: 500 });
  }
}
