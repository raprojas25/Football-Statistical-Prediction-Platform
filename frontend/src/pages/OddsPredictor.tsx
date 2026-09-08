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
  Lightbulb,
  Award,
  ChevronDown,
  ChevronUp,
  Info,
  Calendar,
  BarChart3,
  ArrowRight,
  X,
  Sigma,
  Target,
  Activity,
  Globe,
  Loader,
} from 'lucide-react';
import { useOddsFixtures } from '@/hooks/useOddsFixtures';
import {
  calcImpliedProbs,
  difference,
  getPrediction,
  isPredictionHit,
} from '@/utils/prediction';
import { Badge } from '@/components/ui/Bagde';
import { LEAGUES } from '@/constants/leagues';

export const OddsPredictor = () => {
  const [selectedLeague, setSelectedLeague] = useState('peru');
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
  const [minHomeOdd, setMinHomeOdd] = useState<string>('');
  const [maxHomeOdd, setMaxHomeOdd] = useState<string>('');
  const [minDrawOdd, setMinDrawOdd] = useState<string>('');
  const [maxDrawOdd, setMaxDrawOdd] = useState<string>('');
  const [minAwayOdd, setMinAwayOdd] = useState<string>('');
  const [maxAwayOdd, setMaxAwayOdd] = useState<string>('');
  const [minConfidence, setMinConfidence] = useState<string>('');
  const [visibleCount, setVisibleCount] = useState<number>(30);

  const filteredMatches = useMemo(() => {
    return fixtures.filter((match) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (
          !match.home_team.toLowerCase().includes(q) &&
          !match.away_team.toLowerCase().includes(q)
        )
          return false;
      }
      if (selectedActualResult !== 'ALL' && match.score) {
        const actual =
          match.score.home > match.score.away
            ? 'HOME'
            : match.score.home < match.score.away
              ? 'AWAY'
              : 'DRAW';
        if (actual !== selectedActualResult) return false;
      }
      const homeOdd = match.odds?.home || 1;
      const drawOdd = match.odds?.draw || 1;
      const awayOdd = match.odds?.away || 1;
      const predInfo = getPrediction(
        homeOdd,
        drawOdd,
        awayOdd,
        match.home_ppg,
        match.away_ppg,
      );
      if (selectedPrediction !== 'ALL' && predInfo.type !== selectedPrediction)
        return false;
      if (predictionHitFilter !== 'ALL' && match.score) {
        const isHit = isPredictionHit(predInfo.type, match.score);
        if (predictionHitFilter === 'HIT' && !isHit) return false;
        if (predictionHitFilter === 'MISS' && isHit) return false;
      }
      if (minHomeOdd && homeOdd < parseFloat(minHomeOdd)) return false;
      if (maxHomeOdd && homeOdd > parseFloat(maxHomeOdd)) return false;
      if (minDrawOdd && drawOdd < parseFloat(minDrawOdd)) return false;
      if (maxDrawOdd && drawOdd > parseFloat(maxDrawOdd)) return false;
      if (minAwayOdd && awayOdd < parseFloat(minAwayOdd)) return false;
      if (maxAwayOdd && awayOdd > parseFloat(maxAwayOdd)) return false;
      if (minConfidence && predInfo.confidence < parseInt(minConfidence))
        return false;
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
    minConfidence,
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
    setMinHomeOdd('');
    setMaxHomeOdd('');
    setMinDrawOdd('');
    setMaxDrawOdd('');
    setMinAwayOdd('');
    setMaxAwayOdd('');
    setMinConfidence('');
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
        homeWins: 0,
        draws: 0,
        awayWins: 0,
        homeWinPct: 0,
        drawPct: 0,
        awayWinPct: 0,
        avgConfidence: 0,
        avgMargin: 0,
      };
    let hits = 0,
      misses = 0,
      homeWins = 0,
      draws = 0,
      awayWins = 0;
    let sumConf = 0,
      sumMarg = 0;
    filteredMatches.forEach((m) => {
      const h = m.score?.home ?? 0,
        a = m.score?.away ?? 0;
      const actual = h > a ? 'HOME' : h < a ? 'AWAY' : 'DRAW';
      if (actual === 'HOME') homeWins++;
      else if (actual === 'DRAW') draws++;
      else awayWins++;
      const ho = m.odds?.home || 1,
        dr = m.odds?.draw || 1,
        aw = m.odds?.away || 1;
      const pred = getPrediction(ho, dr, aw, m.home_ppg, m.away_ppg);
      sumConf += pred.confidence;
      const margin = calcImpliedProbs(ho, dr, aw).margin;
      sumMarg += margin;
      if (isPredictionHit(pred.type, m.score)) hits++;
      else misses++;
    });
    return {
      total,
      hits,
      misses,
      accuracy: total > 0 ? (hits / total) * 100 : 0,
      homeWins,
      draws,
      awayWins,
      homeWinPct: total > 0 ? (homeWins / total) * 100 : 0,
      drawPct: total > 0 ? (draws / total) * 100 : 0,
      awayWinPct: total > 0 ? (awayWins / total) * 100 : 0,
      avgConfidence: total > 0 ? sumConf / total : 0,
      avgMargin: total > 0 ? (sumMarg / total) * 100 : 0,
    };
  }, [filteredMatches]);

  const displayedMatches = useMemo(
    () => filteredMatches.slice(0, visibleCount),
    [filteredMatches, visibleCount],
  );

  if (isLoading) {
    return (
      <div className="flex min-h-112.5 flex-col items-center justify-center space-y-4">
        <Loader className="h-10 w-10 animate-spin text-white" />
        <p className="text-betano-muted animate-pulse text-sm font-semibold">
          Analizando cuotas...
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
      <div className="border-betano-border/80 to-betano-surface relative overflow-hidden rounded-2xl border bg-linear-to-r from-indigo-900/80 p-6 shadow-xl">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <BarChart3 className="h-48 w-48 text-white" />
        </div>
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/15 px-3 py-1 text-[11px] font-bold tracking-wider text-indigo-400 uppercase">
            <Sigma className="h-3 w-3" /> Modelo de Consenso de Mercado
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className="flex items-center gap-3 text-2xl font-black tracking-tight text-white md:text-3xl">
              <Target className="h-7 w-7 text-indigo-400" />
              Predictor de Cuotas
            </h1>
            <Link
              to={`/equipos?liga=${selectedLeague}`}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-rose-500/30 bg-rose-600/20 px-3 py-1.5 text-[11px] font-bold text-rose-300 transition-all hover:bg-rose-600/30"
            >
              <Activity className="h-3.5 w-3.5" /> Fiabilidad por Equipo
            </Link>
          </div>
          <p className="text-betano-muted max-w-2xl text-sm">
            {leagueLabel && <>{leagueLabel} • </>}Temp.{' '}
            {odds?.season || 'Actual'}. Algoritmo híbrido que combina
            probabilidades implícitas del mercado (60%) con rendimiento
            histórico PPG (40%) para predecir el ganador del partido.
          </p>
        </div>
      </div>

      {/* League Tabs */}
      <div className="border-betano-border/70 bg-betano-card rounded-2xl border p-3 shadow-lg">
        <div className="mb-2 flex items-center gap-2 px-1">
          <Globe className="h-4 w-4 text-indigo-400" />
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
                  ? 'border-indigo-500 bg-indigo-600 text-white shadow-md shadow-indigo-600/15'
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
            <Filter className="h-5 w-5 text-indigo-400" />
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
                placeholder="Ej. Real Madrid, Barcelona..."
                value={searchQuery}
                onChange={(e) =>
                  handleFilterChange(setSearchQuery, e.target.value)
                }
                className="border-betano-border bg-betano-surface w-full rounded-lg border py-2.5 pr-4 pl-12 text-sm text-white placeholder-gray-500 transition-all outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40"
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
                  className={`cursor-pointer rounded-lg border py-2 text-xs font-bold transition-all ${selectedActualResult === btn.id ? 'border-indigo-600 bg-indigo-600 text-white shadow-md shadow-indigo-600/20' : 'border-betano-border bg-betano-surface text-betano-muted hover:bg-betano-light/40 hover:text-white'}`}
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
              Predicción del Modelo
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
                  className={`cursor-pointer rounded-lg border py-2 text-xs font-bold transition-all ${selectedPrediction === btn.id ? 'border-indigo-600 bg-indigo-600 text-white shadow-md' : 'border-betano-border bg-betano-surface text-betano-muted hover:bg-betano-light/40 hover:text-white'}`}
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
            <SlidersHorizontal className="h-3.5 w-3.5 text-indigo-400" />
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
              <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                <div className="space-y-1.5">
                  <span className="block text-[11px] font-bold text-white uppercase">
                    Cuota Local
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
                      className="border-betano-border bg-betano-card w-full rounded border p-2 text-xs text-white outline-none focus:border-indigo-500"
                    />
                    <span className="text-betano-muted text-xs">-</span>
                    <input
                      type="number"
                      step="0.05"
                      placeholder="Máx"
                      value={maxHomeOdd}
                      onChange={(e) =>
                        handleFilterChange(setMaxHomeOdd, e.target.value)
                      }
                      className="border-betano-border bg-betano-card w-full rounded border p-2 text-xs text-white outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <span className="block text-[11px] font-bold text-white uppercase">
                    Cuota Empate
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
                      className="border-betano-border bg-betano-card w-full rounded border p-2 text-xs text-white outline-none focus:border-indigo-500"
                    />
                    <span className="text-betano-muted text-xs">-</span>
                    <input
                      type="number"
                      step="0.05"
                      placeholder="Máx"
                      value={maxDrawOdd}
                      onChange={(e) =>
                        handleFilterChange(setMaxDrawOdd, e.target.value)
                      }
                      className="border-betano-border bg-betano-card w-full rounded border p-2 text-xs text-white outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <span className="block text-[11px] font-bold text-white uppercase">
                    Cuota Visita
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
                      className="border-betano-border bg-betano-card w-full rounded border p-2 text-xs text-white outline-none focus:border-indigo-500"
                    />
                    <span className="text-betano-muted text-xs">-</span>
                    <input
                      type="number"
                      step="0.05"
                      placeholder="Máx"
                      value={maxAwayOdd}
                      onChange={(e) =>
                        handleFilterChange(setMaxAwayOdd, e.target.value)
                      }
                      className="border-betano-border bg-betano-card w-full rounded border p-2 text-xs text-white outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <span className="block text-[11px] font-bold text-white uppercase">
                    Confianza Mín.
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
                    className="border-betano-border bg-betano-card w-full rounded border p-2 text-xs text-white outline-none focus:border-indigo-500"
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
          <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/10 p-3 text-indigo-400">
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
            <div className="rounded-xl border border-purple-500/20 bg-purple-500/10 p-3 text-purple-400">
              <Activity className="h-5 w-5" />
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
                style={{ width: `${stats.avgConfidence}%` }}
                className="h-full rounded-full bg-purple-500 transition-all duration-500"
              />
            </div>
            <div className="text-betano-muted mt-1 flex justify-between text-[10px]">
              <span>Edge promedio</span>
              <span>{(stats.avgConfidence / 100).toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="border-betano-border/80 bg-betano-card flex flex-col justify-between rounded-2xl border p-4 shadow-md">
          <div className="flex items-center space-x-4">
            <div className="rounded-xl border border-orange-500/20 bg-orange-500/10 p-3 text-orange-400">
              <Sigma className="h-5 w-5" />
            </div>
            <div>
              <span className="text-betano-muted block text-xs font-medium">
                Margen Medio Casa
              </span>
              <span className="text-xl font-extrabold text-white">
                {stats.avgMargin.toFixed(2)}%
              </span>
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-betano-muted mt-1 flex justify-between text-[10px]">
              <span>{stats.homeWins}L</span>
              <span>{stats.draws}X</span>
              <span>{stats.awayWins}V</span>
            </div>
            <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                style={{ width: `${stats.homeWinPct}%` }}
                className="h-full bg-green-500"
              />
              <div
                style={{ width: `${stats.drawPct}%` }}
                className="h-full bg-yellow-500"
              />
              <div
                style={{ width: `${stats.awayWinPct}%` }}
                className="h-full bg-blue-500"
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
            <Info className="mx-auto h-8 w-8 text-indigo-400 opacity-60" />
            <p className="text-base font-bold text-white">
              No se encontraron partidos
            </p>
            <p className="mx-auto max-w-sm text-xs">
              No hay enfrentamientos que cumplan los filtros seleccionados.
            </p>
            <button
              onClick={resetAllFilters}
              className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-indigo-600/20 transition-opacity hover:opacity-95"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Ver Todos
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {displayedMatches.map((match) => {
                const goalDiff: number = difference(
                  match.home_ppg,
                  match.away_ppg,
                );
                const homeOdd = match.odds?.home || 1;
                const drawOdd = match.odds?.draw || 1;
                const awayOdd = match.odds?.away || 1;
                const homeScore = match.score?.home ?? 0;
                const awayScore = match.score?.away ?? 0;
                const predInfo = getPrediction(
                  homeOdd,
                  drawOdd,
                  awayOdd,
                  match.home_ppg,
                  match.away_ppg,
                );
                const isHit = isPredictionHit(predInfo.type, match.score);
                const actualWinner =
                  homeScore > awayScore
                    ? 'HOME'
                    : homeScore < awayScore
                      ? 'AWAY'
                      : 'DRAW';
                const imp = calcImpliedProbs(homeOdd, drawOdd, awayOdd);

                return (
                  <div
                    key={match.id}
                    className={`bg-betano-card flex flex-col justify-between overflow-hidden rounded-xl border shadow-md transition-all duration-300 hover:scale-[1.01] hover:shadow-lg ${isHit ? 'border-green-500/20 hover:border-green-500/40' : 'border-betano-border hover:border-betano-light'}`}
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
                      <div>
                        {actualWinner === 'HOME' && (
                          <Badge
                            variant="success"
                            size="xs"
                            className="border border-green-500/20"
                          >
                            Local
                          </Badge>
                        )}
                        {actualWinner === 'DRAW' && (
                          <Badge
                            variant="warning"
                            size="xs"
                            className="border border-yellow-500/20"
                          >
                            Empate
                          </Badge>
                        )}
                        {actualWinner === 'AWAY' && (
                          <Badge
                            variant="blue"
                            size="xs"
                            className="border border-blue-500/20"
                          >
                            Visita
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex grow flex-col justify-between space-y-4 p-4">
                      {/* Teams */}
                      <div className="grid grid-cols-7 items-center gap-2">
                        <div className="col-span-3 text-right">
                          <span
                            className="block truncate text-xs font-semibold text-white md:text-sm"
                            title={match.home_team}
                          >
                            {match.home_team}
                          </span>
                          <span className="text-betano-muted mt-1 inline-block rounded-full bg-white/5 px-1.5 py-0.5 text-[9px] font-medium">
                            PPG: {match.home_ppg.toFixed(2)}
                          </span>
                        </div>
                        <div className="col-span-1 flex flex-col items-center justify-center">
                          <div className="border-betano-border truncate rounded-md border bg-slate-900 px-2 py-1 text-xs font-black tracking-wider text-white shadow-inner">
                            {homeScore} - {awayScore}
                          </div>
                          <Badge
                            variant={`${goalDiff > 0.64 ? 'success' : goalDiff > 0.46 ? 'warning' : 'danger'}`}
                            size="xs"
                          >
                            {goalDiff.toFixed(2)}
                          </Badge>
                        </div>
                        <div className="col-span-3 text-left">
                          <span
                            className="block truncate text-xs font-semibold text-white md:text-sm"
                            title={match.away_team}
                          >
                            {match.away_team}
                          </span>
                          <span className="text-betano-muted mt-1 inline-block rounded-full bg-white/5 px-1.5 py-0.5 text-[9px] font-medium">
                            PPG: {match.away_ppg.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      {/* Implied probabilities bar */}
                      <div className="space-y-0.5">
                        <div className="text-betano-muted flex justify-between text-[9px]">
                          <span>Prob. Implícitas (1)</span>
                          <span>(X)</span>
                          <span>(2)</span>
                        </div>
                        <div className="flex h-3 w-full overflow-hidden rounded-full bg-slate-800">
                          <div
                            style={{ width: `${imp.home * 100}%` }}
                            className="h-full bg-green-500/80 text-center font-mono text-[9px] text-gray-200"
                            title={`Local: ${(imp.home * 100).toFixed(1)}%`}
                          >
                            {(imp.home * 100).toFixed(1)}%
                          </div>

                          <div
                            style={{ width: `${imp.draw * 100}%` }}
                            className="h-full bg-yellow-500/80 text-center font-mono text-[9px] text-gray-200"
                            title={`Empate: ${(imp.draw * 100).toFixed(1)}%`}
                          >
                            {(imp.draw * 100).toFixed(1)}%
                          </div>

                          <div
                            style={{ width: `${imp.away * 100}%` }}
                            className="h-full bg-blue-500/80 text-center font-mono text-[9px] text-gray-200"
                            title={`Visita: ${(imp.away * 100).toFixed(1)}%`}
                          >
                            {(imp.away * 100).toFixed(1)}%
                          </div>
                        </div>
                      </div>

                      {/* Odds */}
                      <div className="grid grid-cols-3 gap-1.5">
                        <div
                          className={`flex flex-col items-center justify-center rounded-lg border px-2 py-1.5 text-center transition-all ${actualWinner === 'HOME' ? 'border-green-500/40 bg-green-500/10 font-bold text-green-400' : 'border-betano-border/60 text-betano-muted bg-slate-900/30'}`}
                        >
                          <span className="text-[9px] opacity-70">1</span>
                          <span className="text-xs font-semibold">
                            {homeOdd.toFixed(2)}
                          </span>
                        </div>
                        <div
                          className={`flex flex-col items-center justify-center rounded-lg border px-2 py-1.5 text-center transition-all ${actualWinner === 'DRAW' ? 'border-yellow-500/40 bg-yellow-500/10 font-bold text-yellow-400' : 'border-betano-border/60 text-betano-muted bg-slate-900/30'}`}
                        >
                          <span className="text-[9px] opacity-70">X</span>
                          <span className="text-xs font-semibold">
                            {drawOdd.toFixed(2)}
                          </span>
                        </div>
                        <div
                          className={`flex flex-col items-center justify-center rounded-lg border px-2 py-1.5 text-center transition-all ${actualWinner === 'AWAY' ? 'border-blue-500/40 bg-blue-500/10 font-bold text-blue-400' : 'border-betano-border/60 text-betano-muted bg-slate-900/30'}`}
                        >
                          <span className="text-[9px] opacity-70">2</span>
                          <span className="text-xs font-semibold">
                            {awayOdd.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      {/* Prediction */}
                      <div className="border-betano-border/40 mt-4 space-y-2 rounded-lg border bg-slate-950/40 p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Lightbulb className="h-3.5 w-3.5 text-yellow-500" />
                            <span className="text-[11px] font-bold text-white">
                              Pronóstico Modelo
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={`${predInfo.confidence >= 60 ? 'purple' : predInfo.confidence >= 30 ? 'warning' : 'danger'}`}
                              size="xs"
                            >
                              {predInfo.confidence}%
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
                          <span className="rounded border border-yellow-500/15 bg-yellow-500/5 px-2 py-0.5 text-[10px] font-bold text-yellow-500">
                            {predInfo.label}
                          </span>
                        </div>
                        <div className="border-betano-border/30 text-betano-muted flex items-center justify-between border-t pt-1.5 text-[9px]">
                          <span>Imp/Mdo/Frm:</span>
                          <span className="text-betano-muted rounded bg-slate-900 px-1 py-0.5 font-mono text-[8px]">
                            {predInfo.details}
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
                  className="border-betano-border bg-betano-card hover:bg-betano-light/45 inline-flex cursor-pointer items-center gap-2 rounded-xl border px-6 py-3 text-sm font-bold text-white shadow-md shadow-black/20 transition-all hover:border-indigo-500/40 hover:text-indigo-400"
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
