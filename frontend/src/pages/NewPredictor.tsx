import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Loader2, AlertCircle } from 'lucide-react';
import MatchList from '@/components/matches/MatchList';
import { PredictionData, Match } from '@/types';

const SWEDISH_NAME_MAP: Record<string, string> = {
  'Mjällby': 'Mjallby',
  'Häcken': 'Hacken',
  'Djurgården': 'Djurgarden',
  'Malmö FF': 'Malmo FF',
  'IFK Göteborg': 'IFK Goteborg',
  'Västerås SK': 'Vasteras',
  'Örgryte': 'Orgryte',
};

interface NewTeamStats {
  id: number;
  name: string;
  home: {
    goals: Record<string, number>;
    scoring: Record<string, number>;
    corners: Record<string, number>;
  };
  away: {
    goals: Record<string, number>;
    scoring: Record<string, number>;
    corners: Record<string, number>;
  };
}

function findTeam(name: string, teams: NewTeamStats[]): NewTeamStats | null {
  const normalized = (SWEDISH_NAME_MAP[name] || name).toLowerCase().trim();
  return teams.find(t => t.name.toLowerCase().trim() === normalized) || null;
}

function calc(a: number, b: number): number {
  return (a + b) / 2;
}

function calcOr(def: number, ...vals: (number | undefined)[]): number {
  return vals.every(v => v === undefined) ? def : calc(vals[0] ?? 0, vals[1] ?? 0);
}

function calculatePrediction(
  match: Match,
  teams: NewTeamStats[],
): PredictionData | null {
  const homeStats = findTeam(match.homeTeam, teams);
  const awayStats = findTeam(match.awayTeam, teams);

  if (!homeStats || !awayStats) return null;

  const hHome = homeStats.home.goals;
  const aAway = awayStats.away.goals;
  const hScoring = homeStats.home.scoring;
  const aScoring = awayStats.away.scoring;
  const hCorners = homeStats.home.corners;
  const aCorners = awayStats.away.corners;

  const cornersH = calc(hCorners.for_avg ?? 0, aCorners.against_avg ?? 0);
  const cornersA = calc(aCorners.for_avg ?? 0, hCorners.against_avg ?? 0);

  return {
    home: homeStats as any,
    away: awayStats as any,

    pgfl: calcOr(0, hHome.scored_pg, aAway.conceded_pg),
    pgfv: calcOr(0, hHome.conceded_pg, aAway.scored_pg),
    over_1_5: calcOr(0, hHome.over_1_5, aAway.over_1_5),
    over_2_5: calcOr(0, hHome.over_2_5, aAway.over_2_5),
    over_3_5: calcOr(0, hHome.over_3_5, aAway.over_3_5),
    btts: calcOr(0, hHome.both_scored, aAway.both_scored),
    total_goals: calcOr(0, hHome.total_pg, aAway.total_pg),
    win: calcOr(0, hHome.wins, aAway.defeats),
    draw: calcOr(0, hHome.draws, aAway.draws),
    loss: calcOr(0, hHome.defeats, aAway.wins),

    gf_05: calcOr(0, hScoring.gf_over_05, aScoring.ga_over_05),
    gf_15: calcOr(0, hScoring.gf_over_15, aScoring.ga_over_15),
    gf_25: calcOr(0, hScoring.gf_over_25, aScoring.ga_over_25),
    ga_05: calcOr(0, hScoring.ga_over_05, aScoring.gf_over_05),
    ga_15: calcOr(0, hScoring.ga_over_15, aScoring.gf_over_15),
    ga_25: calcOr(0, hScoring.ga_over_25, aScoring.gf_over_25),

    first_home: calcOr(0, hHome.scored_first, aAway.opponent_first),
    first_away: calcOr(0, aAway.scored_first, hHome.opponent_first),

    scoring_home: calcOr(0, hScoring.rate, aScoring.conceding_rate),
    scoring_away: calcOr(0, aScoring.rate, hScoring.conceding_rate),
    ht_home: calcOr(0, hScoring.rate_1st_h, aScoring.conceding_1st_h),
    ht_away: calcOr(0, aScoring.rate_1st_h, hScoring.conceding_1st_h),
    st_home: calcOr(0, hScoring.rate_2nd_h, aScoring.conceding_2nd_h),
    st_away: calcOr(0, aScoring.rate_2nd_h, hScoring.conceding_2nd_h),
    bt_home: calcOr(0, hScoring.scored_both_halves, aScoring.conceded_both_halves),
    bt_away: calcOr(0, aScoring.scored_both_halves, hScoring.conceded_both_halves),

    corners_home: cornersH,
    corners_away: cornersA,

    cf_over_35: calcOr(0, hCorners.for_over_3_5, aCorners.against_over_3_5),
    cf_over_45: calcOr(0, hCorners.for_over_4_5, aCorners.against_over_4_5),
    cf_over_55: calcOr(0, hCorners.for_over_5_5, aCorners.against_over_5_5),
    cf_over_65: calcOr(0, hCorners.for_over_6_5, aCorners.against_over_6_5),

    ca_over_35: calcOr(0, aCorners.for_over_3_5, hCorners.against_over_3_5),
    ca_over_45: calcOr(0, aCorners.for_over_4_5, hCorners.against_over_4_5),
    ca_over_55: calcOr(0, aCorners.for_over_5_5, hCorners.against_over_5_5),
    ca_over_65: calcOr(0, aCorners.for_over_6_5, hCorners.against_over_6_5),

    tc_over_95: calcOr(0, hCorners.total_over_9_5, aCorners.total_over_9_5),
    tc_over_105: calcOr(0, hCorners.total_over_10_5, aCorners.total_over_10_5),
    tc_over_115: calcOr(0, hCorners.total_over_11_5, aCorners.total_over_11_5),
    tc_over_125: calcOr(0, hCorners.total_over_12_5, aCorners.total_over_12_5),
    total_corners_match: calcOr(0, hCorners.total_avg, aCorners.total_avg),

    homePpg: match.homePpg,
    awayPpg: match.awayPpg,
    odds: {
      home: match.odds?.home || 1,
      draw: match.odds?.draw || 1,
      away: match.odds?.away || 1,
    },
  };
}

