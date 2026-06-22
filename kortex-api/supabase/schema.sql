-- Tabela 1: Club_Meta
CREATE TABLE public."Club_Meta" (
    user_id UUID PRIMARY KEY,
    coins INTEGER NOT NULL DEFAULT 0,
    points INTEGER NOT NULL DEFAULT 0,
    last_sync TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela 2: User_Inventory
CREATE TABLE public."User_Inventory" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public."Club_Meta"(user_id) ON DELETE CASCADE,
    player_id BIGINT NOT NULL,
    asset_id BIGINT,
    is_untradeable BOOLEAN NOT NULL DEFAULT FALSE,
    is_duplicate BOOLEAN NOT NULL DEFAULT FALSE
);

-- Índice de Performance para Otimização CP-SAT
CREATE INDEX idx_user_inventory_opt 
ON public."User_Inventory" (user_id, is_duplicate, is_untradeable);
