export function getFallbackCard(rating: number | null): string {
  const safeRating = rating || 0;
  if (safeRating >= 75) return '/fc-26-clean-card-designs/gold-rare.png';
  if (safeRating >= 65) return '/fc-26-clean-card-designs/silver-rare.png';
  return '/fc-26-clean-card-designs/bronze-rare.png';
}

const CARD_DESIGNS = ["answer-the-call.png", "bronze-non-rare.png", "bronze-rare.png", "captains-icon.png", "champion-icon.png", "champions.png", "classic-xi-hero.png", "cornerstones.png", "debut-icon.png", "ecl-champion-icon.png", "end-of-era.png", "evolution-i.png", "evolution-ii.png", "fantasy-fc-hero.png", "fantasy-fc.png", "fantasy-premier-league.png", "fc-pro-leagues-live.png", "fc-pro-open-champion-icon.png", "fc-pro.png", "festival-of-football-captains.png", "festival-of-football-icon.png", "flashback.png", "fut-birthday-evo.png", "fut-birthday-hero.png", "fut-birthday-icon.png", "fut-birthday.png", "future-stars-academy-evo.png", "future-stars-evo.png", "future-stars-hero.png", "future-stars-icon.png", "future-stars.png", "gold-non-rare.png", "gold-rare.png", "greats-of-the-game-hero.png", "greats-of-the-game-icon.png", "heroes.png", "icon-swaps-1-token.png", "icon-swaps.png", "icon.png", "joga-bonito-hero.png", "joga-bonito.png", "journey-of-nations.png", "knockout-royalty-hero.png", "knockout-royalty-icon.png", "knockout-royalty.png", "live-event-excellence.png", "moments.png", "national-pride-red.png", "national-pride.png", "path-to-glory.png", "potm-bundesliga.png", "potm-la-liga.png", "potm-liga-f.png", "potm-ligue-1.png", "potm-premier-league.png", "potm-serie-a.png", "premium-world-tour.png", "prime-heroes.png", "ratings-reload.png", "season-ladder.png", "showdown-base.png", "showdown-final-winner.png", "showdown-plus-base.png", "showdown-plus-upgraded.png", "silver-non-rare.png", "silver-rare.png", "squad-foundations.png", "star-performer-hero-or-evo.png", "star-performer.png", "team-of-the-season.png", "team-of-the-week.png", "thunderstruck-icon.png", "thunderstruck.png", "time-warp-icon.png", "time-warp.png", "tots-champions.png", "tots-evo.png", "tots-evolution.png", "tots-highlights.png", "tots-honourable-mentions.png", "toty-evolution.png", "toty-hm-heroes.png", "toty-honourable-mention.png", "toty-icon.png", "toty.png", "trophy-titans-evo.png", "trophy-titans-hero.png", "trophy-titans-icon.png", "ucl-primetime-heroes.png", "ucl-primetime.png", "ucl-road-to-the-finals.png", "uecl-primetime.png", "uecl-road-to-the-finals.png", "uel-primetime.png", "uel-road-to-the-finals.png", "ultimate-scream-hero.png", "ultimate-scream.png", "unbreakables-evolution.png", "unbreakables-hero.png", "unbreakables-icon.png", "unbreakables.png", "uwcl-primetime-heroes.png", "uwcl-primetime.png", "uwcl-road-to-the-finals.png", "virtual-bundesliga.png", "winter-wildcards-hero-sbc.png", "winter-wildcards-hero.png", "winter-wildcards-icon-sbc.png", "winter-wildcards-icon.png", "winter-wildcards-sbc.png", "winter-wildcards.png", "world-tour-evolution.png", "world-tour-silver-stars.png", "world-tour.png"];

function levenshteinDistance(a: string, b: string): number {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          Math.min(
            matrix[i][j - 1] + 1, // insertion
            matrix[i - 1][j] + 1 // deletion
          )
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

export function getCardDesign(rarity: string | null, rating: number | null): string {
  const safeRating = rating || 0;
  let fallback = 'bronze-rare.png';
  if (safeRating >= 75) fallback = 'gold-rare.png';
  else if (safeRating >= 65) fallback = 'silver-rare.png';

  if (!rarity) return fallback;

  const lowerRarity = rarity.toLowerCase().trim();

  // Lógica Ouro, Prata, Bronze
  if (lowerRarity.includes('rare') || lowerRarity.includes('common')) {
    const isRare = lowerRarity.includes('rare');
    const suffix = isRare ? 'rare' : 'non-rare';
    
    let type = 'bronze';
    if (safeRating >= 75) type = 'gold';
    else if (safeRating >= 65) type = 'silver';
    
    return `${type}-${suffix}.png`;
  }

  // Eventos Fuzzy
  const safeName = lowerRarity
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  let bestMatch = fallback;
  let minDistance = Infinity;

  for (const design of CARD_DESIGNS) {
    const designBase = design.replace('.png', '');
    
    if (safeName.includes(designBase) || designBase.includes(safeName)) {
      const dist = levenshteinDistance(safeName, designBase);
      const artificialDist = dist - 100;
      if (artificialDist < minDistance) {
        minDistance = artificialDist;
        bestMatch = design;
      }
    } else {
      const dist = levenshteinDistance(safeName, designBase);
      if (dist < minDistance) {
        minDistance = dist;
        bestMatch = design;
      }
    }
  }

  return bestMatch;
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
