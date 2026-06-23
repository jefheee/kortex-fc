import os
import uvicorn
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from core_solver import solve_sbc
from supabase import create_client, Client
from dotenv import load_dotenv

# INSTRUÇÃO: É necessário ter o arquivo .env no root do solver 
# contendo as variáveis SUPABASE_URL e SUPABASE_KEY.
load_dotenv()

app = FastAPI(title="Kortex FC - Motor CP-SAT")

SUPABASE_URL = os.environ.get("SUPABASE_URL", "")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY", "")

try:
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
except Exception:
    supabase = None

class SolvePayload(BaseModel):
    target_rating: int

@app.post("/solve")
def solve_endpoint(payload: SolvePayload):
    if not supabase:
        raise HTTPException(status_code=500, detail="Supabase client not initialized. Check env vars.")

    try:
        response = supabase.table('User_Inventory') \
            .select('*') \
            .eq('user_id', '00000000-0000-0000-0000-000000000000') \
            .eq('loans', 0) \
            .execute()
            
        inventory_list = response.data
        
        if not inventory_list:
            raise HTTPException(status_code=422, detail="Inventário vazio ou não encontrado.")

        selected_players = solve_sbc(inventory_list, payload.target_rating)
        
        if not selected_players:
            raise HTTPException(status_code=422, detail="Nenhuma solução viável encontrada.")
            
        return {
            "status": "success",
            "selected_players": selected_players,
            "message": "Otimização concluída."
        }
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
