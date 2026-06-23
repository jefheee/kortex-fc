export function getFallbackCard(rating: number | null): string {
  const safeRating = rating || 0;
  if (safeRating >= 75) return '/fc-26-clean-card-designs/gold-rare.png';
  if (safeRating >= 65) return '/fc-26-clean-card-designs/silver-rare.png';
  return '/fc-26-clean-card-designs/bronze-rare.png';
}

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
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  if (safeName) {
    return `${safeName}.png`;
  }

  return 'default.png';
}

export function formatPlayerName(player: any): string {
  const country = player?.country?.toUpperCase() || '';
  const rarity = player?.rarity?.toUpperCase() || '';
  const name = player?.name?.trim();
  const lastname = player?.lastname?.trim();

  // Exceções famosas
  if (lastname === 'Arantes Nascimento') return 'Pelé';
  if (lastname === 'Nazário de Lima') return 'Ronaldo';
  if (lastname === 'de Assis Moreira') return 'Ronaldinho';
  if (lastname === 'dos Santos Aveiro') return 'Cristiano Ronaldo';

  if (country === 'BRAZIL' || country === 'PORTUGAL' || rarity.includes('ICON') || rarity.includes('HERO')) {
    return name || lastname || 'Desconhecido';
  }

  return lastname || name || 'Desconhecido';
}
