from ortools.sat.python import cp_model

def solve_sbc(inventory: list, constraints: dict) -> list:
    """
    Motor base para resolução de DMEs (PLI) usando o CP-SAT Solver.
    """
    model = cp_model.CpModel()

    if not inventory or len(inventory) < 11:
        return []

    # Dicionário para armazenar a variável booleana de decisão para cada carta
    player_vars = {}
    for item in inventory:
        player_id = item.get('player_id')
        player_vars[player_id] = model.NewBoolVar(f'player_{player_id}')

    # Restrição base: Exatamente 11 jogadores devem ser selecionados
    model.Add(sum(player_vars[player_id] for player_id in player_vars) == 11)

    # TODO: Implementar matriz completa do Fator de Correção (CF) da EA.
    # TODO: Implementar método Big-M para química e rating global da squad.

    # Configuração e inicialização do solucionador
    solver = cp_model.CpSolver()
    status = solver.Solve(model)

    if status == cp_model.OPTIMAL or status == cp_model.FEASIBLE:
        selected_ids = [pid for pid in player_vars if solver.Value(player_vars[pid])]
        return selected_ids

    return []
