from ortools.sat.python import cp_model
from fastapi import HTTPException

def solve_sbc(inventory: list, target_rating: int) -> list:
    if len(inventory) < 11:
        raise HTTPException(status_code=422, detail="Inventário possui menos de 11 cartas.")

    model = cp_model.CpModel()
    
    # Variáveis de Decisão Booleanas
    x = [model.NewBoolVar(f"x_{i}") for i in range(len(inventory))]
    
    # Restrição 1 (Tamanho Exato)
    model.Add(sum(x) == 11)
    
    # Restrição 2 (Rating Alvo - MVP)
    model.Add(sum(x[i] * inventory[i].get('rating', 0) for i in range(len(inventory))) >= target_rating * 11)
    
    # Estruturação de Pesos para Minimização
    costs = []
    for player in inventory:
        is_duplicate = player.get('is_duplicate', False)
        is_untradeable = player.get('is_untradeable', False)
        rating = player.get('rating', 0)
        
        if is_duplicate:
            costs.append(-100000)
        elif is_untradeable:
            costs.append(0)
        else:
            costs.append(rating * 1000)
            
    # Aplique o objetivo
    model.Minimize(sum(x[i] * costs[i] for i in range(len(inventory))))
    
    # Invoque o Solver
    solver = cp_model.CpSolver()
    status = solver.Solve(model)
    
    if status == cp_model.OPTIMAL or status == cp_model.FEASIBLE:
        selected_players = [inventory[i] for i in range(len(inventory)) if solver.Value(x[i])]
        return selected_players
    
    raise HTTPException(status_code=422, detail="Nenhuma solução viável encontrada.")
