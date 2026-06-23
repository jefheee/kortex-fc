import os
import uvicorn
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from core_solver import KortexSolver
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Kortex FC - Motor CP-SAT")

SUPABASE_URL = os.environ.get("SUPABASE_URL", "")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY", "")
try:
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
except Exception:
    supabase = None

class SolvePayload(BaseModel):
    user_id: str = "00000000-0000-0000-0000-000000000000"
    constraints: dict

@app.post("/solve")
def solve_endpoint(payload: SolvePayload):
    try:
        if not supabase:
            raise Exception("Supabase client not initialized. Check env vars.")

        solver = KortexSolver()
        
        response = supabase.table('User_Inventory').select('*').eq('user_id', payload.user_id).execute()
        inventory_list = response.data
        
        if not inventory_list:
            raise Exception("Inventário vazio ou não encontrado para este usuário.")

        selected_ids = solver.solve_sbc(inventory_list, payload.constraints)
        
        return {
            "status": "success",
            "selected_players": selected_ids,
            "message": "Otimização concluída." if selected_ids else "Nenhuma solução viável encontrada."
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
