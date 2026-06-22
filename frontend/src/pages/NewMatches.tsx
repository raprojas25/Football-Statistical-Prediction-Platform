import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Loader2 } from "lucide-react";
import Matches from "../components/ui/Matches";
import { mapTeamName, findTeam, type TeamStats } from "../utils/teamAdapter";

interface Match {
  id: number;
  homeTeam: string;
  awayTeam: string;
  date: string;
  competition: string;
  matchday: number;
}

interface PredictionData {
  home: { id: number; name: string; goals: { home: any; away: any } };
  away: { id: number; name: string; goals: { home: any; away: any } };
  pgfl: number;
  pgfv: number;
  over_1_5: number;
  over_2_5: number;
  over_3_5: number;
  btts: number;
  total_goals: number;
  win: number;
  draw: number;
  loss: number;
  gf_05: number;
  gf_15: number;
  gf_25: number;
  ga_05: number;
  ga_15: number;
  ga_25: number;
  first_home: number;
  first_away: number;
  scoring_home: number;
  scoring_away: number;
  ht_home: number;
  ht_away: number;
  st_home: number;
  st_away: number;
  bt_home: number;
  bt_away: number;
  corners_local: number;
  corners_away: number;
  total_corners: number;
  cf_over_25: number;
  cf_over_35: number;
  cf_over_45: number;
  ca_over_25: number;
  tc_over_95: number;
  tc_over_105: number;
}

const COMPETITIONS: Record<
  string,
  { name: string; flag: string; teamsFile: string; partidosFile: string }
> = {
  PL: {
    name: "Premier League",
    flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    teamsFile: "/data/inglaterra.json",
    partidosFile: "/data/partidos/PL.json",
  },
  SA: {
    name: "Serie A",
    flag: "🇮🇹",
    teamsFile: "/data/italia.json",
    partidosFile: "/data/partidos/SA.json",
  },
  PD: {
    name: "La Liga",
    flag: "🇪🇸",
    teamsFile: "/data/spain.json",
    partidosFile: "/data/partidos/PD.json",
  },
  BL1: {
    name: "Bundesliga",
    flag: "🇩🇪",
    teamsFile: "/data/alemania.json",
    partidosFile: "/data/partidos/BL1.json",
  },
  FL1: {
    name: "Ligue 1",
    flag: "🇫🇷",
    teamsFile: "/data/francia.json",
    partidosFile: "/data/partidos/FL1.json",
  },
  PO: {
    name: "Liga Portugal",
    flag: "🇵🇹",
    teamsFile: "/data/portugal.json",
    partidosFile: "/data/partidos/PO.json",
  },
  BSA: {
    name: "Seria A",
    flag: "🇧🇷",
    teamsFile: "/data/brasil.json",
    partidosFile: "/data/partidos/BSA.json",
  },
};

const competitionIds = Object.keys(COMPETITIONS);

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));

  if (hours < 0) return "Finalizado";
  if (hours < 24)
    return `Hoy ${date.getHours()}:${date.getMinutes().toString().padStart(2, "0")}`;

  const days = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
  return `${days[date.getDay()]} ${date.getDate()}/${date.getMonth() + 1} ${date.getHours()}:${date.getMinutes().toString().padStart(2, "0")}`;
}

