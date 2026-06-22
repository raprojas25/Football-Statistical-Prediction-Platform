import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Loader2, AlertCircle } from 'lucide-react';
import { mapTeamName, findTeam } from '../utils/teamAdapters';
import MatchList from '@/components/matches/MatchList';
import { PredictionData, TeamStatsData } from '@/types';
import { COMPETITIONS } from '@/constants/competitions';
import { useCompetitionData } from '../hooks/useCompetitionData';

const competitionIds = Object.keys(COMPETITIONS);

function calculatePrediction(
  homeTeamName: string,
  awayTeamName: string,
  competition: string,
  teams: TeamStatsData[],
): PredictionData | null {
  const homeName = mapTeamName(homeTeamName, competition);
  const awayName = mapTeamName(awayTeamName, competition);

  const homeStats = findTeam(homeName, teams);
  const awayStats = findTeam(awayName, teams);

  if (!homeStats || !awayStats) {
    console.log(
      `No se encontraron estadísticas para: ${homeName} vs ${awayName}`,
    );
    return null;
  }

  const calc = (a: number, b: number) => (a + b) / 2;

  const hHome = homeStats.goals.home;
  const aAway = awayStats.goals.away;

  const hScored = homeStats.scored_conceded.home;
  const aScored = awayStats.scored_conceded.away;

  const hRates = homeStats.rates.home;
  const aRates = awayStats.rates.away;

  const hCornersFor = homeStats.corners_for.home;
  const hCornersAgainst = homeStats.corners_against.home;

  const aCornersFor = awayStats.corners_for.away;
  const aCornersAgainst = awayStats.corners_against.away;

  const tCornersHome = homeStats.Total_corners.home;
  const tCornersAway = awayStats.Total_corners.away;

  const cornersH = calc(hCornersFor.avg, aCornersAgainst.avg);
  const cornersA = calc(aCornersFor.avg, hCornersAgainst.avg);

  return {
    home: homeStats,
    away: awayStats,
    pgfl: calc(hHome.goals_scored_per_game, aAway.goals_conceded_per_game),
    pgfv: calc(hHome.goals_conceded_per_game, aAway.goals_scored_per_game),

    over_1_5: calc(hHome.over_1_5, aAway.over_1_5),
    over_2_5: calc(hHome.over_2_5, aAway.over_2_5),
    over_3_5: calc(hHome.over_3_5, aAway.over_3_5),

    btts: calc(hHome.both_teams_scored, aAway.both_teams_scored),
    total_goals: calc(hHome.total_goal_per_game, aAway.total_goal_per_game),

    win: calc(hHome.win, aAway.defeats),
    draw: calc(hHome.draw, aAway.draw),
    loss: calc(hHome.defeats, aAway.win),

    gf_05: calc(hScored.gf_over_05, aScored.ga_over_05),
    gf_15: calc(hScored.gf_over_15, aScored.ga_over_15),
    gf_25: calc(hScored.gf_over_25, aScored.ga_over_25),
    ga_05: calc(hScored.ga_over_05, aScored.gf_over_05),
    ga_15: calc(hScored.ga_over_15, aScored.gf_over_15),
    ga_25: calc(hScored.ga_over_25, aScored.gf_over_25),

    first_home: calc(hHome.team_scored_first, aAway.opponent_scored_first),
    first_away: calc(aAway.team_scored_first, hHome.opponent_scored_first),

    scoring_home: calc(hRates.scoring_rate, aRates.conceding_rate),
    scoring_away: calc(aRates.scoring_rate, hRates.conceding_rate),
    ht_home: calc(hRates.scoring_rate_1st_h, aRates.conceding_rate_1st_half),
    ht_away: calc(aRates.scoring_rate_1st_h, hRates.conceding_rate_1st_half),
    st_home: calc(hRates.scoring_rate_2nd_h, aRates.conceding_rate_2nd_half),
    st_away: calc(aRates.scoring_rate_2nd_h, hRates.conceding_rate_2nd_half),
    bt_home: calc(hRates.scored_in_both_halves, aRates.conceded_in_both_halves),
    bt_away: calc(aRates.scored_in_both_halves, hRates.conceded_in_both_halves),

    corners_home: cornersH || 0,
    corners_away: cornersA || 0,
    total_corners: cornersH + cornersA || 0,

    cf_over_25: calc(hCornersFor.over_2_5, aCornersAgainst.over_2_5) || 0,
    cf_over_35: calc(hCornersFor.over_3_5, aCornersAgainst.over_3_5) || 0,
    cf_over_45: calc(hCornersFor.over_4_5, aCornersAgainst.over_4_5) || 0,
    cf_over_55: calc(hCornersFor.over_5_5, aCornersAgainst.over_5_5) || 0,
    cf_over_65: calc(hCornersFor.over_6_5, aCornersAgainst.over_6_5) || 0,

    ca_over_25: calc(aCornersFor.over_2_5, hCornersAgainst.over_2_5) || 0,
    ca_over_35: calc(aCornersFor.over_3_5, hCornersAgainst.over_3_5) || 0,
    ca_over_45: calc(aCornersFor.over_4_5, hCornersAgainst.over_4_5) || 0,
    ca_over_55: calc(aCornersFor.over_5_5, hCornersAgainst.over_5_5) || 0,
    ca_over_65: calc(aCornersFor.over_6_5, hCornersAgainst.over_6_5) || 0,

    tc_over_95: calc(tCornersHome.over_9_5, tCornersAway.over_9_5) || 0,
    tc_over_105: calc(tCornersHome.over_10_5, tCornersAway.over_10_5) || 0,
    tc_over_115: calc(tCornersHome.over_11_5, tCornersAway.over_11_5) || 0,
    tc_over_125: calc(tCornersHome.over_12_5, tCornersAway.over_12_5) || 0,

    total_corners_match: calc(tCornersHome.avg, tCornersAway.avg) || 0,
  };
}

export default function Matches() {
  const [selectedCompetition, setSelectedCompetition] = useState<string>('PE');
  const [predictions, setPredictions] = useState<
    Record<number, PredictionData>
  >({});

  const { data, isLoading, error } = useCompetitionData(selectedCompetition);

  const matches = data?.matches ?? [];
  const teams = data?.teams ?? [];
  const leagueName = data?.leagueName;

  useEffect(() => {
    if (matches.length > 0 && teams.length > 0) {
      const preds: Record<number, PredictionData> = {};

      matches.forEach((match) => {
        const pred = calculatePrediction(
          match.homeTeam,
          match.awayTeam,
          selectedCompetition,
          teams,
        );
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
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-betano-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
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
            <button
              key={comp}
              onClick={() => setSelectedCompetition(comp)}
              className={`flex h-24 w-16 min-w-16 flex-col items-center justify-around gap-2 overflow-hidden rounded-md border border-betano-border px-4 py-2 text-sm font-medium transition-all ${
                isActive
                  ? 'bg-betano-light text-white'
                  : 'bg-betano-surface text-betano-muted hover:text-betano-text'
              }`}
            >
              <span className="text-lg">{info.flag}</span>
              <span className="text-xs">{info.name}</span>
            </button>
          );
        })}
      </div>
      {/* <GlowBackgroundButton/> */}
      {matches.length === 0 ? (
        <div className="py-8 text-center text-betano-muted">
          No hay partidos disponibles para esta liga
        </div>
      ) : (
        matches.map((match) => (
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
              </AnimatePresence>
            ) : (
              <div className="rounded-md border border-betano-border bg-betano-card p-2 text-center text-sm text-betano-muted">
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
