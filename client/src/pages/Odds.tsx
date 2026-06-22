import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Search,
  SlidersHorizontal,
  TrendingUp,
  Percent,
  CheckCircle,
  XCircle,
  Filter,
  RefreshCw,
  Lightbulb,
  Award,
  ChevronDown,
  ChevronUp,
  Flame,
  Info,
  Calendar,
  Layers,
  Sparkles,
  ArrowRight,
  X,
} from 'lucide-react';

// Interfaces for structured types
interface Score {
  home: number;
  away: number;
}

interface MatchOdds {
  home: number;
  draw: number;
  away: number;
}

interface Fixture {
  id: string;
  date_timestamp: number | null;
  date_str: string;
  home_team: string;
  away_team: string;
  home_ppg: number;
  away_ppg: number;
  status: string;
  score?: Score;
  odds?: MatchOdds;
}

interface OddsData {
  generated_at?: string;
  source?: string;
  league?: string;
  country?: string;
  season?: number;
  fixtures?: Fixture[];
}

interface PredictionResult {
  label: string;
  type:
    | 'HOME'
    | 'AWAY'
    | 'DRAW'
    | 'HOME_DRAW'
    | 'AWAY_DRAW'
    | 'HOME_AWAY'
    | 'NA';
  details: string;
}

const difference = (home_ppg: number, away_ppg: number) => {
  const ppgDiff = [home_ppg, away_ppg];

  const max = Math.max(...ppgDiff);
  const min = Math.min(...ppgDiff);

  return (max - min).toFixed(2);
};

// Prediction function mapping exactly to the custom decision tree formula
const getPrediction = (
  homeOdd: number = 1,
  drawOdd: number = 1,
  awayOdd: number = 1,
): PredictionResult => {
  const homeAway = [homeOdd, awayOdd];

  const max = Math.max(...homeAway);
  const min = Math.min(...homeAway);

  const h: number = Number((drawOdd - homeOdd).toFixed(2));
  const d: number = Number((max - min).toFixed(2));
  const a: number = Number((drawOdd - awayOdd).toFixed(2));

  if (h > 1.23 && d > 1.36) {
    if (d > 3.38) {
      // original 3.4 cambiado para ecuador
      return {
        label: 'Empate home(NA)',
        type: 'NA',
        details: `H/D: ${h} | H/A: ${d} | D/A: ${a}`,
      };
    }
    return {
      label: 'LOCAL (1)',
      type: 'HOME',
      details: `H/D: ${h} | H/A: ${d} | D/A: ${a}`,
    };
  } else if (a >= 1.25 && d > 1.37) {
    if (d > 3.38) {
      return {
        label: 'Empate visita(NA)',
        type: 'NA',
        details: `H/D: ${h} | H/A: ${d} | D/A: ${a}`,
      };
    }
    return {
      label: 'AWAY (2)',
      type: 'AWAY',
      details: `H/D: ${h} | H/A: ${d} | D/A: ${a}`,
    };
  } else {
    if (min === awayOdd) {
      if (d < 0.25 || h < 0.31) {
        return {
          label: 'empate favorito', //handicap +1.5 al menos favorito y favorito anota
          type: 'AWAY_DRAW',
          details: `H/D: ${h} | H/A: ${d} | D/A: ${a}`,
        };
      }
      if (a > 1.44) {
        return {
          label: 'Visita (1x)', //handicap +1.5 al menos favorito y favorito anota
          type: 'AWAY',
          details: `H/D: ${h} | H/A: ${d} | D/A: ${a}`,
        };
      } else {
        return {
          label: 'LOCAL o EMPATE (1X)', //handicap +1.5 al menos favorito y favorito anota
          type: 'HOME_DRAW',
          details: `H/D: ${h} | H/A: ${d} | D/A: ${a}`,
        };
      }
    } else if (h > 1.09 || d > 0.9) {
      return {
        label: 'Visita test', //handicap +1.5 al menos favorito y favorito anota
        type: 'HOME_AWAY',
        details: `H/D: ${h} | H/A: ${d} | D/A: ${a}`,
      };
    }
    return {
      label: 'visita Empate',
      type: 'AWAY_DRAW',
      details: `H/D: ${h} | H/A: ${d} | D/A: ${a}`,
    };
  }
  // if (h > 1.23 && d > 1.36) {
  //   if (d > 3.4){
  //   return {
  //     label: "no apostar",
  //     type: "DRAW",
  //     details: `H/D: ${h} | H/A: ${d} | D/A: ${a}`
  //   };
  //   }
  //   return {
  //     label: "LOCAL (1)",
  //     type: "HOME",
  //     details: `H/D: ${h} | H/A: ${d} | D/A: ${a}`
  //   };
  // }
  // else if (a >= 1.25 && d > 1.37) {
  //   if (d > 3.4){
  //   return {
  //     label: "Empate no apostar",
  //     type: "DRAW",
  //     details: `H/D: ${h} | H/A: ${d} | D/A: ${a}`
  //   };
  //   }
  //   return {
  //     label: "AWAYNTE (2)",
  //     type: "AWAY",
  //     details: `H/D: ${h} | H/A: ${d} | D/A: ${a}`
  //   };
  // } else {
  //   if (min === awayOdd) {
  //     return {
  //       label: "EMPATE Cuoton",
  //       type: "DRAW",
  //       details: `H/D: ${h} | H/A: ${d} | D/A: ${a}`
  //     };
  //   }
  //   return {
  //     label: "home Cuoton",
  //     type: "HOME",
  //     details: `H/D: ${h} | H/A: ${d} | D/A: ${a}`
  //   };
  // }
};