function calculatePrediction(
  homeTeamName: string,
  awayTeamName: string,
  competition: string,
  teams: TeamStats[],
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

  const homeCorners = homeStats.corners_for.home;
  const awayCorners = awayStats.corners_for.away;
  const totalCornersHome = homeStats.Total_corners.home;

  return {
    home: {
      id: homeStats.id,
      name: homeTeamName,
      goals: {
        home: homeStats.goals.home,
        away: homeStats.goals.away,
      },
    },
    away: {
      id: awayStats.id,
      name: awayTeamName,
      goals: {
        home: awayStats.goals.home,
        away: awayStats.goals.away,
      },
    },
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
    gf_05: hScored.gf_over_05,
    gf_15: hScored.gf_over_15,
    gf_25: hScored.gf_over_25,
    ga_05: aScored.ga_over_05,
    ga_15: aScored.ga_over_15,
    ga_25: aScored.ga_over_25,
    first_home: hHome.team_scored_first,
    first_away: aAway.opponent_scored_first,
    scoring_home: hRates.scoring_rate,
    scoring_away: aRates.scoring_rate,
    ht_home: hRates.scoring_rate_1st_h,
    ht_away: aRates.scoring_rate_1st_h,
    st_home: hRates.scoring_rate_2nd_h,
    st_away: aRates.scoring_rate_2nd_h,
    bt_home: hRates.scored_in_both_halves,
    bt_away: aRates.scored_in_both_halves,
    corners_local: homeCorners.avg || 5.5,
    corners_away: awayCorners.avg || 4.5,
    total_corners: totalCornersHome.avg || 10,
    cf_over_25: homeCorners.over_2_5 || 70,
    cf_over_35: homeCorners.over_3_5 || 50,
    cf_over_45: homeCorners.over_4_5 || 30,
    ca_over_25: 70,
    tc_over_95: totalCornersHome.over_9_5 || 50,
    tc_over_105: totalCornersHome.over_10_5 || 35,
  };
}

export default function NewMatches() {
  const [selectedCompetition, setSelectedCompetition] = useState<string>("PL");
  const [matches, setMatches] = useState<Match[]>([]);
  const [teams, setTeams] = useState<TeamStats[]>([]);
  const [predictions, setPredictions] = useState<
    Record<number, PredictionData>
  >({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const comp = COMPETITIONS[selectedCompetition];

    Promise.all([
      fetch(comp.partidosFile)
        .then((r) => r.json())
        .catch(() => ({ matches: [] })),
      fetch(comp.teamsFile)
        .then((r) => r.json())
        .catch(() => []),
    ])
      .then(([matchesData, teamsData]) => {
        setMatches(matchesData.matches || []);
        setTeams(teamsData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading data:", err);
        setLoading(false);
      });
  }, [selectedCompetition]);

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
    }
  }, [matches, teams, selectedCompetition]);

  const activeCompetitions = competitionIds.filter((id) => {
    const comp = COMPETITIONS[id];
    return comp && (id === "PL" || id === "SA");
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-betano-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-4"
      >
        <h1 className="text-2xl font-bold mb-1 flex items-center justify-center gap-2">
          <Calendar className="w-6 h-6 text-betano-primary" />
          Partidos Programados
        </h1>
        <p className="text-betano-muted text-sm">
          {matches.length} partidos disponibles
        </p>
      </motion.div>

      <div className="flex flex-wrap gap-2 justify-center">
        {competitionIds.map((comp) => {
          const info = COMPETITIONS[comp];
          const isActive = selectedCompetition === comp;
          return (
            <button
              key={comp}
              onClick={() => setSelectedCompetition(comp)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                isActive
                  ? "bg-betano-primary text-white"
                  : "bg-betano-surface text-betano-muted hover:text-betano-text border border-betano-border"
              }`}
            >
              <span className="text-lg">{info.flag}</span>
              {info.name}
            </button>
          );
        })}
      </div>

      <div className="grid gap-3 max-w-2xl mx-auto">
        {matches.length === 0 ? (
          <div className="text-center py-8 text-betano-muted">
            No hay partidos disponibles para esta liga
          </div>
        ) : (
          matches.map((match) => (
            <motion.div
              key={match.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex justify-between items-center bg-betano-card border border-betano-border p-2 rounded-md mb-1">
                <div className="text-xs text-betano-muted">
                  {formatDate(match.date)} • J{match.matchday}
                </div>
              </div>
              {predictions[match.id] ? (
                <Matches prediction={predictions[match.id]} />
              ) : (
                <div className="bg-betano-card border border-betano-border p-2 rounded-md text-center text-betano-muted text-sm">
                  Sin datos de equipos
                </div>
              )}
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

