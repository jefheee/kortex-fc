// types/inventory.ts

export interface InventoryItem {
  id: string;
  rating: number;
  nationId: number;
  leagueId: number;
  untradeable: boolean;
  duplicate?: boolean;
}

export interface UserInventoryRecord {
  UserId: string;
  PlayerId: string;
  IsUntradeable: boolean;
  IsDuplicate: boolean;
}
