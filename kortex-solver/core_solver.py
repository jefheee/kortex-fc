from ortools.sat.python import cp_model

class KortexSolver:
    def __init__(self):
        self.model = cp_model.CpModel()

    def solve_sbc(self, inventory: list, constraints_dict: dict) -> list:
        num_players = len(inventory)
        if num_players < 11:
            return []

        # Declara as variáveis booleanas de seleção
        x = {i: self.model.NewBoolVar(f"x_{i}") for i in range(num_players)}

        # Restrição de tamanho obrigatório de plantel
        self.model.Add(sum(x[i] for i in range(num_players)) == 11)

        # Restrição simulada de química: no mínimo 5 cartas devem possuir o mesmo ID de liga
        leagues = set(player.get('league_id') for player in inventory if player.get('league_id') is not None)
        league_bools = []

        for league in leagues:
            b = self.model.NewBoolVar(f"league_{league}_active")
            league_sum = sum(x[i] for i in range(num_players) if inventory[i].get('league_id') == league)
            
            self.model.Add(league_sum >= 5).OnlyEnforceIf(b)
            self.model.Add(league_sum < 5).OnlyEnforceIf(b.Not())
            
            league_bools.append(b)

        if league_bools:
            self.model.Add(sum(league_bools) >= 1)

        # Invocação do solver
        solver = cp_model.CpSolver()
        status = solver.Solve(self.model)

        if status == cp_model.OPTIMAL or status == cp_model.FEASIBLE:
            return [inventory[i]['player_id'] for i in range(num_players) if solver.Value(x[i])]
        
        return []
