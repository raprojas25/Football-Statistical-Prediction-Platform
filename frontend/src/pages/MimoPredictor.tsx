import { useState, useMemo } from 'react';
import { Link } from 'react-router';
import {
  Search,
  SlidersHorizontal,
  Percent,
  CheckCircle,
  XCircle,
  Filter,
  RefreshCw,
  Award,
  ChevronDown,
  ChevronUp,
  Info,
  Calendar,
  ArrowRight,
  X,
  Target,
  Activity,
  Globe,
  Loader,
  TrendingUp,
  Zap,
  Shield,
} from 'lucide-react';
import { useOddsFixtures } from '@/hooks/useOddsFixtures';
import { Badge } from '@/components/ui/Bagde';
import { LEAGUES } from '@/constants/leagues';

interface MimoPrediction {
  type:
    | 'HOME'
    | 'DRAW'
    | 'AWAY'
    | 'HOME_DRAW'
    | 'AWAY_DRAW'
    | 'HOME_AWAY'
    | 'NA';
  label: string;
  confidence: number;
  modelProbs: { home: number; draw: number; away: number };
  marketProbs: { home: number; draw: number; away: number };
  kellyStake: number;
  expectedGoals: { home: number; away: number };
  valueEdge: number;
  ratingHome: number;
  ratingAway: number;
  details: string;
}

const LEAGUE_AVG_GOALS = 2.8;

function poissonProbability(lambda: number, k: number): number {
  let result = Math.exp(-lambda);
  for (let i = 1; i <= k; i++) {
    result *= lambda / i;
  }
  return result;
}

function calculateMatchProbs(
  homeXg: number,
  awayXg: number,
): { home: number; draw: number; away: number } {
  const maxGoals = 8;
  let homeWin = 0;
  let draw = 0;
  let awayWin = 0;

  for (let i = 0; i <= maxGoals; i++) {
    for (let j = 0; j <= maxGoals; j++) {
      const p = poissonProbability(homeXg, i) * poissonProbability(awayXg, j);
      if (i > j) homeWin += p;
      else if (i === j) draw += p;
      else awayWin += p;
    }
  }

  const total = homeWin + draw + awayWin;
  return {
    home: homeWin / total,
    draw: draw / total,
    away: awayWin / total,
  };
}

function calculateTeamStrength(
  rank: number,
  winPct: number,
  gf: number,
  ga: number,
  pts: number,
  mp: number,
): number {
  const rankScore = Math.max(0, (19 - rank) / 18);
  const winScore = winPct / 100;
  const gdPerGame = mp > 0 ? (gf - ga) / mp : 0;
  const gdScore = Math.min(1, Math.max(0, (gdPerGame + 2) / 4));
  const ppgScore = mp > 0 ? Math.min(1, pts / (mp * 3)) : 0.5;

  return rankScore * 0.3 + winScore * 0.3 + gdScore * 0.2 + ppgScore * 0.2;
}

function calculateExpectedGoals(
  homeStrength: number,
  awayStrength: number,
): { home: number; away: number } {
  const homeAdvantage = 1.15;
  const baseGoals = LEAGUE_AVG_GOALS / 2;

  const homeAttack = baseGoals * (0.6 + homeStrength * 0.8) * homeAdvantage;
  const homeDefense = baseGoals * (1.4 - homeStrength * 0.6);
  const awayAttack = baseGoals * (0.6 + awayStrength * 0.8);
  const awayDefense = baseGoals * (1.4 - awayStrength * 0.6);

  const homeXg = (homeAttack + awayDefense) / 2;
  const awayXg = (awayAttack + homeDefense) / 2;

  return {
    home: Math.max(0.3, Math.min(4.0, homeXg)),
    away: Math.max(0.3, Math.min(4.0, awayXg)),
  };
}

function calcImpliedProbs(home: number, draw: number, away: number) {
  const rawHome = 1 / home;
  const rawDraw = 1 / draw;
  const rawAway = 1 / away;
  const margin = rawHome + rawDraw + rawAway - 1;
  return {
    home: rawHome / (1 + margin),
    draw: rawDraw / (1 + margin),
    away: rawAway / (1 + margin),
  };
}

function kellyCriterion(prob: number, odds: number): number {
  const q = 1 - prob;
  const b = odds - 1;
  const kelly = (prob * b - q) / b;
  return Math.max(0, Math.min(0.25, kelly));
}

