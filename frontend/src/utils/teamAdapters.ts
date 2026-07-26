import { TeamStatsData } from '@/types';

export const TEAM_ADAPTERS: Record<string, Record<string, string>> = {
  germany: {
    'Bayern München': 'Bayern Munich',
    'Borussia Dortmund': 'Dortmund',
    'RB Leipzig': 'RB Leipzig',
    Stuttgart: 'Stuttgart',
    Hoffenheim: 'Hoffenheim',
    'Bayer Leverkusen': 'Leverkusen',
    Freiburg: 'Freiburg',
    'Eintracht Frankfurt': 'E. Frankfurt',
    Augsburg: 'FC Augsburg',
    'Mainz 05': 'FSV Mainz',
    'Union Berlin': 'Union Berlin"',
    "Borussia M'gladbach": 'Monchengladbach',
    'Hamburger SV': 'Hamburger SV',
    Köln: 'FC Koln',
    'Werder Bremen': 'Werder Bremen',
    Wolfsburg: 'Wolfsburg',
    Heidenheim: 'Heidenheim',
    'St. Pauli': 'Sankt Pauli',
  },
  england: {
    Arsenal: 'Arsenal',
    'Manchester City': 'Manchester City',
    'Manchester United': 'Manchester Utd',
    'Aston Villa': 'Aston Villa',
    Liverpool: 'Liverpool',
    'AFC Bournemouth': 'Bournemouth',
    'Brighton & Hove Albion': 'Brighton',
    Brentford: 'Brentford',
    Sunderland: 'Sunderland',
    Chelsea: 'Chelsea',
    Everton: 'Everton',
    Fulham: 'Fulham',
    'Leeds United': 'Leeds Utd',
    'Newcastle United': 'Newcastle Utd',
    'Crystal Palace': 'Crystal Palace',
    'Nottingham Forest': 'Nottm Forest',
    'Tottenham Hotspur': 'Tottenham',
    'West Ham United': 'West Ham Utd',
    Burnley: 'Burnley',
    'Wolverhampton Wanderers': 'Wolverhampton',
  },
  spain: {
    'FC Barcelona': 'FC Barcelona',
    'Real Madrid': 'Real Madrid',
    Villarreal: 'Villarreal',
    'Atlético Madrid': 'Atletico Madrid',
    'Real Betis': 'Real Betis',
    'Celta de Vigo': 'Celta Vigo',
    'Getafe CF': 'Getafe',
    'Rayo Vallecano': 'Rayo Vallecano',
    'Valencia CF': 'Valencia',
    'RCD Espanyol': 'Espanyol',
    'Real Sociedad': 'Real Sociedad',
    'Athletic Club Bilbao': 'Athletic Bilbao',
    'Sevilla FC': 'Sevilla FC',
    'Deportivo Alavés': 'Alaves',
    'Elche CF': 'Elche',
    'CA Osasuna': 'Osasuna',
    'Levante UD': 'Levante',
    'RCD Mallorca': 'Mallorca',
    'Girona FC': 'Girona',
    'Real Oviedo': 'Real Oviedo',
  },
  italy: {
    'Inter Milan': 'Inter',
  },
  france: {
    'PSG': 'Paris SG',
    'Lens': 'Lens',
    'Lille': 'Lille',
    'Olympique Lyonnais': 'Lyon',
    'Olympique Marseille': 'Marseille',
    'Rennes': 'Rennes',
    'Monaco': 'Monaco',
    'Strasbourg': 'Strasbourg',
    'Toulouse': 'Toulouse',
    'Lorient': 'Lorient',
    'Paris': 'Paris FC',
    'Brest': 'Brest',
    'Angers SCO': 'Angers',
    'Le Havre': 'Le Havre',
    'Auxerre': 'Auxerre',
    'Nice': 'Nice',
    'Troyes': 'Nantes',
    'Le Mans': 'Metz',
  },
  brazil: {
    'São Paulo FC': 'Sao Paulo',
    'Botafogo FR': 'Botafogo',
    'EC Vitória': 'Vitoria',
    'SC Internacional': 'Internacional',
    'Grêmio FBPA': 'Gremio',
    'Santos FC': 'Santos',
    'Clube do Remo': 'Remo',
    'CA Paranaense': 'Athletico PR',
    'SC Corinthians Paulista': 'Corinthians',
    'CA Mineiro': 'Atletico MG',
    Bahia: 'Bahia',
    'Atlético Mineiro': 'Atletico MG',
    Grêmio: 'Gremio',
    Mirassol: 'Mirassol',
    'Vasco da Gama': 'Vasco da Gama',
    Vitória: 'Vitoria',
    'São Paulo': 'Sao Paulo',
    'Atlético PR': 'Athletico PR',
  },
  peru: {
    'Juan Pablo II College': 'Juan Pablo II',
    Melgar: 'FBC Melgar',
    Moquegua: 'UCV Moquegua',
    Universitario: 'Universitario',
    'UTC Cajamarca': 'Cajamarca',
    'Sport Boys': 'Sport Boys',
    'Cuzco FC': 'Cusco',
    'Atlético Grau': 'Atletico Grau',
    'Alianza Lima': 'Alianza Lima',
    'Los Chankas': 'Los Chankas',
    'Sporting Cristal': 'S. Cristal',
    ADT: 'ADT',
    'Sport Huancayo': 'Sport Huancayo',
    Cienciano: 'Cienciano',
    'Alianza Atlético': 'Alianza A.',
    'FC Cajamarca': 'FC Cajamarca',
    'Deportivo Garcilaso': 'D. Garcilaso',
    'Real Garcilaso': 'Cusco',
    'Comerciantes Unidos': 'Comerciantes U.',
  },
  norway: {
    Fredrikstad: 'Fredrikstad',
    Lillestrøm: 'Lillestrom',
    Tromsø: 'Tromso',
    Vålerenga: 'Valerenga',
    HamKam: 'HamKam',
    KFUM: 'KFUM Oslo',
    'FK Bodo - Glimt': 'Bodo/Glimt',
  },
  sweden: {
    Sirius: 'Sirius',
    Häcken: 'Hacken',
    Elfsborg: 'Elfsborg',
    Hammarby: 'Hammarby',
    GAIS: 'GAIS',
    Mjällby: 'Mjallby',
    Brommapojkarna: 'Brommapojkarna',
    Djurgården: 'Djurgarden',
    'Malmö FF': 'Malmo FF',
    AIK: 'AIK',
    'Västerås SK': 'Vasteras',
    Degerfors: 'Degerfors',
    Kalmar: 'Kalmar',
    'IFK Göteborg': 'IFK Goteborg',
    Halmstad: 'Halmstad',
    Örgryte: 'Orgryte',
  },
  china: {
    'Chengdu Better City FC': 'Chengdu',
    'Chongqing Tongliang Long': 'Chongqing T.',
    'Dalian Zhixing': 'Dalian Yingbo',
    'Shandong Luneng': 'Shandong T.',
    'Yunnan Yukun': 'Yunnan Yukun',
    'Qingdao Youth Island': 'Qingdao West C.',
    'Beijing Guoan': 'Beijing Guoan',
    'Zhejiang FC': 'Zhejiang',
    'Sichuan Jiuniu': 'Shenzhen',
    'Shenyang Urban': 'Liaoning Tieren',
    'Shanghai Shenhua': 'S. Shenhua',
    'Shanghai SIPG': 'Shanghai Port',
    'Henan Jianye': 'Henan SL',
    'Qingdao Jonoon': 'Qingdao Hainiu',
    'Wuhan Three Towns': 'Wuhan Three T.',
    'Tianjin Teda': 'Tianjin JT',
  },
  ecuador: {
    'CSD Independiente del Valle': 'I. del Valle',
    'LDU Quito': 'LDU Quito',
    'Deportivo Cuenca': 'D. Cuenca',
    'CD Universidad Católica': 'U. Catolica',
    Barcelona: 'Barcelona SC',
    'SD Aucas': 'Aucas',
    'Orense SC': 'Orense',
    'Técnico Universitario': 'Tecnico U.',
    Macará: 'Macara',
    'CS Emelec': 'Emelec',
    'Guayaquil City FC': 'Guayaquil City',
    'Mushuc Runa SC': 'Mushuc Runa',
    'Leones del Norte': 'Leones Norte',
    Libertad: 'Libertad',
    'Delfin SC': 'Delfin',
    'Manta FC': 'Manta',
  },
  usa:{
    'Nashville SC':'Nashville SC',
    'Vancouver Whitecaps':'Vancouver',
    'SJ Earthquakes':'SJ Earthquakes',
    'Inter Miami':'Inter Miami',
    'Chicago Fire':'Chicago Fire',
    'Real Salt Lake':'Real Salt Lake',
    'FC Dallas':'Dallas',
    'New England Revolution':'New England',
    'Los Angeles FC':'Los Angeles FC',
    'Seattle Sounders':'Seattle',
    'Houston Dynamo':'Houston Dynamo',
    'Minnesota United':'Minnesota Utd',
    'New York RB':'New York RB',
    'Charlotte':'Charlotte',
    'LA Galaxy':'LA Galaxy',
    'FC Cincinnati':'Cincinnati',
    'New York City':'New York City',
    'DC United':'DC United',
    'San Diego':'San Diego',
    'Colorado Rapids':'Colorado Rapids',
    'Columbus Crew':'Columbus Crew',
    'St. Louis City':'St. Louis City',
    'Portland Timbers':'Portland',
    'Toronto':'Toronto',
    'Montreal Impact':'CF Montreal',
    'Austin':'Austin',
    'Orlando City':'Orlando City',
    'Atlanta United FC':'Atlanta Utd',
    'Sporting KC':'Sporting KC',
    'Philadelphia Union':'Philadelphia',
  }
};