export default function NewPredictor() {
  const [fixtures, setFixtures] = useState<any>(null);
  const [teams, setTeams] = useState<NewTeamStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [predictions, setPredictions] = useState<Record<number, PredictionData>>({});

  useEffect(() => {
    Promise.all([
      fetch('/fixtures/sweden.json'),
      fetch('/data/sweden.json'),
    ])
      .then(([fixRes, teamsRes]) => {
        if (!fixRes.ok) throw new Error(`Fixtures error: ${fixRes.status}`);
        if (!teamsRes.ok) throw new Error(`Teams error: ${teamsRes.status}`);
        return Promise.all([fixRes.json(), teamsRes.json()]);
      })
      .then(([fixData, teamsData]) => {
        setFixtures(fixData);
        setTeams(teamsData);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setIsLoading(false);
      });
  }, []);

  const matches: Match[] = fixtures?.matches || [];

  useEffect(() => {
    if (matches.length > 0 && teams.length > 0) {
      const preds: Record<number, PredictionData> = {};
      matches.forEach((match) => {
        const pred = calculatePrediction(match, teams);
        if (pred) preds[match.id] = pred;
      });
      setPredictions(preds);
    } else {
      setPredictions({});
    }
  }, [matches, teams]);

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
          <p className="max-w-md text-xs text-betano-muted/60">{error}</p>
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
          {fixtures?.competition_name || 'Allsvenskan'}
        </h1>
        <p className="text-sm text-betano-muted">
          {matches.length} partidos disponibles
        </p>
      </motion.div>

      {matches.length === 0 ? (
        <div className="py-8 text-center text-betano-muted">
          No hay partidos disponibles
        </div>
      ) : (
        [...matches].map((match) => (
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
                  league={fixtures}
                />
              </AnimatePresence>
            ) : (
              <div className="rounded-md border border-slate-200 bg-white p-2 text-center text-sm text-betano-muted dark:border-betano-border dark:bg-betano-card">
                Sin datos de equipos para {match.homeTeam} vs {match.awayTeam}
              </div>
            )}
          </motion.div>
        ))
      )}
    </div>
  );
}
