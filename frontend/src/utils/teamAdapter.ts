import { ps } from "zod/v4/locales"

export interface TeamStats {
  id: number
  name: string
  goals: {
    home: {
      win: number
      draw: number
      defeats: number
      goals_scored_per_game: number
      goals_conceded_per_game: number
      team_scored_first: number
      opponent_scored_first: number
      total_goal_per_game: number
      over_1_5: number
      over_2_5: number
      over_3_5: number
      both_teams_scored: number
    }
    away: {
      win: number
      draw: number
      defeats: number
      goals_scored_per_game: number
      goals_conceded_per_game: number
      team_scored_first: number
      opponent_scored_first: number
      total_goal_per_game: number
      over_1_5: number
      over_2_5: number
      over_3_5: number
      both_teams_scored: number
    }
  }
  scored_conceded: {
    home: Record<string, number>
    away: Record<string, number>
  }
  rates: {
    home: Record<string, number>
    away: Record<string, number>
  }
  corners_for: {
    home: Record<string, number>
    away: Record<string, number>
  }
  corners_against: {
    home: Record<string, number>
    away: Record<string, number>
  }
  Total_corners: {
    home: Record<string, number>
    away: Record<string, number>
  }
}

export const TEAM_ADAPTERS: Record<string, Record<string, string>> = {
  BL1: {
    'FC Bayern München': 'Bayern Munich',
    'Bayern München': 'Bayern Munich',
    'Bayern': 'Bayern Munich',
    'Borussia Dortmund': 'Dortmund',
    'Bayer 04 Leverkusen': 'Leverkusen',
    'Leverkusen': 'Leverkusen',
    'Eintracht Frankfurt': 'Eintracht Frankfurt',
    'Frankfurt': 'Eintracht Frankfurt',
    'VfB Stuttgart': 'Stuttgart',
    'Stuttgart': 'Stuttgart',
    'RB Leipzig': 'RB Leipzig',
    'Leipzig': 'RB Leipzig',
    'TSG 1899 Hoffenheim': 'Hoffenheim',
    'Hoffenheim': 'Hoffenheim',
    'VfL Wolfsburg': 'Wolfsburg',
    'Wolfsburg': 'Wolfsburg',
    'SC Freiburg': 'Freiburg',
    'Freiburg': 'Freiburg',
    '1. FC Köln': 'Köln',
    'Köln': 'Köln',
    '1. FC Union Berlin': 'Union Berlin',
    'Union Berlin': 'Union Berlin',
    'Borussia Mönchengladbach': 'Mönchengladbach',
    'Mönchengladbach': 'Mönchengladbach',
    'FC Augsburg': 'Augsburg',
    'Augsburg': 'Augsburg',
    'SV Werder Bremen': 'Werder Bremen',
    'Werder Bremen': 'Werder Bremen',
    'Bremen': 'Werder Bremen',
    '1. FSV Mainz 05': 'Mainz 05',
    'Mainz 05': 'Mainz 05',
    'Mainz': 'Mainz 05',
    '1. FC Heidenheim 1846': 'Heidenheim',
    'Heidenheim': 'Heidenheim',
    'FC St. Pauli 1910': 'St. Pauli',
    'St. Pauli': 'St. Pauli',
    'Hamburger SV': 'Hamburger SV',
    'Hamburger': 'Hamburger SV',
    'Hamburg': 'Hamburger SV',
    'VfL Bochum 1848': 'Bochum',
    'Bochum': 'Bochum',
    '1. FC Heidenheim': 'Heidenheim',
    'Holstein Kiel': 'Kiel',
    'Kiel': 'Kiel',
    'SSV Ulm 1846': 'Ulm',
    'Eintracht Braunschweig': 'Braunschweig',
  },
  PL: {
    'Manchester City': 'Manchester City',
    'Man City': 'Manchester City',
    'MCFC': 'Manchester City',
    'Arsenal FC': 'Arsenal',

    'Liverpool FC': 'Liverpool',
    'Liverpool': 'Liverpool',
    'LFC': 'Liverpool',
    'Manchester United': 'Manchester United',
    'Man United': 'Manchester United',
    'Man Utd': 'Manchester United',
    'Manchester Utd': 'Manchester United',
    'MUFC': 'Manchester United',
    'Chelsea FC': 'Chelsea',
    'Chelsea': 'Chelsea',
    'CFC': 'Chelsea',
    'Tottenham Hotspur': 'Tottenham',
    'Tottenham': 'Tottenham',
    'THFC': 'Tottenham',
    'Newcastle United': 'Newcastle',
    'Newcastle': 'Newcastle',
    'Newcastle Utd': 'Newcastle',
    'NUFC': 'Newcastle',
    'Aston Villa': 'Aston Villa',
    'Aston': 'Aston Villa',
    'AVFC': 'Aston Villa',
    'West Ham United': 'West Ham',
    'West Ham': 'West Ham',
    'West Ham Utd': 'West Ham',
    'WHU': 'West Ham',
    'Brighton & Hove Albion': 'Brighton',
    'Brighton': 'Brighton',
    'Brighton & Hove': 'Brighton',
    'Bournemouth': 'Bournemouth',
    'AFC Bournemouth': 'Bournemouth',
    'Brentford FC': 'Brentford',
    'Brentford': 'Brentford',
    'Wolverhampton Wanderers FC': 'Wolverhampton',
    'Crystal Palace': 'Crystal Palace',
    'CPFC': 'Crystal Palace',
    'Fulham FC': 'Fulham',
    'Fulham': 'Fulham',
    'Everton FC': 'Everton',
    'Everton': 'Everton',
    'Nottingham Forest FC': 'Nottm Forest',
    'Leicester City': 'Leicester',
    'Leicester': 'Leicester',
    'LCFC': 'Leicester',
    'Ipswich Town': 'Ipswich',
    'Ipswich': 'Ipswich',
    'Southampton FC': 'Southampton',
    'Southampton': 'Southampton',
    'Soton': 'Southampton',
    'West Bromwich Albion': 'West Brom',
    'Burnley FC': 'Burnley',
    'Luton Town': 'Luton',
    'Luton': 'Luton',
    'Sheffield United': 'Sheffield United',
    'Sheffield': 'Sheffield United',
    'SUFC': 'Sheffield United',
    'Leeds United': 'Leeds',
    'Leeds': 'Leeds',
    'Leeds Utd': 'Leeds',
    'Sunderland': 'Sunderland',
    'Sunderland AFC': 'Sunderland',
  },
  PD: {
    'Real Madrid': 'Real Madrid',
    'Real': 'Real Madrid',
    'FC Barcelona': 'Barcelona',
    'Barcelona': 'Barcelona',
    'Barça': 'Barcelona',
    'Club Barcelona': 'Barcelona',
    'Atlético de Madrid': 'Atlético Madrid',
    'Atletico Madrid': 'Atlético Madrid',
    'Club Atlético de Madrid': 'Atlético Madrid',
    'Real Sociedad': 'Real Sociedad',
    'Sociedad': 'Real Sociedad',
    'Athletic Club': 'Athletic Bilbao',
    'Athletic Bilbao': 'Athletic Bilbao',
    'Athletic': 'Athletic Bilbao',
    'Villarreal CF': 'Villarreal',
    'Villarreal': 'Villarreal',
    'Sevilla FC': 'Sevilla',
    'Sevilla': 'Sevilla',
    'Real Betis': 'Betis',
    'Betis': 'Betis',
    'Girona FC': 'Girona',
    'Girona': 'Girona',
    'CA Osasuna': 'Osasuna',
    'Osasuna': 'Osasuna',
    'Valencia CF': 'Valencia',
    'Valencia': 'Valencia',
    'RCD Mallorca': 'Mallorca',
    'Mallorca': 'Mallorca',
    'Deportivo Alavés': 'Alavés',
    'Alavés': 'Alavés',
    'Alaves': 'Alavés',
    'Celta de Vigo': 'Celta Vigo',
    'Celta Vigo': 'Celta Vigo',
    'Celta': 'Celta Vigo',
    'Rayo Vallecano': 'Rayo',
    'UD Las Palmas': 'Las Palmas',
    'Las Palmas': 'Las Palmas',
    'Granada CF': 'Granada',
    'Granada': 'Granada',
    'Almería': 'Almería',
    'CD Leganés': 'Leganés',
    'Leganés': 'Leganés',
    'Espanyol': 'Espanyol',
    'RCD Espanyol': 'Espanyol',
    'Deportivo': 'Deportivo La Coruña',
    'Albacete': 'Albacete',
    'Zaragoza': 'Zaragoza',
    'Elche': 'Elche',
    'Alcorcón': 'Alcorcón',
  },
  SA: {
    'Inter Milan': 'Inter',
    'Inter': 'Inter',
    'AC Milan': 'Milan',
    'Milan': 'Milan',
    'Juventus FC': 'Juventus',
    'Juventus': 'Juventus',
    'Napoli': 'Napoli',
    'SSC Napoli': 'Napoli',
    'AS Roma': 'Roma',
    'Roma': 'Roma',
    'SS Lazio': 'Lazio',
    'Lazio': 'Lazio',
    'ACF Fiorentina': 'Fiorentina',
    'Fiorentina': 'Fiorentina',
    'Bologna': 'Bologna',
    'Bologna FC': 'Bologna',
    'Atalanta': 'Atalanta',
    'Atalanta BC': 'Atalanta',
    'Torino': 'Torino',
    'Torino FC': 'Torino',
    'Udinese Calcio': 'Udinese',
    'Udinese': 'Udinese',
    'Sassuolo': 'Sassuolo',
    'Empoli': 'Empoli',
    'Frosinone': 'Frosinone',
    'Hellas Verona': 'Verona',
    'Verona': 'Verona',
    'Sampdoria': 'Sampdoria',
    'Parma': 'Parma',
    'Parma Calcio': 'Parma',
    'Cagliari': 'Cagliari',
    'Cagliari Calcio': 'Cagliari',
    'Monza': 'Monza',
    'AC Monza': 'Monza',
    'US Lecce': 'Lecce',
    'Salernitana': 'Salernitana',
    'Genoa CFC': 'Genoa',
  },
  FL1: {
    'Paris Saint-Germain': 'PSG',
    'PSG': 'PSG',
    'AS Monaco': 'Monaco',
    'Monaco': 'Monaco',
    'Olympique de Marseille': 'Marseille',
    'Olympique Lyon': 'Lyon',
    'Lyon': 'Lyon',
    'LOSC Lille': 'Lille',
    'Lille OSC': 'Lille',
    'Lille': 'Lille',
    'OGC Nice': 'Nice',
    'Nice': 'Nice',
    'RC Lens': 'Lens',
    'Lens': 'Lens',
    'Stade Rennais': 'Rennes',
    'Stade Rennais FC 1901': 'Rennes',
    'RC Strasbourg': 'Strasbourg',
    'Strasbourg': 'Strasbourg',
    'Toulouse FC': 'Toulouse',
    'Toulouse': 'Toulouse',
    'FC Nantes': 'Nantes',
    'Nantes': 'Nantes',
    'Stade Brestois': 'Brest',
    'Brest': 'Brest',
    'AJ Auxerre': 'Auxerre',
    'Auxerre': 'Auxerre',
    'Le Havre': 'Le Havre',
    'Metz': 'Metz',
    'FC Metz': 'Metz',
    'Montpellier HSC': 'Montpellier',
    'Montpellier': 'Montpellier',
    'AS Saint-Étienne': 'Saint-Étienne',
    'Saint-Étienne': 'Saint-Étienne',
  },
  BSA: {
    'São Paulo FC': 'Sao Paulo',
    'Botafogo FR': 'Botafogo',
    'EC Vitória':'Vitoria',
    'SC Internacional':'Internacional',
    'Grêmio FBPA':'Gremio',
    'Santos FC':'Santos',
    'Clube do Remo':'Remo',
    'CA Paranaense':'Athletico PR',
    'SC Corinthians Paulista':'Corinthians',
    'CA Mineiro':'Atletico MG',
    '':'',

  }
}

