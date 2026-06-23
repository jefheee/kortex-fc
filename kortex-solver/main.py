from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from core_solver import solve_sbc

app = FastAPI(title="Kortex FC - Oráculo CP-SAT")

class SolveRequest(BaseModel):
    inventory: list
    constraints: dict

@app.post("/solve")
def solve_sbc_route(request: SolveRequest):
    try:
        selected_players = solve_sbc(request.inventory, request.constraints)
        return {
            "status": "success",
            "selected_players": selected_players,
            "message": "Operação concluída com sucesso."
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
