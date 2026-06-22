export const COMPETITIONS: Record<
  string,
  { name: string; flag: string; teamsFile: string; partidosFile: string }
> = {
  PE: {
    name: 'Liga 1',
    flag: '🇵🇪',
    teamsFile: '/data/peru.json',
    partidosFile: '/fixtures/PE.json',
  },
  PL: {
    name: 'Premier League',
    flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    teamsFile: '/data/inglaterra.json',
    partidosFile: '/fixtures/PL.json',
  },
  SA: {
    name: 'Serie A',
    flag: '🇮🇹',
    teamsFile: '/data/italia.json',
    partidosFile: '/fixtures/SA.json',
  },
  PD: {
    name: 'La Liga',
    flag: '🇪🇸',
    teamsFile: '/data/spain.json',
    partidosFile: '/fixtures/PD.json',
  },
  BL1: {
    name: 'Bundesliga',
    flag: '🇩🇪',
    teamsFile: '/data/alemania.json',
    partidosFile: '/fixtures/BL1.json',
  },
  FL1: {
    name: 'Ligue 1',
    flag: '🇫🇷',
    teamsFile: '/data/francia.json',
    partidosFile: '/fixtures/FL1.json',
  },
  PO: {
    name: 'Liga Portugal',
    flag: '🇵🇹',
    teamsFile: '/data/portugal.json',
    partidosFile: '/fixtures/PO.json',
  },
  BSA: {
    name: 'Seria A',
    flag: '🇧🇷',
    teamsFile: '/data/brasil.json',
    partidosFile: '/fixtures/brazil.json',
  },
};
