export function getCardDesign(rarity: string | null, rating: number | null): string {
  if (!rarity) return 'default.png';

  const lowerRarity = rarity.toLowerCase().trim();
  const safeRating = rating || 0;

  // Lógica Ouro, Prata, Bronze
  if (lowerRarity === 'rare' || lowerRarity === 'common') {
    let type = 'bronze';
    if (safeRating >= 75) type = 'gold';
    else if (safeRating >= 65) type = 'silver';
    
    return `${type}-${lowerRarity}.png`;
  }

  // Eventos
  const safeName = lowerRarity
    .replace(/[^a-z0-9\s:-]/g, '') // Remove caracteres especiais
    .replace(/[\s:]+/g, '-')       // Troca espaços e dois-pontos por hífen
    .replace(/-+/g, '-')           // Remove hífens duplicados
    .replace(/^-|-$/g, '');        // Remove hífen das extremidades

  if (safeName) {
    return `${safeName}.png`;
  }

  return 'default.png';
}