function getMimoPrediction(
  homeOdd: number,
  drawOdd: number,
  awayOdd: number,
  homeStrength: number,
  awayStrength: number,
): MimoPrediction {
  const marketProbs = calcImpliedProbs(homeOdd, drawOdd, awayOdd);

  const { home: homeXg, away: awayXg } = calculateExpectedGoals(
    homeStrength,
    awayStrength,
  );
  const modelProbs = calculateMatchProbs(homeXg, awayXg);

  const diffHome = modelProbs.home - marketProbs.home;
  const diffDraw = modelProbs.draw - marketProbs.draw;
  const diffAway = modelProbs.away - marketProbs.away;

  const homeKelly = kellyCriterion(modelProbs.home, homeOdd);
  const drawKelly = kellyCriterion(modelProbs.draw, drawOdd);
  const awayKelly = kellyCriterion(modelProbs.away, awayOdd);

  const valueEdges = [
    {
      label: 'HOME' as const,
      edge: diffHome,
      kelly: homeKelly,
      prob: modelProbs.home,
    },
    {
      label: 'DRAW' as const,
      edge: diffDraw,
      kelly: drawKelly,
      prob: modelProbs.draw,
    },
    {
      label: 'AWAY' as const,
      edge: diffAway,
      kelly: awayKelly,
      prob: modelProbs.away,
    },
  ];
  valueEdges.sort((a, b) => b.edge - a.edge);

  const top = valueEdges[0];
  const second = valueEdges[1];

  const confidence = Math.min(
    100,
    Math.round(Math.abs(top.edge) * 200 + top.kelly * 100),
  );
  const kellyStake = top.kelly;
  const valueEdge = top.edge;

  const details = `xG: ${homeXg.toFixed(2)}-${awayXg.toFixed(2)} | Mkt: ${(marketProbs.home * 100).toFixed(0)}/${(marketProbs.draw * 100).toFixed(0)}/${(marketProbs.away * 100).toFixed(0)} | Model: ${(modelProbs.home * 100).toFixed(0)}/${(modelProbs.draw * 100).toFixed(0)}/${(modelProbs.away * 100).toFixed(0)}`;

  if (homeOdd > 8 || awayOdd > 8) {
    return {
      type: 'NA',
      label: 'NA',
      confidence: 0,
      modelProbs,
      marketProbs,
      kellyStake: 0,
      expectedGoals: { home: homeXg, away: awayXg },
      valueEdge: 0,
      ratingHome: homeStrength,
      ratingAway: awayStrength,
      details,
    };
  }

  if (top.edge < 0.02) {
    if (second.edge > 0.01) {
      if (second.label === 'HOME') {
        return {
          type: 'HOME_DRAW',
          label: '1X',
          confidence: Math.min(confidence, 55),
          modelProbs,
          marketProbs,
          kellyStake: Math.max(homeKelly, drawKelly),
          expectedGoals: { home: homeXg, away: awayXg },
          valueEdge: second.edge,
          ratingHome: homeStrength,
          ratingAway: awayStrength,
          details,
        };
      }
      return {
        type: 'AWAY_DRAW',
        label: '2X',
        confidence: Math.min(confidence, 55),
        modelProbs,
        marketProbs,
        kellyStake: Math.max(awayKelly, drawKelly),
        expectedGoals: { home: homeXg, away: awayXg },
        valueEdge: second.edge,
        ratingHome: homeStrength,
        ratingAway: awayStrength,
        details,
      };
    }
    return {
      type: 'NA',
      label: 'SIN VALOR',
      confidence: 0,
      modelProbs,
      marketProbs,
      kellyStake: 0,
      expectedGoals: { home: homeXg, away: awayXg },
      valueEdge: 0,
      ratingHome: homeStrength,
      ratingAway: awayStrength,
      details,
    };
  }

  if (top.label === 'HOME') {
    if (top.edge > 0.08) {
      return {
        type: 'AWAY',
        label: 'LOCAL (2)',
        confidence,
        modelProbs,
        marketProbs,
        kellyStake,
        expectedGoals: { home: homeXg, away: awayXg },
        valueEdge,
        ratingHome: homeStrength,
        ratingAway: awayStrength,
        details,
      };
    }
    if (second.label === 'DRAW') {
      return {
        type: 'HOME_DRAW',
        label: '1X',
        confidence,
        modelProbs,
        marketProbs,
        kellyStake,
        expectedGoals: { home: homeXg, away: awayXg },
        valueEdge,
        ratingHome: homeStrength,
        ratingAway: awayStrength,
        details,
      };
    }
    return {
      type: 'HOME_AWAY',
      label: '12',
      confidence,
      modelProbs,
      marketProbs,
      kellyStake,
      expectedGoals: { home: homeXg, away: awayXg },
      valueEdge,
      ratingHome: homeStrength,
      ratingAway: awayStrength,
      details,
    };
  }

  if (top.label === 'AWAY') {
    if (top.edge > 0.08) {
      return {
        type: 'HOME',
        label: 'VISITA (1)',
        confidence,
        modelProbs,
        marketProbs,
        kellyStake,
        expectedGoals: { home: homeXg, away: awayXg },
        valueEdge,
        ratingHome: homeStrength,
        ratingAway: awayStrength,
        details,
      };
    }
    if (second.label === 'DRAW') {
      return {
        type: 'AWAY_DRAW',
        label: '2X',
        confidence,
        modelProbs,
        marketProbs,
        kellyStake,
        expectedGoals: { home: homeXg, away: awayXg },
        valueEdge,
        ratingHome: homeStrength,
        ratingAway: awayStrength,
        details,
      };
    }
    return {
      type: 'HOME_AWAY',
      label: '12',
      confidence,
      modelProbs,
      marketProbs,
      kellyStake,
      expectedGoals: { home: homeXg, away: awayXg },
      valueEdge,
      ratingHome: homeStrength,
      ratingAway: awayStrength,
      details,
    };
  }

  if (top.edge > 0.05) {
    return {
      type: 'DRAW',
      label: 'EMPATE (X)',
      confidence,
      modelProbs,
      marketProbs,
      kellyStake,
      expectedGoals: { home: homeXg, away: awayXg },
      valueEdge,
      ratingHome: homeStrength,
      ratingAway: awayStrength,
      details,
    };
  }

  if (second.label === 'HOME') {
    return {
      type: 'HOME_DRAW',
      label: '1X',
      confidence,
      modelProbs,
      marketProbs,
      kellyStake,
      expectedGoals: { home: homeXg, away: awayXg },
      valueEdge,
      ratingHome: homeStrength,
      ratingAway: awayStrength,
      details,
    };
  }
  return {
    type: 'AWAY_DRAW',
    label: '2X',
    confidence,
    modelProbs,
    marketProbs,
    kellyStake,
    expectedGoals: { home: homeXg, away: awayXg },
    valueEdge,
    ratingHome: homeStrength,
    ratingAway: awayStrength,
    details,
  };
}

