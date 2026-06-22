// utils/adapter.ts
import { InventoryItem, UserInventoryRecord } from '../types/inventory';

/**
 * Função Adapter
 * Recebe o payload bruto e mapeia os campos para o formato interno do Supabase
 */
export function adaptInventoryData(rawData: any, userId: string): UserInventoryRecord[] {
  try {
    // Isola o array de itens, lidando com diferentes formatos de resposta de APIs
    const items: InventoryItem[] = Array.isArray(rawData) ? rawData : rawData?.itemData || [];

    if (!items || items.length === 0) {
      return [];
    }

    return items.map((item) => ({
      UserId: userId,
      PlayerId: String(item.id),
      IsUntradeable: Boolean(item.untradeable),
      IsDuplicate: Boolean(item.duplicate)
    }));
  } catch (error) {
    console.error('[Kortex API Adapter] Falha ao adaptar dados brutos:', error);
    return [];
  }
}
