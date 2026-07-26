import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Loader2, AlertCircle } from 'lucide-react';
import { mapTeamName, findTeam } from '../utils/teamAdapters';
import MatchList from '@/components/matches/MatchList';
import { PredictionData, TeamStatsData, Match } from '@/types';
import { COMPETITIONS } from '@/constants/competitions';
import { useCompetitionData } from '../hooks/useCompetitionData';
import Select from '@/components/ui/Select';

const competitionIds = Object.keys(COMPETITIONS);

function calculatePrediction(
  match: Match,
  competition: string,
  teams: TeamStatsData[],
): PredictionData | null {
  const homeName = mapTeamName(match.homeTeam, competition);
  const awayName = mapTeamName(match.awayTeam, competition);

  const homeStats = findTeam(homeName, teams);
  const awayStats = findTeam(awayName, teams);

  if (!homeStats || !awayStats) {
    console.log(
      `No se encontraron estadísticas para: ${homeName} vs ${awayName}`,
    );
    return null;
  }

  const calc = (a: number, b: number) => (a + b) / 2;

  const hHome = homeStats.home.goals;
  const aAway = awayStats.away.goals;

  const hScoring = homeStats.home.scoring;
  const aScoring = awayStats.away.scoring;

  const hCorners = homeStats.home.corners || {};
  const aCorners = awayStats.away.corners || {};

  const gC = (key: string) => (key in hCorners ? hCorners[key] : 0);
  const gCA = (key: string) => (key in aCorners ? aCorners[key] : 0);

  const cornersH = calc(gC('for_avg'), gCA('against_avg'));
  const cornersA = calc(gC('against_avg'), gCA('for_avg'));

  return {
    home: homeStats,
    away: awayStats,
    pgfl: calc(hHome.scored_pg, aAway.conceded_pg),
    pgfv: calc(hHome.conceded_pg, aAway.scored_pg),

    over_1_5: calc(hHome.over_1_5, aAway.over_1_5),
    over_2_5: calc(hHome.over_2_5, aAway.over_2_5),
    over_3_5: calc(hHome.over_3_5, aAway.over_3_5),

    btts: calc(hHome.both_scored, aAway.both_scored),
    total_goals: calc(hHome.total_pg, aAway.total_pg),

    win: calc(hHome.wins, aAway.defeats),
    draw: calc(hHome.draws, aAway.draws),
    loss: calc(hHome.defeats, aAway.wins),

    gf_05: calc(hScoring.gf_over_05, aScoring.ga_over_05),
    gf_15: calc(hScoring.gf_over_15, aScoring.ga_over_15),
    gf_25: calc(hScoring.gf_over_25, aScoring.ga_over_25),
    ga_05: calc(hScoring.ga_over_05, aScoring.gf_over_05),
    ga_15: calc(hScoring.ga_over_15, aScoring.gf_over_15),
    ga_25: calc(hScoring.ga_over_25, aScoring.gf_over_25),

    first_home: calc(hHome.scored_first, aAway.opponent_first),
    first_away: calc(aAway.scored_first, hHome.opponent_first),

    scoring_home: calc(hScoring.rate, aScoring.conceding_rate),
    scoring_away: calc(aScoring.rate, hScoring.conceding_rate),
    ht_home: calc(hScoring.rate_1st_h, aScoring.conceding_1st_h),
    ht_away: calc(aScoring.rate_1st_h, hScoring.conceding_1st_h),
    st_home: calc(hScoring.rate_2nd_h, aScoring.conceding_2nd_h),
    st_away: calc(aScoring.rate_2nd_h, hScoring.conceding_2nd_h),
    bt_home: calc(hScoring.scored_both_halves, aScoring.conceded_both_halves),
    bt_away: calc(aScoring.scored_both_halves, hScoring.conceded_both_halves),

    corners_home: cornersH,
    corners_away: cornersA,

    cf_over_35: calc(gC('for_over_3_5'), gCA('against_over_3_5')),
    cf_over_45: calc(gC('for_over_4_5'), gCA('against_over_4_5')),
    cf_over_55: calc(gC('for_over_5_5'), gCA('against_over_5_5')),
    cf_over_65: calc(gC('for_over_6_5'), gCA('against_over_6_5')),

    ca_over_35: calc(gC('against_over_3_5'), gCA('for_over_3_5')),
    ca_over_45: calc(gC('against_over_4_5'), gCA('for_over_4_5')),
    ca_over_55: calc(gC('against_over_5_5'), gCA('for_over_5_5')),
    ca_over_65: calc(gC('against_over_6_5'), gCA('for_over_6_5')),

    tc_over_95: calc(gC('total_over_9_5'), gCA('total_over_9_5')),
    tc_over_105: calc(gC('total_over_10_5'), gCA('total_over_10_5')),
    tc_over_115: calc(gC('total_over_11_5'), gCA('total_over_11_5')),
    tc_over_125: calc(gC('total_over_12_5'), gCA('total_over_12_5')),

    total_corners_match: calc(gC('total_avg'), gCA('total_avg')),

    homePpg: match.homePpg,
    awayPpg: match.awayPpg,
    odds: {
      home: match.odds?.home || 1,
      draw: match.odds?.draw || 1,
      away: match.odds?.away || 1,
    },
  };
}

