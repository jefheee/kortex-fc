import uvicorn
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from core_solver import KortexSolver

app = FastAPI(title="Kortex FC - Motor CP-SAT")

class PlayerItem(BaseModel):
    player_id: int
    rating: int
    league_id: Optional[int] = None
    is_untradeable: Optional[bool] = False
    is_duplicate: Optional[bool] = False

class SolvePayload(BaseModel):
    inventory: List[PlayerItem]
    constraints: dict

@app.post("/solve")
def solve_endpoint(payload: SolvePayload):
    try:
        solver = KortexSolver()
        inventory_list = [item.dict() for item in payload.inventory]
        
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
