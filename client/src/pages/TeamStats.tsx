import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router';
import {
  Search,
  ArrowUpDown,
  Info,
  BarChart3,
  ShieldAlert,
  ShieldCheck,
  Zap,
  Trophy,
  Skull,
  Loader,
} from 'lucide-react';
import { useOddsFixtures } from '@/hooks/useOddsFixtures';
import { getPrediction, isPredictionHit } from '@/utils/prediction';

interface TeamStat {
  team: string;
  total: number;
  hits: number;
  misses: number;
  accuracy: number;
  asHomeTotal: number;
  asHomeHits: number;
  asHomeAcc: number;
  asAwayTotal: number;
  asAwayHits: number;
  asAwayAcc: number;
  avgOdd: number;
  roi: number;
}

type SortKey =
  | 'accuracy'
  | 'total'
  | 'hits'
  | 'team'
  | 'asHomeAcc'
  | 'asAwayAcc'
  | 'roi';
type SortDir = 'asc' | 'desc';

export const TeamStats = () => {
  const [searchParams] = useSearchParams();
  const liga = searchParams.get('liga') || 'argentina';
  const { isLoading, fixtures } = useOddsFixtures(`odds/${liga}_odds.json`);

  const [searchQuery, setSearchQuery] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('accuracy');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [minMatches, setMinMatches] = useState<number>(2);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else {
      setSortKey(key);
      setSortDir(key === 'accuracy' ? 'asc' : 'desc');
    }
  };

  const teamStats: TeamStat[] = useMemo(() => {
    const map = new Map<
      string,
      {
        total: number;
        hits: number;
        hTotal: number;
        hHits: number;
        aTotal: number;
        aHits: number;
        sumOdd: number;
      }
    >();

    fixtures.forEach((m) => {
      const ho = m.odds?.home || 1;
      const dr = m.odds?.draw || 1;
      const aw = m.odds?.away || 1;
      const pred = getPrediction(ho, dr, aw, m.home_ppg, m.away_ppg);
      const hit = isPredictionHit(pred.type, m.score);

      // Home team
      let h = map.get(m.home_team);
      if (!h)
        map.set(
          m.home_team,
          (h = {
            total: 0,
            hits: 0,
            hTotal: 0,
            hHits: 0,
            aTotal: 0,
            aHits: 0,
            sumOdd: 0,
          }),
        );
      h.total++;
      if (hit) h.hits++;
      h.hTotal++;
      if (hit) h.hHits++;
      h.sumOdd += ho;

      // Away team
      let a = map.get(m.away_team);
      if (!a)
        map.set(
          m.away_team,
          (a = {
            total: 0,
            hits: 0,
            hTotal: 0,
            hHits: 0,
            aTotal: 0,
            aHits: 0,
            sumOdd: 0,
          }),
        );
      a.total++;
      if (hit) a.hits++;
      a.aTotal++;
      if (hit) a.aHits++;
      a.sumOdd += aw;
    });

    return Array.from(map.entries())
      .filter(([, s]) => s.total >= minMatches)
      .map(([team, s]) => ({
        team,
        total: s.total,
        hits: s.hits,
        misses: s.total - s.hits,
        accuracy: s.total > 0 ? (s.hits / s.total) * 100 : 0,
        asHomeTotal: s.hTotal,
        asHomeHits: s.hHits,
        asHomeAcc: s.hTotal > 0 ? (s.hHits / s.hTotal) * 100 : 0,
        asAwayTotal: s.aTotal,
        asAwayHits: s.aHits,
        asAwayAcc: s.aTotal > 0 ? (s.aHits / s.aTotal) * 100 : 0,
        avgOdd: s.total > 0 ? s.sumOdd / s.total : 0,
        roi: s.total > 0 ? (s.hits / s.total) * 100 - 100 : -100,
      }));
  }, [fixtures, minMatches]);

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return teamStats
      .filter((t) => !q || t.team.toLowerCase().includes(q))
      .sort((a, b) => {
        const mul = sortDir === 'asc' ? 1 : -1;
        if (sortKey === 'team') return mul * a.team.localeCompare(b.team);
        return mul * ((a[sortKey] as number) - (b[sortKey] as number));
      });
  }, [teamStats, searchQuery, sortKey, sortDir]);

  if (isLoading) {
    return (
      <div className="flex min-h-[450px] flex-col items-center justify-center space-y-4">
        <Loader className="h-10 w-10 animate-spin text-white" />
        <p className="animate-pulse text-sm font-semibold text-betano-muted">
          Calculando estadísticas por equipo...
        </p>
      </div>
    );
  }

  const SortHeader = ({
    k,
    label,
    className = '',
  }: {
    k: SortKey;
    label: string;
    className?: string;
  }) => (
    <button
      onClick={() => toggleSort(k)}
      className={`inline-flex cursor-pointer items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-betano-muted transition-colors hover:text-white ${className}`}
    >
      {label}
      <ArrowUpDown
        className={`h-3 w-3 ${sortKey === k ? 'text-indigo-400' : ''}`}
      />
    </button>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl border border-betano-border/80 bg-gradient-to-r from-rose-900/70 to-betano-surface p-6 shadow-xl">
        <div className="absolute right-0 top-0 p-8 opacity-5">
          <Skull className="h-48 w-48 text-white" />
        </div>
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-rose-400">
            <ShieldAlert className="h-3 w-3" /> Estadísticas por Equipo
          </div>
          <h1 className="flex items-center gap-3 text-2xl font-black tracking-tight text-white md:text-3xl">
            <Trophy className="h-7 w-7 text-rose-400" />
            Fiabilidad por Equipo
          </h1>
          <p className="max-w-2xl text-sm text-betano-muted">
            Analiza qué equipos son más predecibles para el algoritmo. Ordenado
            por defecto de <span className="font-bold text-red-400">menor</span>{' '}
            a <span className="font-bold text-green-400">mayor</span> acierto
            para identificar qué equipos{' '}
            <span className="font-bold text-rose-400">evitar</span> al apostar.
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="space-y-4 rounded-2xl border border-betano-border bg-betano-card p-5 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="relative min-w-[200px] flex-1">
            <input
              type="text"
              placeholder="Buscar equipo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-betano-border bg-betano-surface py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 outline-none transition-all focus:border-rose-500 focus:ring-1 focus:ring-rose-500/40"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
          </div>
          <div className="flex items-center gap-3">
            <label className="whitespace-nowrap text-xs text-betano-muted">
              Min. partidos:
            </label>
            <select
              value={minMatches}
              onChange={(e) => setMinMatches(Number(e.target.value))}
              className="cursor-pointer rounded-lg border border-betano-border bg-betano-surface px-3 py-2.5 text-xs text-white outline-none focus:border-rose-500"
            >
              {[1, 2, 3, 5, 8, 10].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 text-[10px] text-betano-muted">
          <span className="font-bold text-white">Ordenar:</span>
          <SortHeader k="accuracy" label="Precisión" />
          <SortHeader k="total" label="Partidos" />
          <SortHeader k="hits" label="Aciertos" />
          <SortHeader k="asHomeAcc" label="Como Local" />
          <SortHeader k="asAwayAcc" label="Como Visita" />
          <SortHeader k="team" label="Equipo" />
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="flex items-center space-x-4 rounded-2xl border border-betano-border/80 bg-betano-card p-4 shadow-md">
          <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-rose-400">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div>
            <span className="block text-xs font-medium text-betano-muted">
              Equipos Analizados
            </span>
            <span className="text-xl font-extrabold text-white">
              {teamStats.length}
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-4 rounded-2xl border border-betano-border/80 bg-betano-card p-4 shadow-md">
          <div className="rounded-xl border border-green-500/20 bg-green-500/10 p-3 text-green-400">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <span className="block text-xs font-medium text-betano-muted">
              Mejor Precisión
            </span>
            <span className="text-xl font-extrabold text-white">
              {teamStats.length > 0
                ? `${Math.max(...teamStats.map((t) => t.accuracy)).toFixed(0)}%`
                : '—'}
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-4 rounded-2xl border border-betano-border/80 bg-betano-card p-4 shadow-md">
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-red-400">
            <Skull className="h-5 w-5" />
          </div>
          <div>
            <span className="block text-xs font-medium text-betano-muted">
              Peor Precisión
            </span>
            <span className="text-xl font-extrabold text-white">
              {teamStats.length > 0
                ? `${Math.min(...teamStats.map((t) => t.accuracy)).toFixed(0)}%`
                : '—'}
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-4 rounded-2xl border border-betano-border/80 bg-betano-card p-4 shadow-md">
          <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-3 text-blue-400">
            <BarChart3 className="h-5 w-5" />
          </div>
          <div>
            <span className="block text-xs font-medium text-betano-muted">
              Media Global
            </span>
            <span className="text-xl font-extrabold text-white">
              {teamStats.length > 0
                ? `${(teamStats.reduce((s, t) => s + t.accuracy, 0) / teamStats.length).toFixed(1)}%`
                : '—'}
            </span>
          </div>
        </div>
      </div>

      {/* Team Table */}
      <div className="overflow-hidden rounded-2xl border border-betano-border bg-betano-card shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-betano-border bg-slate-900/60">
                <th className="px-4 py-3 text-left">
                  <SortHeader k="team" label="Equipo" />
                </th>
                <th className="px-3 py-3 text-center">
                  <SortHeader k="total" label="PJ" />
                </th>
                <th className="px-3 py-3 text-center">
                  <SortHeader k="accuracy" label="Precisión" />
                </th>
                <th className="px-3 py-3 text-center">
                  <SortHeader k="hits" label="Aciertos" />
                </th>
                <th className="hidden px-3 py-3 text-center sm:table-cell">
                  Fallos
                </th>
                <th className="hidden px-3 py-3 text-center md:table-cell">
                  <SortHeader k="asHomeAcc" label="Local" />
                </th>
                <th className="hidden px-3 py-3 text-center md:table-cell">
                  <SortHeader k="asAwayAcc" label="Visita" />
                </th>
                <th className="hidden px-3 py-3 text-center lg:table-cell">
                  Cuota Prom.
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="py-12 text-center text-betano-muted"
                  >
                    <Info className="mx-auto mb-2 h-6 w-6 opacity-60" />
                    <p>No se encontraron equipos con ese filtro.</p>
                  </td>
                </tr>
              ) : (
                filtered.map((t, i) => {
                  const accColor =
                    t.accuracy >= 60
                      ? 'text-green-400'
                      : t.accuracy >= 45
                        ? 'text-yellow-400'
                        : 'text-red-400';
                  const barColor =
                    t.accuracy >= 60
                      ? 'bg-green-500'
                      : t.accuracy >= 45
                        ? 'bg-yellow-500'
                        : 'bg-red-500';
                  return (
                    <tr
                      key={t.team}
                      className={`border-b border-betano-border/40 transition-colors hover:bg-white/5 ${i < 3 && sortKey === 'accuracy' && sortDir === 'asc' ? 'bg-red-900/10' : ''}`}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {i === 0 &&
                            sortKey === 'accuracy' &&
                            sortDir === 'asc' && (
                              <Skull
                                className="h-4 w-4 shrink-0 text-red-400"
                                aria-label='Peor equipo para apostar'
                              />
                            )}
                          <span className="max-w-[140px] truncate text-sm text-white sm:max-w-none">
                            {t.team}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-center font-mono text-xs text-betano-muted">
                        {t.total}
                      </td>
                      <td className="px-3 py-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <span className={`text-sm ${accColor}`}>
                            {t.accuracy.toFixed(1)}%
                          </span>
                          <div className="hidden h-1.5 w-16 overflow-hidden rounded-full bg-slate-800 sm:block">
                            <div
                              style={{ width: `${t.accuracy}%` }}
                              className={`h-full rounded-full ${barColor} transition-all`}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-center text-xs font-bold text-green-400">
                        {t.hits}
                      </td>
                      <td className="hidden px-3 py-3 text-center text-xs font-bold text-red-400 sm:table-cell">
                        {t.misses}
                      </td>
                      <td className="hidden px-3 py-3 text-center md:table-cell">
                        <span
                          className={
                            t.asHomeAcc >= 60
                              ? 'text-green-400'
                              : t.asHomeAcc >= 45
                                ? 'text-yellow-400'
                                : 'text-red-400'
                          }
                        >
                          {t.asHomeAcc.toFixed(0)}%
                        </span>
                        <span className="ml-1 text-[10px] text-betano-muted">
                          ({t.asHomeTotal})
                        </span>
                      </td>
                      <td className="hidden px-3 py-3 text-center md:table-cell">
                        <span
                          className={
                            t.asAwayAcc >= 60
                              ? 'text-green-400'
                              : t.asAwayAcc >= 45
                                ? 'text-yellow-400'
                                : 'text-red-400'
                          }
                        >
                          {t.asAwayAcc.toFixed(0)}%
                        </span>
                        <span className="ml-1 text-[10px] text-betano-muted">
                          ({t.asAwayTotal})
                        </span>
                      </td>
                      <td className="hidden px-3 py-3 text-center font-mono text-xs text-betano-muted lg:table-cell">
                        {t.avgOdd.toFixed(2)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <div className="border-t border-betano-border/40 px-4 py-3 text-center text-[10px] text-betano-muted">
          Mostrando {filtered.length} de {teamStats.length} equipos • Ordenado
          por {sortKey === 'accuracy' ? 'precisión' : sortKey} (
          {sortDir === 'asc' ? 'ascendente' : 'descendente'})
        </div>
      </div>

      {/* Worst / Best cards */}
      {filtered.length >= 3 && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-red-500/20 bg-gradient-to-br from-red-900/30 to-betano-card p-5 shadow-lg">
            <div className="mb-3 flex items-center gap-2">
              <Skull className="h-5 w-5 text-red-400" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                Peores 3 equipos para apostar
              </h3>
            </div>
            <div className="space-y-2">
              {[...filtered]
                .sort((a, b) => a.accuracy - b.accuracy)
                .slice(0, 3)
                .map((t, i) => (
                  <div
                    key={t.team}
                    className="flex items-center justify-between rounded-lg bg-black/20 px-3 py-2"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-red-400">
                        {i + 1}.
                      </span>
                      <span className="text-sm font-semibold text-white">
                        {t.team}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-red-400">
                      {t.accuracy.toFixed(1)}%
                    </span>
                  </div>
                ))}
            </div>
          </div>
          <div className="rounded-2xl border border-green-500/20 bg-gradient-to-br from-green-900/30 to-betano-card p-5 shadow-lg">
            <div className="mb-3 flex items-center gap-2">
              <Zap className="h-5 w-5 text-green-400" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                Mejores 3 equipos para apostar
              </h3>
            </div>
            <div className="space-y-2">
              {[...filtered]
                .sort((a, b) => b.accuracy - a.accuracy)
                .slice(0, 3)
                .map((t, i) => (
                  <div
                    key={t.team}
                    className="flex items-center justify-between rounded-lg bg-black/20 px-3 py-2"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-green-400">
                        {i + 1}.
                      </span>
                      <span className="text-sm font-semibold text-white">
                        {t.team}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-green-400">
                      {t.accuracy.toFixed(1)}%
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