export const COMPETITION_FILES: Record<string, string> = {
  BL1: '/data/alemania.json',
  PL: '/data/inglaterra.json',
  PD: '/data/spain.json',
  SA: '/data/italia.json',
  FL1: '/data/francia.json',
}

export function findTeamByName(teamName: string, competition: string): TeamStats | null {
  return null
}

export async function loadTeamData(competition: string): Promise<TeamStats[]> {
  const file = COMPETITION_FILES[competition]
  if (!file) return []
  
  try {
    const response = await fetch(file)
    const data = await response.json()
    return data as TeamStats[]
  } catch (err) {
    console.error('Error loading team data:', err)
    return []
  }
}

export function findTeam(teamName: string, teams: TeamStats[]): TeamStats | null {
  const normalized = teamName.toLowerCase().trim()
  
  for (const team of teams) {
    const teamNameNormalized = team.name.toLowerCase().trim()
    
    if (teamNameNormalized === normalized) {
      return team
    }
    
    const nameParts = teamNameNormalized.split(' ')
    for (const part of nameParts) {
      if (part.length > 3 && normalized.includes(part.toLowerCase())) {
        return team
      }
    }
  }
  
  return null
}

export function mapTeamName(fdName: string, competition: string): string {
  const adapters = TEAM_ADAPTERS[competition]
  if (adapters && adapters[fdName]) {
    return adapters[fdName]
  }
  
  const normalized = fdName.toLowerCase()
  
  const commonMappings: Record<string, string> = {
    'bayern': 'Bayern Munich',
    'dortmund': 'Dortmund',
    'leverkusen': 'Leverkusen',
    'leipzig': 'RB Leipzig',
    'frankfurt': 'Eintracht Frankfurt',
    'stuttgart': 'Stuttgart',
    'hoffenheim': 'Hoffenheim',
    'wolfsburg': 'Wolfsburg',
    'freiburg': 'Freiburg',
    'köln': 'Köln',
    'cologne': 'Köln',
    'union berlin': 'Union Berlin',
    'mönchengladbach': 'Mönchengladbach',
    'gladbach': 'Mönchengladbach',
    'augsburg': 'Augsburg',
    'werder bremen': 'Werder Bremen',
    'bremen': 'Werder Bremen',
    'mainz': 'Mainz 05',
    'heidenheim': 'Heidenheim',
    'st. pauli': 'St. Pauli',
    'hamburger': 'Hamburger SV',
    'hamburg': 'Hamburger SV',
    'bochum': 'Bochum',
    'manchester city': 'Manchester City',
    'man city': 'Manchester City',
    'manchester united': 'Manchester United',
    'man united': 'Manchester United',
    'tottenham': 'Tottenham',
    'newcastle': 'Newcastle',
    'aston villa': 'Aston Villa',
    'west ham': 'West Ham',
    'brighton': 'Brighton',
    'brentford': 'Brentford',
    'wolves': 'Wolves',
    'wolverhampton': 'Wolves',
    'crystal palace': 'Crystal Palace',
    'fulham': 'Fulham',
    'everton': 'Everton',
    'nottingham': 'Nottingham',
    'leicester': 'Leicester',
    'ipswich': 'Ipswich',
    'southampton': 'Southampton',
    'barcelona': 'Barcelona',
    'barça': 'Barcelona',
    'atlético': 'Atlético Madrid',
    'atletico': 'Atlético Madrid',
    'sociedad': 'Real Sociedad',
    'athletic': 'Athletic Bilbao',
    'villarreal': 'Villarreal',
    'sevilla': 'Sevilla',
    'betis': 'Betis',
    'girona': 'Girona',
    'osasuna': 'Osasuna',
    'valencia': 'Valencia',
    'mallorca': 'Mallorca',
    'celta': 'Celta Vigo',
    'las palmas': 'Las Palmas',
    'granada': 'Granada',
    'espanyol': 'Espanyol',
    'inter milan': 'Inter',
    'ac milan': 'Milan',
    'juventus': 'Juventus',
    'napoli': 'Napoli',
    'roma': 'Roma',
    'lazio': 'Lazio',
    'fiorentina': 'Fiorentina',
    'bologna': 'Bologna',
    'atalanta': 'Atalanta',
    'torino': 'Torino',
    'udinese': 'Udinese',
    'sassuolo': 'Sassuolo',
    'verona': 'Verona',
    'parma': 'Parma',
    'cagliari': 'Cagliari',
    'monza': 'Monza',
    'psg': 'PSG',
    'monaco': 'Monaco',
    'marsella': 'Marsella',
    'marseille': 'Marsella',
    'lyon': 'Lyon',
    'lille': 'Lille',
    'nice': 'Nice',
    'lens': 'Lens',
    'rennes': 'Rennes',
    'strasbourg': 'Strasbourg',
    'toulouse': 'Toulouse',
    'nantes': 'Nantes',
    'brest': 'Brest',
    'montpellier': 'Montpellier',
  }
  
  for (const [key, value] of Object.entries(commonMappings)) {
    if (normalized.includes(key)) {
      return value
    }
  }
  
  return fdName
}
