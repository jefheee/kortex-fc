// app/api/intercept/route.ts
import { NextResponse } from 'next/server';
import { adaptInventoryData } from '../../../utils/adapter';
import { createClient } from '@supabase/supabase-js';

// Setup do cliente Supabase usando variáveis de ambiente
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mock-supabase-url.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'mock-service-key';
const supabase = createClient(supabaseUrl, supabaseKey);

// Cabeçalhos de CORS (Permitir requisições vindas do navegador/extensão)
const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // Altere para a origem exata em ambiente de produção
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Tratativa para Preflight Requests (CORS OPTIONS)
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(request: Request) {
  try {
    const rawData = await request.json();
    
    // Identificador temporário. Em ambiente real usar JWT ou Auth Header do usuário
    const userId = "usuario-sessao-ativa"; 

    // Adapter: Estrutura os dados brutos interceptados para o modelo de BD local
    const recordsToUpsert = adaptInventoryData(rawData, userId);

    if (recordsToUpsert.length === 0) {
      return NextResponse.json(
        { message: 'Payload vazio ou incompatível.' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Realiza o Upsert no Supabase
    const { data, error } = await supabase
      .from('User_Inventory')
      .upsert(recordsToUpsert, {
        onConflict: 'UserId, PlayerId', // Colunas únicas para resolver o conflito do Upsert
      });

    if (error) {
      console.error('[Kortex API Supabase] Erro ao gravar dados:', error);
      return NextResponse.json(
        { message: 'Falha na persistência de dados', error: error.message },
        { status: 500, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      { message: 'Sucesso: Dados injetados.', count: recordsToUpsert.length },
      { status: 200, headers: corsHeaders }
    );
    
  } catch (error) {
    console.error('[Kortex API Endpoint] Falha severa no recebimento:', error);
    return NextResponse.json(
      { message: 'Falha interna no servidor.' },
      { status: 500, headers: corsHeaders }
    );
  }
}