// Check if prediction matched the actual outcome of the match
const isPredictionHit = (
  predType: string,
  score: Score | undefined,
): boolean => {
  if (!score) return false;
  const homeScore = score.home;
  const awayScore = score.away;
  const actualResult =
    homeScore > awayScore ? 'HOME' : homeScore < awayScore ? 'AWAY' : 'DRAW';

  if (predType === 'HOME' && actualResult === 'HOME') return true;
  if (predType === 'AWAY' && actualResult === 'AWAY') return true;
  if (predType === 'DRAW' && actualResult === 'DRAW') return true;

  if (
    predType === 'HOME_DRAW' &&
    (actualResult === 'HOME' || actualResult === 'DRAW')
  )
    return true;
  if (
    predType === 'AWAY_DRAW' &&
    (actualResult === 'AWAY' || actualResult === 'DRAW')
  )
    return true;
  if (
    predType === 'HOME_AWAY' &&
    (actualResult === 'HOME' || actualResult === 'AWAY')
  )
    return true;

  if (predType === 'NA') return true;

  return false;
};

export const Odds = () => {
  // Query for static odds/fixtures database
  const { isLoading, data: odds } = useQuery<OddsData>({
    queryKey: ['odds'],
    queryFn: async () => {
      const fixturesRes = await fetch('odds/alemania_fixtures.json');
      if (!fixturesRes.ok) {
        throw new Error(
          `Error al cargar fixtures (${fixturesRes.status} ${fixturesRes.statusText})`,
        );
      }
      return await fixturesRes.json();
    },
  });

  // Basic search & filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedActualResult, setSelectedActualResult] =
    useState<string>('ALL');
  const [selectedPrediction, setSelectedPrediction] = useState<string>('ALL');
  const [predictionHitFilter, setPredictionHitFilter] = useState<string>('ALL');

  // Advanced odds-ranges states
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [minHomeOdd, setMinHomeOdd] = useState<string>('');
  const [maxHomeOdd, setMaxHomeOdd] = useState<string>('');
  const [minDrawOdd, setMinDrawOdd] = useState<string>('');
  const [maxDrawOdd, setMaxDrawOdd] = useState<string>('');
  const [minAwayOdd, setMinAwayOdd] = useState<string>('');
  const [maxAwayOdd, setMaxAwayOdd] = useState<string>('');

  // Pagination / Limit state (keeps page load extremely fast and performant)
  const [visibleCount, setVisibleCount] = useState<number>(30);

  // Extract all fixtures
  const fixtures: Fixture[] = useMemo(() => {
    if (!odds || !odds.fixtures) return [];
    return odds.fixtures;
  }, [odds]);

  // Memoized filter calculation
  const filteredMatches = useMemo(() => {
    return fixtures.filter((match) => {
      // 1. Team search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const homeMatches = match.home_team.toLowerCase().includes(query);
        const awayMatches = match.away_team.toLowerCase().includes(query);
        if (!homeMatches && !awayMatches) return false;
      }

      // 2. Actual outcome
      if (selectedActualResult !== 'ALL' && match.score) {
        const homeScore = match.score.home;
        const awayScore = match.score.away;
        const actualWinner =
          homeScore > awayScore
            ? 'HOME'
            : homeScore < awayScore
              ? 'AWAY'
              : 'DRAW';
        if (actualWinner !== selectedActualResult) return false;
      }

      // Calculate prediction info for prediction-based filters
      const homeOdd = match.odds?.home || 1;
      const drawOdd = match.odds?.draw || 1;
      const awayOdd = match.odds?.away || 1;

      const predInfo = getPrediction(homeOdd, drawOdd, awayOdd);

      // 3. Prediction model
      if (selectedPrediction !== 'ALL') {
        if (predInfo.type !== selectedPrediction) return false;
      }

      // 4. Hit/Miss status
      if (predictionHitFilter !== 'ALL' && match.score) {
        const isHit = isPredictionHit(predInfo.type, match.score);
        if (predictionHitFilter === 'HIT' && !isHit) return false;
        if (predictionHitFilter === 'MISS' && isHit) return false;
      }

      // 5. Odds ranges
      if (minHomeOdd && homeOdd < parseFloat(minHomeOdd)) return false;
      if (maxHomeOdd && homeOdd > parseFloat(maxHomeOdd)) return false;
      if (minDrawOdd && drawOdd < parseFloat(minDrawOdd)) return false;
      if (maxDrawOdd && drawOdd > parseFloat(maxDrawOdd)) return false;
      if (minAwayOdd && awayOdd < parseFloat(minAwayOdd)) return false;
      if (maxAwayOdd && awayOdd > parseFloat(maxAwayOdd)) return false;

      return true;
    });
  }, [
    fixtures,
    searchQuery,
    selectedActualResult,
    selectedPrediction,
    predictionHitFilter,
    minHomeOdd,
    maxHomeOdd,
    minDrawOdd,
    maxDrawOdd,
    minAwayOdd,
    maxAwayOdd,
  ]);

  // Reset pagination on filter change
  const handleFilterChange = (setter: (val: any) => void, val: any) => {
    setter(val);
    setVisibleCount(30);
  };

  // Helper presets for odds ranges
  const applyPreset = (preset: string) => {
    setMinHomeOdd('');
    setMaxHomeOdd('');
    setMinDrawOdd('');
    setMaxDrawOdd('');
    setMinAwayOdd('');
    setMaxAwayOdd('');
    setVisibleCount(30);

    switch (preset) {
      case 'local-fav':
        setMaxHomeOdd('1.45');
        break;
      case 'away-fav':
        setMaxAwayOdd('1.65');
        break;
      case 'balanced':
        setMinHomeOdd('2.30');
        setMinAwayOdd('2.30');
        break;
      case 'high-draw':
        setMinDrawOdd('3.80');
        break;
      default:
        break;
    }
  };

  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedActualResult('ALL');
    setSelectedPrediction('ALL');
    setPredictionHitFilter('ALL');
    setMinHomeOdd('');
    setMaxHomeOdd('');
    setMinDrawOdd('');
    setMaxDrawOdd('');
    setMinAwayOdd('');
    setMaxAwayOdd('');
    setVisibleCount(30);
  };

  // Memoized statistics calculations
  const stats = useMemo(() => {
    const total = filteredMatches.length;
    if (total === 0) {
      return {
        total,
        hits: 0,
        misses: 0,
        accuracy: 0,
        homeWins: 0,
        draws: 0,
        awayWins: 0,
        homeWinPct: 0,
        drawPct: 0,
        awayWinPct: 0,
        avgHomeOdd: 0,
        avgDrawOdd: 0,
        avgAwayOdd: 0,
        avgWinningOdd: 0,
      };
    }

    let hits = 0;
    let misses = 0;
    let homeWins = 0;
    let draws = 0;
    let awayWins = 0;
    let sumHomeOdd = 0;
    let sumDrawOdd = 0;
    let sumAwayOdd = 0;
    let sumWinningOdd = 0;
    let winningOddCount = 0;

    filteredMatches.forEach((match) => {
      const homeScore = match.score?.home ?? 0;
      const awayScore = match.score?.away ?? 0;
      const actualWinner =
        homeScore > awayScore
          ? 'HOME'
          : homeScore < awayScore
            ? 'AWAY'
            : 'DRAW';

      // Increment winner counts
      if (actualWinner === 'HOME') homeWins++;
      else if (actualWinner === 'DRAW') draws++;
      else if (actualWinner === 'AWAY') awayWins++;

      // Sum odds
      const homeOdd = match.odds?.home || 0;
      const drawOdd = match.odds?.draw || 0;
      const awayOdd = match.odds?.away || 0;

      sumHomeOdd += homeOdd;
      sumDrawOdd += drawOdd;
      sumAwayOdd += awayOdd;

      if (actualWinner === 'HOME' && homeOdd) {
        sumWinningOdd += homeOdd;
        winningOddCount++;
      } else if (actualWinner === 'DRAW' && drawOdd) {
        sumWinningOdd += drawOdd;
        winningOddCount++;
      } else if (actualWinner === 'AWAY' && awayOdd) {
        sumWinningOdd += awayOdd;
        winningOddCount++;
      }

      // Check prediction
      const predInfo = getPrediction(homeOdd, drawOdd, awayOdd);
      const isHit = isPredictionHit(predInfo.type, match.score);
      if (isHit) hits++;
      else misses++;
    });

    return {
      total,
      hits,
      misses,
      accuracy: (hits / total) * 100,
      homeWins,
      draws,
      awayWins,
      homeWinPct: (homeWins / total) * 100,
      drawPct: (draws / total) * 100,
      awayWinPct: (awayWins / total) * 100,
      avgHomeOdd: sumHomeOdd / total,
      avgDrawOdd: sumDrawOdd / total,
      avgAwayOdd: sumAwayOdd / total,
      avgWinningOdd: winningOddCount > 0 ? sumWinningOdd / winningOddCount : 0,
    };
  }, [filteredMatches]);

  const displayedMatches = useMemo(() => {
    return filteredMatches.slice(0, visibleCount);
  }, [filteredMatches, visibleCount]);

  if (isLoading) {
    return (
      <div className="flex min-h-[450px] flex-col items-center justify-center space-y-4">
        <RefreshCw className="h-10 w-10 animate-spin text-betano-primary" />
        <p className="animate-pulse text-sm font-semibold text-betano-muted">
          Analizando base de datos de cuotas...
        </p>
      </div>
    );
  }

  const leagueLabel = odds?.league
    ? `${odds.league.replace('-', ' ').toUpperCase()} (${odds.country?.toUpperCase()})`
    : 'ESTUDIO DE CUOTAS';

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-betano-border/80 bg-gradient-to-r from-betano-surface to-betano-card p-6 shadow-xl">
        <div className="absolute right-0 top-0 p-8 opacity-5">
          <Layers className="h-48 w-48 text-white" />
        </div>
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-betano-primary/30 bg-betano-primary/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-betano-primary">
            <Sparkles className="h-3 w-3" /> Base de Datos de Resultados
          </div>
          <h1 className="flex items-center gap-3 text-2xl font-black tracking-tight text-white md:text-3xl">
            <TrendingUp className="h-7 w-7 text-betano-primary" />
            Estudio de Cuotas & Modelos
          </h1>
          <p className="max-w-2xl text-sm text-betano-muted">
            {leagueLabel} • Temporada {odds?.season || 'Actual'}. Analiza la
            efectividad del algoritmo de predicción y estudia patrones de
            comportamiento en cuotas 1X2.
          </p>
        </div>
      </div>

      {/* Control Panel: Filters */}
      <div className="space-y-5 rounded-2xl border border-betano-border bg-betano-card p-5 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-betano-border/60 pb-3">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-betano-primary" />
            <h2 className="text-md font-bold uppercase tracking-wider text-white">
              Filtros de Búsqueda
            </h2>
          </div>
          <button
            onClick={resetAllFilters}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-betano-border bg-white/5 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-white/10"
          >
            <RefreshCw className="h-3 w-3" /> Reiniciar Filtros
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Team Text Search */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-betano-muted">
              Buscar Equipo (Local o Visitante)
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Ej. Arsenal, Chelsea, Aston Villa..."
                value={searchQuery}
                onChange={(e) =>
                  handleFilterChange(setSearchQuery, e.target.value)
                }
                className="w-full rounded-lg border border-betano-border bg-betano-surface py-2.5 pl-12 pr-4 text-sm text-white placeholder-gray-500 outline-none transition-all focus:border-betano-primary focus:ring-1 focus:ring-betano-primary/40"
              />
              <Search className="w-4.5 h-4.5 absolute left-3.5 top-2.5 text-gray-500" />
              {searchQuery && (
                <button
                  onClick={() => handleFilterChange(setSearchQuery, '')}
                  className="absolute right-3 top-2.5 cursor-pointer text-xs font-medium text-gray-500 hover:text-white"
                >
                  <X className="w-4.5 h-4.5 text-gray-500 hover:text-white" />
                </button>
              )}
            </div>
          </div>

          {/* Actual Result Outcome Filter */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-betano-muted">
              Resultado Real del Partido
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'ALL', label: 'Todos' },
                { id: 'HOME', label: 'Local (1)' },
                { id: 'DRAW', label: 'Empate (X)' },
                { id: 'AWAY', label: 'Visita (2)' },
              ].map((btn) => (
                <button
                  key={btn.id}
                  onClick={() =>
                    handleFilterChange(setSelectedActualResult, btn.id)
                  }
                  className={`cursor-pointer rounded-lg border py-2 text-xs font-bold transition-all ${
                    selectedActualResult === btn.id
                      ? 'border-betano-primary bg-betano-primary text-white shadow-md shadow-betano-primary/20'
                      : 'border-betano-border bg-betano-surface text-betano-muted hover:bg-betano-light/40 hover:text-white'
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 pt-1 md:grid-cols-2">
          {/* Predicted Result Filter */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-betano-muted">
              Predicción de la Fórmula
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {[
                { id: 'ALL', label: 'Todos' },
                { id: 'HOME', label: '1' },
                { id: 'DRAW', label: 'X' },
                { id: 'AWAY', label: '2' },
                { id: 'NA', label: 'NA' },
                { id: 'HOME_DRAW', label: '1X' },
                { id: 'AWAY_DRAW', label: '2X' },
                { id: 'HOME_AWAY', label: '12' },
              ].map((btn) => (
                <button
                  key={btn.id}
                  onClick={() =>
                    handleFilterChange(setSelectedPrediction, btn.id)
                  }
                  className={`cursor-pointer rounded-lg border py-2 text-xs font-bold transition-all ${
                    selectedPrediction === btn.id
                      ? 'border-betano-primary bg-betano-primary text-white shadow-md'
                      : 'border-betano-border bg-betano-surface text-betano-muted hover:bg-betano-light/40 hover:text-white'
                  }`}
                  title={
                    btn.id === 'HOME'
                      ? 'Local'
                      : btn.id === 'DRAW'
                        ? 'Empate'
                        : btn.id === 'AWAY'
                          ? 'Visitante'
                          : btn.id === 'HOME_DRAW'
                            ? 'Local o Empate'
                            : btn.id === 'AWAY_DRAW'
                              ? 'Visita o Empate'
                              : 'Todos'
                  }
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>

          {/* Predictor Hit/Miss Filter */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-betano-muted">
              Eficacia del Pronóstico
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'ALL', label: 'Todos' },
                { id: 'HIT', label: 'Acertados' },
                { id: 'MISS', label: 'Fallados' },
              ].map((btn) => (
                <button
                  key={btn.id}
                  onClick={() =>
                    handleFilterChange(setPredictionHitFilter, btn.id)
                  }
                  className={`cursor-pointer rounded-lg border py-2 text-xs font-bold transition-all ${
                    predictionHitFilter === btn.id
                      ? btn.id === 'HIT'
                        ? 'border-green-600 bg-green-600 text-white shadow-md shadow-green-600/20'
                        : 'border-red-600 bg-red-600 text-white shadow-md shadow-red-600/20'
                      : 'border-betano-border bg-betano-surface text-betano-muted hover:bg-betano-light/40 hover:text-white'
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Advanced Filters Expandable Toggle */}
        <div className="border-t border-betano-border/40 pt-2">
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="inline-flex cursor-pointer items-center gap-2 text-xs font-bold text-betano-muted transition-colors hover:text-white"
          >
            <SlidersHorizontal className="h-3.5 w-3.5 text-betano-primary" />
            {showAdvancedFilters
              ? 'Ocultar Filtros de Cuotas Avanzados'
              : 'Mostrar Filtros de Cuotas Avanzados'}
            {showAdvancedFilters ? (
              <ChevronUp className="h-3.5 w-3.5" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5" />
            )}
          </button>

          {showAdvancedFilters && (
            <div className="animate-fadeIn mt-4 space-y-4 rounded-xl border border-betano-border/60 bg-betano-surface/55 p-4">
              {/* Preset buttons */}
              <div className="space-y-1.5">
                <span className="block text-[11px] font-bold uppercase tracking-wider text-betano-muted">
                  Plantillas Rápidas de Cuotas
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => applyPreset('local-fav')}
                    className="cursor-pointer rounded border border-betano-border bg-white/5 px-2.5 py-1 text-[11px] font-bold text-white transition-colors hover:bg-white/10"
                  >
                    Local Super Favorito (≤ 1.45)
                  </button>
                  <button
                    onClick={() => applyPreset('away-fav')}
                    className="cursor-pointer rounded border border-betano-border bg-white/5 px-2.5 py-1 text-[11px] font-bold text-white transition-colors hover:bg-white/10"
                  >
                    Visita Favorito (≤ 1.65)
                  </button>
                  <button
                    onClick={() => applyPreset('balanced')}
                    className="cursor-pointer rounded border border-betano-border bg-white/5 px-2.5 py-1 text-[11px] font-bold text-white transition-colors hover:bg-white/10"
                  >
                    Equilibrado (Ambos ≥ 2.3)
                  </button>
                  <button
                    onClick={() => applyPreset('high-draw')}
                    className="cursor-pointer rounded border border-betano-border bg-white/5 px-2.5 py-1 text-[11px] font-bold text-white transition-colors hover:bg-white/10"
                  >
                    Empates Altamente Cotizados (≥ 3.8)
                  </button>
                </div>
              </div>

              {/* Grid of Min/Max inputs */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {/* Home Odd Range */}
                <div className="space-y-1.5">
                  <span className="block text-[11px] font-bold uppercase text-white">
                    Cuota Local (1)
                  </span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="0.05"
                      placeholder="Mín"
                      value={minHomeOdd}
                      onChange={(e) =>
                        handleFilterChange(setMinHomeOdd, e.target.value)
                      }
                      className="w-full rounded border border-betano-border bg-betano-card p-2 text-xs text-white outline-none focus:border-betano-primary"
                    />
                    <span className="text-xs text-betano-muted">-</span>
                    <input
                      type="number"
                      step="0.05"
                      placeholder="Máx"
                      value={maxHomeOdd}
                      onChange={(e) =>
                        handleFilterChange(setMaxHomeOdd, e.target.value)
                      }
                      className="w-full rounded border border-betano-border bg-betano-card p-2 text-xs text-white outline-none focus:border-betano-primary"
                    />
                  </div>
                </div>

                {/* Draw Odd Range */}
                <div className="space-y-1.5">
                  <span className="block text-[11px] font-bold uppercase text-white">
                    Cuota Empate (X)
                  </span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="0.05"
                      placeholder="Mín"
                      value={minDrawOdd}
                      onChange={(e) =>
                        handleFilterChange(setMinDrawOdd, e.target.value)
                      }
                      className="w-full rounded border border-betano-border bg-betano-card p-2 text-xs text-white outline-none focus:border-betano-primary"
                    />
                    <span className="text-xs text-betano-muted">-</span>
                    <input
                      type="number"
                      step="0.05"
                      placeholder="Máx"
                      value={maxDrawOdd}
                      onChange={(e) =>
                        handleFilterChange(setMaxDrawOdd, e.target.value)
                      }
                      className="w-full rounded border border-betano-border bg-betano-card p-2 text-xs text-white outline-none focus:border-betano-primary"
                    />
                  </div>
                </div>

                {/* Away Odd Range */}
                <div className="space-y-1.5">
                  <span className="block text-[11px] font-bold uppercase text-white">
                    Cuota Visita (2)
                  </span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="0.05"
                      placeholder="Mín"
                      value={minAwayOdd}
                      onChange={(e) =>
                        handleFilterChange(setMinAwayOdd, e.target.value)
                      }
                      className="w-full rounded border border-betano-border bg-betano-card p-2 text-xs text-white outline-none focus:border-betano-primary"
                    />
                    <span className="text-xs text-betano-muted">-</span>
                    <input
                      type="number"
                      step="0.05"
                      placeholder="Máx"
                      value={maxAwayOdd}
                      onChange={(e) =>
                        handleFilterChange(setMaxAwayOdd, e.target.value)
                      }
                      className="w-full rounded border border-betano-border bg-betano-card p-2 text-xs text-white outline-none focus:border-betano-primary"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Analytics Dashboard Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Metric 1: Total sample */}
        <div className="flex items-center space-x-4 rounded-2xl border border-betano-border/80 bg-betano-card p-4 shadow-md">
          <div className="rounded-xl border border-betano-primary/20 bg-betano-primary/10 p-3 text-betano-primary">
            <Award className="h-5 w-5" />
          </div>
          <div>
            <span className="block text-xs font-medium text-betano-muted">
              Partidos Filtrados
            </span>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-xl font-extrabold text-white">
                {stats.total}
              </span>
              <span className="text-xs text-betano-muted">
                de {fixtures.length}
              </span>
            </div>
            <span className="text-[10px] text-betano-muted">
              (
              {fixtures.length > 0
                ? ((stats.total / fixtures.length) * 100).toFixed(1)
                : 0}
              % de la base total)
            </span>
          </div>
        </div>

        {/* Metric 2: General accuracy */}
        <div className="flex flex-col justify-between rounded-2xl border border-betano-border/80 bg-betano-card p-4 shadow-md">
          <div className="flex items-center space-x-4">
            <div className="rounded-xl border border-green-500/20 bg-green-500/10 p-3 text-green-400">
              <Percent className="h-5 w-5" />
            </div>
            <div>
              <span className="block text-xs font-medium text-betano-muted">
                Precisión Algoritmo
              </span>
              <span className="text-xl font-extrabold text-white">
                {stats.accuracy.toFixed(1)}%
              </span>
            </div>
          </div>
          <div className="mt-2.5">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                style={{ width: `${stats.accuracy}%` }}
                className={`h-full rounded-full transition-all duration-500 ${
                  stats.accuracy >= 65
                    ? 'bg-green-500'
                    : stats.accuracy >= 50
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                }`}
              />
            </div>
            <div className="mt-1 flex justify-between text-[10px] text-betano-muted">
              <span>{stats.hits} aciertos</span>
              <span>{stats.misses} fallos</span>
            </div>
          </div>
        </div>

        {/* Metric 3: Outcomes distribution bar */}
        <div className="flex flex-col justify-between rounded-2xl border border-betano-border/80 bg-betano-card p-4 shadow-md">
          <div className="flex items-center space-x-4">
            <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/10 p-3 text-indigo-400">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <span className="block text-xs font-medium text-betano-muted">
                Distribución 1-X-2
              </span>
              <span className="text-sm font-bold text-white">
                {stats.homeWins}L | {stats.draws}X | {stats.awayWins}V
              </span>
            </div>
          </div>
          <div className="mt-2.5">
            <div className="flex h-2 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                style={{ width: `${stats.homeWinPct}%` }}
                className="h-full bg-green-500"
                title={`Local: ${stats.homeWinPct.toFixed(1)}%`}
              />
              <div
                style={{ width: `${stats.drawPct}%` }}
                className="h-full bg-yellow-500"
                title={`Empate: ${stats.drawPct.toFixed(1)}%`}
              />
              <div
                style={{ width: `${stats.awayWinPct}%` }}
                className="h-full bg-blue-500"
                title={`Visitante: ${stats.awayWinPct.toFixed(1)}%`}
              />
            </div>
            <div className="mt-1 flex justify-between font-mono text-[9px] text-betano-muted">
              <span>L:{stats.homeWinPct.toFixed(0)}%</span>
              <span>X:{stats.drawPct.toFixed(0)}%</span>
              <span>V:{stats.awayWinPct.toFixed(0)}%</span>
            </div>
          </div>
        </div>

        {/* Metric 4: Average winning odds */}
        <div className="flex items-center space-x-4 rounded-2xl border border-betano-border/80 bg-betano-card p-4 shadow-md">
          <div className="rounded-xl border border-orange-500/20 bg-orange-500/10 p-3 text-orange-400">
            <Flame className="h-5 w-5" />
          </div>
          <div>
            <span className="block text-xs font-medium text-betano-muted">
              Cuota Promedio Ganadora
            </span>
            <span className="text-xl font-extrabold text-white">
              {stats.avgWinningOdd > 0
                ? stats.avgWinningOdd.toFixed(2)
                : '0.00'}
            </span>
            <span className="mt-0.5 block text-[10px] text-betano-muted">
              Valor medio del resultado real
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Area: Match list */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-bold uppercase tracking-wider text-betano-muted">
            Partidos Analizados ({filteredMatches.length})
          </h3>
          <span className="text-xs text-betano-muted">
            Mostrando {displayedMatches.length} de {filteredMatches.length}
          </span>
        </div>

        {filteredMatches.length === 0 ? (
          <div className="space-y-3 rounded-2xl border border-betano-border bg-betano-card py-12 text-center text-betano-muted">
            <Info className="mx-auto h-8 w-8 text-betano-primary opacity-60" />
            <p className="text-base font-bold text-white">
              No se encontraron partidos
            </p>
            <p className="mx-auto max-w-sm text-xs">
              No hay enfrentamientos que cumplan con los criterios de búsqueda y
              filtros seleccionados. Intenta reiniciar tus filtros.
            </p>
            <button
              onClick={resetAllFilters}
              className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-betano-primary px-4 py-2 text-xs font-bold text-white shadow-md shadow-betano-primary/20 transition-opacity hover:opacity-95"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Ver Todos los Partidos
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {displayedMatches.map((match) => {
                const homeOdd = match.odds?.home || 1;
                const drawOdd = match.odds?.draw || 1;
                const awayOdd = match.odds?.away || 1;
                const homeScore = match.score?.home ?? 0;
                const awayScore = match.score?.away ?? 0;

                const predInfo = getPrediction(homeOdd, drawOdd, awayOdd);
                const isHit = isPredictionHit(predInfo.type, match.score);
                const actualWinner =
                  homeScore > awayScore
                    ? 'HOME'
                    : homeScore < awayScore
                      ? 'AWAY'
                      : 'DRAW';

                return (
                  <div
                    key={match.id}
                    className={`flex flex-col justify-between overflow-hidden rounded-xl border bg-betano-card shadow-md transition-all duration-300 hover:scale-[1.01] hover:shadow-lg ${
                      isHit
                        ? 'border-green-500/20 hover:border-green-500/40'
                        : 'border-betano-border hover:border-betano-light'
                    }`}
                  >
                    {/* Card Header */}
                    <div className="flex items-center justify-between border-b border-betano-border/60 bg-slate-900/45 px-4 py-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5 text-betano-muted" />
                        <span className="font-mono text-[11px] font-medium text-betano-muted">
                          ID: {match.id}{' '}
                          {match.date_str ? `• ${match.date_str}` : ''}
                        </span>
                      </div>
                      <div>
                        {actualWinner === 'HOME' && (
                          <span className="rounded border border-green-500/20 bg-green-500/10 px-2 py-0.5 text-[9px] font-bold uppercase text-green-400">
                            Victoria Local
                          </span>
                        )}
                        {actualWinner === 'DRAW' && (
                          <span className="rounded border border-yellow-500/20 bg-yellow-500/10 px-2 py-0.5 text-[9px] font-bold uppercase text-yellow-400">
                            Empate
                          </span>
                        )}
                        {actualWinner === 'AWAY' && (
                          <span className="rounded border border-blue-500/20 bg-blue-500/10 px-2 py-0.5 text-[9px] font-bold uppercase text-blue-400">
                            Victoria Visita
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-grow flex-col justify-between space-y-4 p-4">
                      {/* Teams and Scores */}
                      <div className="grid grid-cols-7 items-center gap-2">
                        {/* Home Team */}
                        <div className="col-span-3 text-right">
                          <span
                            className="block truncate text-xs font-semibold text-white md:text-sm"
                            title={match.home_team}
                          >
                            {match.home_team}
                          </span>
                          <span className="mt-1 inline-block rounded-full bg-white/5 px-1.5 py-0.5 text-[9px] font-medium text-betano-muted">
                            PPG: {match.home_ppg.toFixed(2)}
                          </span>
                        </div>

                        {/* Score Box */}
                        <div className="col-span-1 flex flex-col items-center justify-center">
                          <div className="truncate rounded-md border border-betano-border bg-slate-900 px-2 py-1 text-xs font-black tracking-wider text-white shadow-inner">
                            {homeScore} - {awayScore}
                          </div>
                          <span className="inline-flex items-center gap-0.5 rounded bg-green-500/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-green-400">
                            {difference(match.home_ppg, match.away_ppg)}
                          </span>
                        </div>

                        {/* Away Team */}
                        <div className="col-span-3 text-left">
                          <span
                            className="block truncate text-xs font-semibold text-white md:text-sm"
                            title={match.away_team}
                          >
                            {match.away_team}
                          </span>
                          <span className="mt-1 inline-block rounded-full bg-white/5 px-1.5 py-0.5 text-[9px] font-medium text-betano-muted">
                            PPG: {match.away_ppg.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      {/* Odds Section styled like sportsbook buttons */}
                      <div className="space-y-1.5 pt-2">
                        {/* <div className="flex justify-between items-center text-[9px] text-betano-muted px-1"> */}
                        {/*   <span>Local (1)</span> */}
                        {/*   <span>Empate (X)</span> */}
                        {/*   <span>Visita (2)</span> */}
                        {/* </div> */}
                        <div className="grid grid-cols-3 gap-1.5">
                          {/* Home Odds Button */}
                          <div
                            className={`flex flex-col items-center justify-center rounded-lg border px-2 py-1.5 text-center transition-all ${
                              actualWinner === 'HOME'
                                ? 'border-green-500/40 bg-green-500/10 font-bold text-green-400'
                                : 'border-betano-border/60 bg-slate-900/30 text-betano-muted'
                            }`}
                          >
                            <span className="text-[9px] opacity-70">1</span>
                            <span className="text-xs font-semibold">
                              {homeOdd.toFixed(2)}
                            </span>
                          </div>

                          {/* Draw Odds Button */}
                          <div
                            className={`flex flex-col items-center justify-center rounded-lg border px-2 py-1.5 text-center transition-all ${
                              actualWinner === 'DRAW'
                                ? 'border-yellow-500/40 bg-yellow-500/10 font-bold text-yellow-400'
                                : 'border-betano-border/60 bg-slate-900/30 text-betano-muted'
                            }`}
                          >
                            <span className="text-[9px] opacity-70">X</span>
                            <span className="text-xs font-semibold">
                              {drawOdd.toFixed(2)}
                            </span>
                          </div>

                          {/* Away Odds Button */}
                          <div
                            className={`flex flex-col items-center justify-center rounded-lg border px-2 py-1.5 text-center transition-all ${
                              actualWinner === 'AWAY'
                                ? 'border-blue-500/40 bg-blue-500/10 font-bold text-blue-400'
                                : 'border-betano-border/60 bg-slate-900/30 text-betano-muted'
                            }`}
                          >
                            <span className="text-[9px] opacity-70">2</span>
                            <span className="text-xs font-semibold">
                              {awayOdd.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Prediction Result Section */}
                      <div className="mt-4 space-y-2 rounded-lg border border-betano-border/40 bg-slate-950/40 p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Lightbulb className="h-3.5 w-3.5 text-yellow-500" />
                            <span className="text-[11px] font-bold text-white">
                              Pronóstico Fórmula
                            </span>
                          </div>
                          <div>
                            {isHit ? (
                              <span className="inline-flex items-center gap-0.5 rounded bg-green-500/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-green-400">
                                <CheckCircle className="h-2.5 w-2.5" /> SI
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-0.5 rounded bg-red-500/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-red-400">
                                <XCircle className="h-2.5 w-2.5" /> NO
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-betano-muted">
                            Sugerencia:
                          </span>
                          <span className="rounded border border-yellow-500/15 bg-yellow-500/5 px-2 py-0.5 text-[10px] font-bold text-yellow-500">
                            {predInfo.label}
                          </span>
                        </div>

                        <div className="flex items-center justify-between border-t border-betano-border/30 pt-1.5 text-[9px] text-betano-muted">
                          <span>Dif. de Cuotas (H/D/A):</span>
                          <span className="rounded bg-slate-900 px-1 py-0.5 font-mono text-[8px] text-betano-muted">
                            {predInfo.details}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination Controls */}
            {filteredMatches.length > displayedMatches.length && (
              <div className="flex justify-center pb-4 pt-6">
                <button
                  onClick={() => setVisibleCount((prev) => prev + 30)}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-betano-border bg-betano-card px-6 py-3 text-sm font-bold text-white shadow-md shadow-black/20 transition-all hover:border-betano-primary/40 hover:bg-betano-light/45 hover:text-betano-primary"
                >
                  Cargar más partidos
                  <ArrowRight className="h-4 w-4" />
                  <span className="ml-1 rounded-full bg-slate-900/55 px-2 py-0.5 text-xs font-normal text-betano-muted">
                    {filteredMatches.length - displayedMatches.length} restantes
                  </span>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