export default function Matches() {
  const [selectedCompetition, setSelectedCompetition] = useState<string>('peru');
  const [predictions, setPredictions] = useState<
    Record<number, PredictionData>
  >({});

  const ligas = competitionIds.map((comp) => {
    const ligas = COMPETITIONS[comp];
    return { label: ligas.flag + ' ' + comp + ' - ' + ligas.name, value: comp };
  });
  const { data, isLoading, error } = useCompetitionData(selectedCompetition);

  const matches = data?.matches ?? [];
  const teams = data?.teams ?? [];
  const leagueName = data?.leagueName;

  useEffect(() => {
    if (matches.length > 0 && teams.length > 0) {
      const preds: Record<number, PredictionData> = {};

      matches.forEach((match) => {
        const pred = calculatePrediction(match, selectedCompetition, teams);
        if (pred) {
          preds[match.id] = pred;
        }
      });
      setPredictions(preds);
    } else {
      setPredictions({});
    }
  }, [matches, teams, selectedCompetition]);

  if (isLoading) {
    return (
      <div className="flex min-h-100 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-betano-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-100 items-center justify-center">
        <div className="space-y-3 text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-400" />
          <p className="text-sm text-betano-muted">Error al cargar los datos</p>
          <p className="max-w-md text-xs text-betano-muted/60">
            {error instanceof Error ? error.message : 'Error desconocido'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="rounded-lg bg-betano-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="py-4 text-center"
      >
        <h1 className="mb-1 flex items-center justify-center gap-2 text-2xl font-bold">
          <Calendar className="h-6 w-6 text-betano-primary" />
          Partidos Programados
        </h1>
        <p className="text-sm text-betano-muted">
          {matches.length} partidos disponibles
        </p>
      </motion.div>

      <div className="flex justify-start gap-1 overflow-x-scroll">
        {competitionIds.map((comp) => {
          const info = COMPETITIONS[comp];
          const isActive = selectedCompetition === comp;

          return (
             info.favorite &&(
             <button
                onClick={() => setSelectedCompetition(comp)}
                className={`flex h-24 w-16 min-w-16 flex-col items-center justify-around gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-betano-light text-white'
                    : 'bg-betano-surface text-betano-muted hover:text-betano-text'
                }`}
              >
                <span className="text-lg">{info.flag}</span>
                <span className="text-xs">{info.name}</span>
              </button>
            )
          );
        })}
      </div>

      <div>
        <Select
          options={ligas}
          value={selectedCompetition}
          onChange={(value) => setSelectedCompetition(value)}
          searchable
          placeholder="Filtrar estado"
        />
      </div>

      {/* <GlowBackgroundButton/> */}
      {matches.length === 0 ? (
        <div className="py-8 text-center text-betano-muted">
          No hay partidos disponibles para esta liga
        </div>
      ) : (
        matches.reverse().map((match) => (
          <motion.div
            key={match.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {predictions[match.id] ? (
              <AnimatePresence mode="wait">
                <MatchList
                  prediction={predictions[match.id]}
                  date={match}
                  league={leagueName}
                />
                {/* <PredictorCard /> */}
              </AnimatePresence>
            ) : (
              <div className="rounded-md border border-slate-200 bg-white p-2 text-center text-sm text-betano-muted dark:border-betano-border dark:bg-betano-card">
                Sin datos de equipos
              </div>
            )}
          </motion.div>
        ))
      )}
      <div className="mx-auto grid max-w-2xl gap-3"></div>
    </div>
  );
}