export function findTeam(
  teamName: string,
  teams: TeamStatsData[],
): TeamStatsData | null {
  const normalized = teamName.toLowerCase().trim();

  for (const team of teams) {
    const teamNameNormalized = team.name.toLowerCase().trim();

    if (teamNameNormalized === normalized) {
      return team;
    }

    // const nameParts = teamNameNormalized.split(' ');
    // for (const part of nameParts) {
    //   if (part.length > 3 && normalized.includes(part.toLowerCase())) {
    //     return team;
    //   }
    // }
  }

  return null;
}

export function mapTeamName(fdName: string, competition: string): string {
  const adapters = TEAM_ADAPTERS[competition];
  if (adapters && adapters[fdName]) {
    return adapters[fdName];
  }

  // const normalized = fdName.toLowerCase()

  // const commonMappings: Record<string, string> = {
  //
  //   'frankfurt': 'Eintracht Frankfurt',
  //   'stuttgart': 'Stuttgart',
  //   'hoffenheim': 'Hoffenheim',
  //   'wolfsburg': 'Wolfsburg',
  //   'freiburg': 'Freiburg',
  //
  // }

  // for (const [key, value] of Object.entries(commonMappings)) {
  //   if (normalized.includes(key)) {
  //     return value
  //   }
  // }

  return fdName;
}