function isPredictionHit(
  predType: string,
  score: { home: number; away: number } | undefined,
): boolean {
  if (!score) return false;
  const actual =
    score.home > score.away
      ? 'HOME'
      : score.home < score.away
        ? 'AWAY'
        : 'DRAW';
  if (predType === 'HOME' && actual === 'HOME') return true;
  if (predType === 'AWAY' && actual === 'AWAY') return true;
  if (predType === 'DRAW' && actual === 'DRAW') return true;
  if (predType === 'HOME_DRAW' && (actual === 'HOME' || actual === 'DRAW'))
    return true;
  if (predType === 'AWAY_DRAW' && (actual === 'AWAY' || actual === 'DRAW'))
    return true;
  if (predType === 'HOME_AWAY' && (actual === 'HOME' || actual === 'AWAY'))
    return true;
  if (predType === 'NA') return true;
  return false;
}

export const MimoPredictor = () => {
  const [selectedLeague, setSelectedLeague] = useState('alemania');
  const {
    isLoading,
    data: odds,
    fixtures,
  } = useOddsFixtures(`odds/${selectedLeague}.json`);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedActualResult, setSelectedActualResult] =
    useState<string>('ALL');
  const [selectedPrediction, setSelectedPrediction] = useState<string>('ALL');
  const [predictionHitFilter, setPredictionHitFilter] = useState<string>('ALL');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [minConfidence, setMinConfidence] = useState<string>('');
  const [minKelly, setMinKelly] = useState<string>('');
  const [visibleCount, setVisibleCount] = useState<number>(30);

  const teamStrengthMap = useMemo(() => {
    const standings = (odds as any)?.standings;
    if (!standings || !Array.isArray(standings)) return {};
    const map: Record<string, number> = {};
    for (const t of standings) {
      map[t.team] = calculateTeamStrength(
        t.rank,
        t.win_pct,
        t.gf,
        t.ga,
        t.pts,
        t.mp,
      );
    }
    return map;
  }, [odds]);

  const enrichedFixtures = useMemo(() => {
    return fixtures.map((m) => {
      const homeStr = teamStrengthMap[m.home_team] ?? 0.5;
      const awayStr = teamStrengthMap[m.away_team] ?? 0.5;
      const pred = getMimoPrediction(
        m.odds?.home ?? 2,
        m.odds?.draw ?? 3,
        m.odds?.away ?? 2,
        homeStr,
        awayStr,
      );
      return { ...m, mimoPred: pred };
    });
  }, [fixtures, teamStrengthMap]);

  const filteredMatches = useMemo(() => {
    return enrichedFixtures.filter((m) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (
          !m.home_team.toLowerCase().includes(q) &&
          !m.away_team.toLowerCase().includes(q)
        )
          return false;
      }
      if (selectedActualResult !== 'ALL' && m.score) {
        const actual =
          m.score.home > m.score.away
            ? 'HOME'
            : m.score.home < m.score.away
              ? 'AWAY'
              : 'DRAW';
        if (actual !== selectedActualResult) return false;
      }
      if (
        selectedPrediction !== 'ALL' &&
        m.mimoPred.type !== selectedPrediction
      )
        return false;
      if (predictionHitFilter !== 'ALL' && m.score) {
        const isHit = isPredictionHit(m.mimoPred.type, m.score);
        if (predictionHitFilter === 'HIT' && !isHit) return false;
        if (predictionHitFilter === 'MISS' && isHit) return false;
      }
      if (minConfidence && m.mimoPred.confidence < parseInt(minConfidence))
        return false;
      if (minKelly && m.mimoPred.kellyStake < parseFloat(minKelly))
        return false;
      return true;
    });
  }, [
    enrichedFixtures,
    searchQuery,
    selectedActualResult,
    selectedPrediction,
    predictionHitFilter,
    minConfidence,
    minKelly,
  ]);

  const handleFilterChange = (setter: (v: any) => void, val: any) => {
    setter(val);
    setVisibleCount(30);
  };

  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedActualResult('ALL');
    setSelectedPrediction('ALL');
    setPredictionHitFilter('ALL');
    setMinConfidence('');
    setMinKelly('');
    setVisibleCount(30);
  };

  const stats = useMemo(() => {
    const total = filteredMatches.length;
    if (total === 0)
      return {
        total: 0,
        hits: 0,
        misses: 0,
        accuracy: 0,
        avgKelly: 0,
        avgConfidence: 0,
        valueBets: 0,
      };
    let hits = 0,
      misses = 0,
      sumKelly = 0,
      sumConf = 0,
      valueBets = 0;
    filteredMatches.forEach((m) => {
      if (isPredictionHit(m.mimoPred.type, m.score)) hits++;
      else misses++;
      sumKelly += m.mimoPred.kellyStake;
      sumConf += m.mimoPred.confidence;
      if (m.mimoPred.valueEdge > 0.05) valueBets++;
    });
    return {
      total,
      hits,
      misses,
      accuracy: total > 0 ? (hits / total) * 100 : 0,
      avgKelly: total > 0 ? (sumKelly / total) * 100 : 0,
      avgConfidence: total > 0 ? sumConf / total : 0,
      valueBets,
    };
  }, [filteredMatches]);

  const displayedMatches = useMemo(
    () => filteredMatches.slice(0, visibleCount),
    [filteredMatches, visibleCount],
  );

  if (isLoading) {
    return (
      <div className="flex min-h-[450px] flex-col items-center justify-center space-y-4">
        <Loader className="h-10 w-10 animate-spin text-emerald-400" />
        <p className="text-betano-muted animate-pulse text-sm font-semibold">
          Calculando ratings Mimo...
        </p>
      </div>
    );
  }

  const leagueLabel = odds?.league
    ? `${odds.league.toUpperCase()} (${odds.country?.toUpperCase() || ''})`
    : '';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="to-betano-surface relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-gradient-to-r from-emerald-900/80 p-6 shadow-xl">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Zap className="h-48 w-48 text-white" />
        </div>
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-3 py-1 text-[11px] font-bold tracking-wider text-emerald-400 uppercase">
            <Zap className="h-3 w-3" /> Modelo Poisson + Kelly Criterion
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className="flex items-center gap-3 text-2xl font-black tracking-tight text-white md:text-3xl">
              <Target className="h-7 w-7 text-emerald-400" />
              Mimo Predictor
            </h1>
            <Link
              to={`/equipos?liga=${selectedLeague}`}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-cyan-500/30 bg-cyan-600/20 px-3 py-1.5 text-[11px] font-bold text-cyan-300 transition-all hover:bg-cyan-600/30"
            >
              <Activity className="h-3.5 w-3.5" /> Fiabilidad por Equipo
            </Link>
          </div>
          <p className="text-betano-muted max-w-2xl text-sm">
            {leagueLabel && <>{leagueLabel} • </>}Temp.{' '}
            {odds?.season || 'Actual'}. Algoritmo de
            <span className="font-bold text-emerald-400"> Poisson </span> para
            xG esperados +
            <span className="font-bold text-emerald-400">
              {' '}
              Kelly Criterion{' '}
            </span>{' '}
            para detectar value bets. Compara probabilidades del modelo vs
            mercado para encontrar ventajas.
          </p>
        </div>
      </div>

      {/* League Tabs */}
      <div className="border-betano-border/70 bg-betano-card rounded-2xl border p-3 shadow-lg">
        <div className="mb-2 flex items-center gap-2 px-1">
          <Globe className="h-4 w-4 text-emerald-400" />
          <span className="text-betano-muted text-[11px] font-bold tracking-wider uppercase">
            Seleccionar Liga
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {LEAGUES.map((l) => (
            <button
              key={l.id}
              onClick={() => setSelectedLeague(l.id)}
              className={`cursor-pointer rounded-lg border px-3 py-1.5 text-xs font-bold transition-all ${
                selectedLeague === l.id
                  ? 'border-emerald-500 bg-emerald-600 text-white shadow-md shadow-emerald-600/15'
                  : 'border-betano-border bg-betano-surface text-betano-muted hover:bg-betano-light/40 hover:text-white'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="border-betano-border bg-betano-card space-y-5 rounded-2xl border p-5 shadow-lg">
        <div className="border-betano-border/60 flex flex-wrap items-center justify-between gap-4 border-b pb-3">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-emerald-400" />
            <h2 className="text-md font-bold tracking-wider text-white uppercase">
              Filtros
            </h2>
          </div>
          <button
            onClick={resetAllFilters}
            className="border-betano-border inline-flex cursor-pointer items-center gap-1.5 rounded-lg border bg-white/5 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-white/10"
          >
            <RefreshCw className="h-3 w-3" /> Reiniciar
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-betano-muted block text-xs font-bold tracking-wider uppercase">
              Buscar Equipo
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Ej. Bayern, Dortmund..."
                value={searchQuery}
                onChange={(e) =>
                  handleFilterChange(setSearchQuery, e.target.value)
                }
                className="border-betano-border bg-betano-surface w-full rounded-lg border py-2.5 pr-4 pl-12 text-sm text-white placeholder-gray-500 transition-all outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/40"
              />
              <Search className="absolute top-2.5 left-3.5 h-4.5 w-4.5 text-gray-500" />
              {searchQuery && (
                <button
                  onClick={() => handleFilterChange(setSearchQuery, '')}
                  className="absolute top-2.5 right-3 cursor-pointer text-gray-500 hover:text-white"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              )}
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-betano-muted block text-xs font-bold tracking-wider uppercase">
              Resultado Real
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'ALL', label: 'Todos' },
                { id: 'HOME', label: 'Local' },
                { id: 'DRAW', label: 'Empate' },
                { id: 'AWAY', label: 'Visita' },
              ].map((btn) => (
                <button
                  key={btn.id}
                  onClick={() =>
                    handleFilterChange(setSelectedActualResult, btn.id)
                  }
                  className={`cursor-pointer rounded-lg border py-2 text-xs font-bold transition-all ${selectedActualResult === btn.id ? 'border-emerald-600 bg-emerald-600 text-white shadow-md shadow-emerald-600/20' : 'border-betano-border bg-betano-surface text-betano-muted hover:bg-betano-light/40 hover:text-white'}`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 pt-1 md:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-betano-muted block text-xs font-bold tracking-wider uppercase">
              Predicción Mimo
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
                  className={`cursor-pointer rounded-lg border py-2 text-xs font-bold transition-all ${selectedPrediction === btn.id ? 'border-emerald-600 bg-emerald-600 text-white shadow-md' : 'border-betano-border bg-betano-surface text-betano-muted hover:bg-betano-light/40 hover:text-white'}`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-betano-muted block text-xs font-bold tracking-wider uppercase">
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
                  className={`cursor-pointer rounded-lg border py-2 text-xs font-bold transition-all ${predictionHitFilter === btn.id ? (btn.id === 'HIT' ? 'border-green-600 bg-green-600 text-white shadow-md' : 'border-red-600 bg-red-600 text-white shadow-md') : 'border-betano-border bg-betano-surface text-betano-muted hover:bg-betano-light/40 hover:text-white'}`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Advanced */}
        <div className="border-betano-border/40 border-t pt-2">
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="text-betano-muted inline-flex cursor-pointer items-center gap-2 text-xs font-bold transition-colors hover:text-white"
          >
            <SlidersHorizontal className="h-3.5 w-3.5 text-emerald-400" />
            {showAdvancedFilters
              ? 'Ocultar Filtros Avanzados'
              : 'Mostrar Filtros Avanzados'}
            {showAdvancedFilters ? (
              <ChevronUp className="h-3.5 w-3.5" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5" />
            )}
          </button>
          {showAdvancedFilters && (
            <div className="animate-fadeIn border-betano-border/60 bg-betano-surface/55 mt-4 space-y-4 rounded-xl border p-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-1.5">
                  <span className="block text-[11px] font-bold text-white uppercase">
                    Confianza Mínima
                  </span>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    placeholder="0-100"
                    value={minConfidence}
                    onChange={(e) =>
                      handleFilterChange(setMinConfidence, e.target.value)
                    }
                    className="border-betano-border bg-betano-card w-full rounded border p-2 text-xs text-white outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <span className="block text-[11px] font-bold text-white uppercase">
                    Kelly Mínimo (%)
                  </span>
                  <input
                    type="number"
                    min="0"
                    max="25"
                    step="0.5"
                    placeholder="0-25"
                    value={minKelly}
                    onChange={(e) =>
                      handleFilterChange(setMinKelly, e.target.value)
                    }
                    className="border-betano-border bg-betano-card w-full rounded border p-2 text-xs text-white outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Analytics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="border-betano-border/80 bg-betano-card flex items-center space-x-4 rounded-2xl border p-4 shadow-md">
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-emerald-400">
            <Award className="h-5 w-5" />
          </div>
          <div>
            <span className="text-betano-muted block text-xs font-medium">
              Partidos Analizados
            </span>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-xl font-extrabold text-white">
                {stats.total}
              </span>
              <span className="text-betano-muted text-xs">
                de {fixtures.length}
              </span>
            </div>
          </div>
        </div>

        <div className="border-betano-border/80 bg-betano-card flex flex-col justify-between rounded-2xl border p-4 shadow-md">
          <div className="flex items-center space-x-4">
            <div className="rounded-xl border border-green-500/20 bg-green-500/10 p-3 text-green-400">
              <Percent className="h-5 w-5" />
            </div>
            <div>
              <span className="text-betano-muted block text-xs font-medium">
                Precisión del Modelo
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
                className={`h-full rounded-full transition-all duration-500 ${stats.accuracy >= 65 ? 'bg-green-500' : stats.accuracy >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
              />
            </div>
            <div className="text-betano-muted mt-1 flex justify-between text-[10px]">
              <span>{stats.hits} aciertos</span>
              <span>{stats.misses} fallos</span>
            </div>
          </div>
        </div>

        <div className="border-betano-border/80 bg-betano-card flex flex-col justify-between rounded-2xl border p-4 shadow-md">
          <div className="flex items-center space-x-4">
            <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/10 p-3 text-cyan-400">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <span className="text-betano-muted block text-xs font-medium">
                Value Bets Detectados
              </span>
              <span className="text-xl font-extrabold text-white">
                {stats.valueBets}
              </span>
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-betano-muted mt-1 flex justify-between text-[10px]">
              <span>Kelly promedio</span>
              <span>{stats.avgKelly.toFixed(1)}%</span>
            </div>
          </div>
        </div>

        <div className="border-betano-border/80 bg-betano-card flex flex-col justify-between rounded-2xl border p-4 shadow-md">
          <div className="flex items-center space-x-4">
            <div className="rounded-xl border border-purple-500/20 bg-purple-500/10 p-3 text-purple-400">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <span className="text-betano-muted block text-xs font-medium">
                Confianza Promedio
              </span>
              <span className="text-xl font-extrabold text-white">
                {stats.avgConfidence.toFixed(1)}%
              </span>
            </div>
          </div>
          <div className="mt-2.5">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                style={{ width: `${Math.min(100, stats.avgConfidence)}%` }}
                className="h-full rounded-full bg-purple-500 transition-all duration-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Match Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-betano-muted text-sm font-bold tracking-wider uppercase">
            Partidos Analizados ({filteredMatches.length})
          </h3>
          <span className="text-betano-muted text-xs">
            Mostrando {displayedMatches.length} de {filteredMatches.length}
          </span>
        </div>

        {filteredMatches.length === 0 ? (
          <div className="border-betano-border bg-betano-card text-betano-muted space-y-3 rounded-2xl border py-12 text-center">
            <Info className="mx-auto h-8 w-8 text-emerald-400 opacity-60" />
            <p className="text-base font-bold text-white">
              No se encontraron partidos
            </p>
            <p className="mx-auto max-w-sm text-xs">
              No hay enfrentamientos que cumplan los filtros seleccionados.
            </p>
            <button
              onClick={resetAllFilters}
              className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-emerald-600/20 transition-opacity hover:opacity-95"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Ver Todos
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {displayedMatches.map((match) => {
                const pred = match.mimoPred;
                const isHit = isPredictionHit(pred.type, match.score);
                const homeScore = match.score?.home ?? 0;
                const awayScore = match.score?.away ?? 0;
                const actualWinner =
                  homeScore > awayScore
                    ? 'HOME'
                    : homeScore < awayScore
                      ? 'AWAY'
                      : 'DRAW';

                return (
                  <div
                    key={match.id}
                    className={`bg-betano-card flex flex-col justify-between overflow-hidden rounded-xl border shadow-md transition-all duration-300 hover:scale-[1.01] hover:shadow-lg ${isHit ? 'border-emerald-500/30 hover:border-emerald-500/50' : 'border-betano-border hover:border-betano-light'}`}
                  >
                    {/* Header */}
                    <div className="border-betano-border/60 flex items-center justify-between border-b bg-slate-900/45 px-4 py-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="text-betano-muted h-3.5 w-3.5" />
                        <span className="text-betano-muted font-mono text-[11px] font-medium">
                          ID: {match.id}
                          {match.date_str ? ` • ${match.date_str}` : ''}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {pred.valueEdge > 0.05 && (
                          <Badge
                            variant="success"
                            size="xs"
                            className="border border-emerald-500/20"
                          >
                            VALUE
                          </Badge>
                        )}
                        {actualWinner === 'HOME' && (
                          <Badge variant="success" size="xs">
                            Local
                          </Badge>
                        )}
                        {actualWinner === 'DRAW' && (
                          <Badge variant="warning" size="xs">
                            Empate
                          </Badge>
                        )}
                        {actualWinner === 'AWAY' && (
                          <Badge variant="blue" size="xs">
                            Visita
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-grow flex-col justify-between space-y-3 p-4">
                      {/* Teams with Ratings */}
                      <div className="grid grid-cols-7 items-center gap-2">
                        <div className="col-span-3 text-right">
                          <span
                            className="block truncate text-xs font-semibold text-white md:text-sm"
                            title={match.home_team}
                          >
                            {match.home_team}
                          </span>
                          <div className="mt-1 flex items-center justify-end gap-1">
                            <span className="inline-block rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-bold text-emerald-400">
                              {pred.ratingHome > 0.7
                                ? 'ALT'
                                : pred.ratingHome > 0.4
                                  ? 'MED'
                                  : 'BAJ'}
                            </span>
                            <span className="text-betano-muted text-[9px]">
                              {(pred.ratingHome * 100).toFixed(0)}
                            </span>
                          </div>
                        </div>
                        <div className="col-span-1 flex flex-col items-center justify-center">
                          <div className="border-betano-border truncate rounded-md border bg-slate-900 px-2 py-1 text-xs font-black tracking-wider text-white shadow-inner">
                            {homeScore} - {awayScore}
                          </div>
                          <div className="text-betano-muted mt-1 text-[9px] font-bold">
                            xG
                          </div>
                          <div className="rounded bg-emerald-500/10 px-1 py-0.5 text-[9px] font-bold text-emerald-400">
                            {pred.expectedGoals.home.toFixed(1)} -{' '}
                            {pred.expectedGoals.away.toFixed(1)}
                          </div>
                        </div>
                        <div className="col-span-3 text-left">
                          <span
                            className="block truncate text-xs font-semibold text-white md:text-sm"
                            title={match.away_team}
                          >
                            {match.away_team}
                          </span>
                          <div className="mt-1 flex items-center gap-1">
                            <span className="text-betano-muted text-[9px]">
                              {(pred.ratingAway * 100).toFixed(0)}
                            </span>
                            <span className="inline-block rounded-full bg-cyan-500/10 px-1.5 py-0.5 text-[9px] font-bold text-cyan-400">
                              {pred.ratingAway > 0.7
                                ? 'ALT'
                                : pred.ratingAway > 0.4
                                  ? 'MED'
                                  : 'BAJ'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Probabilities Comparison Bar */}
                      <div className="space-y-1">
                        <div className="text-betano-muted flex justify-between text-[9px]">
                          <span>Modelo (Poisson)</span>
                          <span>Mercado</span>
                        </div>
                        <div className="flex h-3 w-full overflow-hidden rounded-full bg-slate-800">
                          <div
                            style={{ width: `${pred.modelProbs.home * 100}%` }}
                            className="h-full bg-emerald-500/80 text-center font-mono text-[8px] text-gray-200"
                            title={`Modelo Local: ${(pred.modelProbs.home * 100).toFixed(1)}%`}
                          >
                            {(pred.modelProbs.home * 100).toFixed(0)}%
                          </div>
                          <div
                            style={{ width: `${pred.modelProbs.draw * 100}%` }}
                            className="h-full bg-yellow-500/80 text-center font-mono text-[8px] text-gray-200"
                            title={`Modelo Empate: ${(pred.modelProbs.draw * 100).toFixed(1)}%`}
                          >
                            {(pred.modelProbs.draw * 100).toFixed(0)}%
                          </div>
                          <div
                            style={{ width: `${pred.modelProbs.away * 100}%` }}
                            className="h-full bg-cyan-500/80 text-center font-mono text-[8px] text-gray-200"
                            title={`Modelo Visita: ${(pred.modelProbs.away * 100).toFixed(1)}%`}
                          >
                            {(pred.modelProbs.away * 100).toFixed(0)}%
                          </div>
                        </div>
                        {/* <div className="flex h-3 w-full overflow-hidden rounded-full bg-slate-800"> */}
                        {/*   <div style={{ width: `${pred.marketProbs.home * 100}%` }} className="h-full bg-emerald-500/40 text-center font-mono text-[8px] text-gray-400" title={`Mkt Local: ${(pred.marketProbs.home * 100).toFixed(1)}%`}> */}
                        {/*   </div> */}
                        {/*   <div style={{ width: `${pred.marketProbs.draw * 100}%` }} className="h-full bg-yellow-500/40 text-center font-mono text-[8px] text-gray-400" title={`Mkt Empate: ${(pred.marketProbs.draw * 100).toFixed(1)}%`}> */}
                        {/*   </div> */}
                        {/*   <div style={{ width: `${pred.marketProbs.away * 100}%` }} className="h-full bg-cyan-500/40 text-center font-mono text-[8px] text-gray-400" title={`Mkt Visita: ${(pred.marketProbs.away * 100).toFixed(1)}%`}> */}
                        {/*   </div> */}
                        {/* </div> */}
                      </div>

                      {/* Odds */}
                      <div className="grid grid-cols-3 gap-1.5">
                        {[
                          {
                            label: '1',
                            odd: match.odds?.home ?? 1,
                            side: 'home' as const,
                          },
                          {
                            label: 'X',
                            odd: match.odds?.draw ?? 1,
                            side: 'draw' as const,
                          },
                          {
                            label: '2',
                            odd: match.odds?.away ?? 1,
                            side: 'away' as const,
                          },
                        ].map(({ label, odd, side }) => {
                          const diff =
                            side === 'home'
                              ? pred.modelProbs.home - pred.marketProbs.home
                              : side === 'draw'
                                ? pred.modelProbs.draw - pred.marketProbs.draw
                                : pred.modelProbs.away - pred.marketProbs.away;
                          const isValue = diff > 0.05;
                          const isNegative = diff < -0.05;
                          return (
                            <div
                              key={label}
                              className={`flex flex-col items-center justify-center rounded-lg border px-2 py-1.5 text-center transition-all ${
                                isValue
                                  ? 'border-emerald-500/40 bg-emerald-500/10 font-bold text-emerald-400'
                                  : isNegative
                                    ? 'border-red-500/30 bg-red-500/5 text-red-400'
                                    : 'border-betano-border/60 text-betano-muted bg-slate-900/30'
                              }`}
                            >
                              <span className="text-[9px] opacity-70">
                                {label}
                              </span>
                              <span className="text-xs font-semibold">
                                {odd.toFixed(2)}
                              </span>
                              <span
                                className={`text-[8px] font-bold ${isValue ? 'text-emerald-400' : isNegative ? 'text-red-400' : 'text-gray-500'}`}
                              >
                                {diff > 0 ? '+' : ''}
                                {(diff * 100).toFixed(0)}%
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Prediction */}
                      <div className="mt-2 space-y-2 rounded-lg border border-emerald-500/20 bg-emerald-950/20 p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Zap className="h-3.5 w-3.5 text-emerald-400" />
                            <span className="text-[11px] font-bold text-white">
                              Mimo Rating
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={
                                pred.confidence >= 60
                                  ? 'success'
                                  : pred.confidence >= 30
                                    ? 'warning'
                                    : 'danger'
                              }
                              size="xs"
                            >
                              {pred.confidence}%
                            </Badge>
                            {isHit ? (
                              <Badge
                                variant="success"
                                size="xs"
                                leftIcon={CheckCircle}
                              >
                                SI
                              </Badge>
                            ) : (
                              <Badge
                                variant="danger"
                                size="xs"
                                leftIcon={XCircle}
                              >
                                NO
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-betano-muted text-[10px]">
                            Sugerencia:
                          </span>
                          <span className="rounded border border-emerald-500/15 bg-emerald-500/5 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                            {pred.label}
                          </span>
                        </div>
                        {pred.kellyStake > 0 && (
                          <div className="flex items-center justify-between">
                            <span className="text-betano-muted text-[10px]">
                              Kelly Stake:
                            </span>
                            <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                              {(pred.kellyStake * 100).toFixed(1)}%
                            </span>
                          </div>
                        )}
                        <div className="text-betano-muted flex items-center justify-between border-t border-emerald-500/20 pt-1.5 text-[9px]">
                          <span>xG/Value/Kelly:</span>
                          <span className="rounded bg-slate-900 px-1 py-0.5 font-mono text-[8px] text-emerald-400">
                            {pred.expectedGoals.home.toFixed(1)}-
                            {pred.expectedGoals.away.toFixed(1)} |{' '}
                            {(pred.valueEdge * 100).toFixed(1)}% |{' '}
                            {(pred.kellyStake * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredMatches.length > displayedMatches.length && (
              <div className="flex justify-center pt-6 pb-4">
                <button
                  onClick={() => setVisibleCount((prev) => prev + 30)}
                  className="border-betano-border bg-betano-card hover:bg-betano-light/45 inline-flex cursor-pointer items-center gap-2 rounded-xl border px-6 py-3 text-sm font-bold text-white shadow-md shadow-black/20 transition-all hover:border-emerald-500/40 hover:text-emerald-400"
                >
                  Cargar más partidos <ArrowRight className="h-4 w-4" />
                  <span className="text-betano-muted ml-1 rounded-full bg-slate-900/55 px-2 py-0.5 text-xs font-normal">
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
