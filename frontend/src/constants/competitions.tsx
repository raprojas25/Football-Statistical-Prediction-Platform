export const COMPETITIONS: Record<
  string,
  {
    name: string;
    flag: string;
    teamsFile: string;
    partidosFile: string;
    favorite: boolean;
  }
> = {
  peru: {
    name: 'Liga 1',
    flag: '🇵🇪',
    teamsFile: '/data/peru.json',
    partidosFile: '/fixtures/peru.json',
    favorite: true,
  },
  england: {
    name: 'Premier League',
    flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    teamsFile: '/data/england.json',
    partidosFile: '/fixtures/englnd.json',
    favorite: true,
  },
  italy: {
    name: 'Serie A',
    flag: '🇮🇹',
    teamsFile: '/data/italy.json',
    partidosFile: '/fixtures/italy.json',
    favorite: false,
  },
  spain: {
    name: 'La Liga',
    flag: '🇪🇸',
    teamsFile: '/data/spain.json',
    partidosFile: '/fixtures/spain.json',
    favorite: true,
  },
  germany: {
    name: 'Bundesliga',
    flag: '🇩🇪',
    teamsFile: '/data/germany.json',
    partidosFile: '/fixtures/germany.json',
    favorite: true,
  },
  france: {
    name: 'Ligue 1',
    flag: '🇫🇷',
    teamsFile: '/data/france.json',
    partidosFile: '/fixtures/france.json',
    favorite: false,
  },
  norway: {
    name: 'Elite Serien',
    flag: '🇳🇴',
    teamsFile: '/data/norway.json',
    partidosFile: '/fixtures/norway.json',
    favorite: true,
  },
  china: {
    name: 'Super League ',
    flag: '🇨🇳',
    teamsFile: '/data/china.json',
    partidosFile: '/fixtures/china.json',
    favorite: false,
  },
  sweden: {
    name: 'Allsve',
    flag: '🇸🇪',
    teamsFile: '/data/sweden.json',
    partidosFile: '/fixtures/sweden.json',
    favorite: true,
  },
  usa: {
    name: 'MLS',
    flag: '🇺🇸',
    teamsFile: '/data/usa.json',
    partidosFile: '/fixtures/usa.json',
    favorite: true,
  },
  scotland: {
    name: 'Allsve',
    flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
    teamsFile: '/data/scotland.json',
    partidosFile: '/fixtures/scotland.json',
    favorite: false,
  },
  ecuador: {
    name: 'Liga Pro',
    flag: '🇪🇨',
    teamsFile: '/data/ecuador.json',
    partidosFile: '/fixtures/ecuador.json',
    favorite: false,
  },
};
