import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Circle,
  MapPin,
  Calculator,
  Loader2,
  Trophy,
  Target,
  BarChart3,
  Database,
} from "lucide-react";
import type { TeamStatsData } from "@/types";
// import { TopLeagues } from '@/components/ui/TopLeagues'
import { Info } from "@/components/ui/Info";
// import Dashboard from '@/components/ui/Dashboard'
// import GlowBackgroundButton from '@/components/ui/Background'
import {
  leaguesService,
  teamsService,
  predictionsService,
  type League,
  type Team,
} from "@/services/api";
import { BetanoCard } from "@/components/ui/BetanoCard";
import Matches from "@/components/ui/Matches";
import { Header } from "@/components/layout/Header";

const USE_API = import.meta.env.VITE_USE_API === "true";

const leagues = [
  {
    id: "alemania",
    name: "Bundesliga",
    country: "Alemania",
    flag: "🇩🇪",
    apiId: 1,
  },
  {
    id: "inglaterra",
    name: "Premier League",
    country: "Inglaterra",
    flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    apiId: 2,
  },
  { id: "spain", name: "La Liga", country: "España", flag: "🇪🇸", apiId: 3 },
  { id: "italia", name: "Serie A", country: "Italia", flag: "🇮🇹", apiId: 4 },
  { id: "francia", name: "Ligue 1", country: "Francia", flag: "🇫🇷", apiId: 5 },
  { id: "peru", name: "Liga 1", country: "Peru", flag: "PE", apiId: 6 },
];

type TabType = "goals" | "corners" | "stats";

const tabs = [
  { id: "goals" as TabType, label: "Goles", icon: Target },
  { id: "corners" as TabType, label: "Corners", icon: Trophy },
  { id: "stats" as TabType, label: "Estadísticas", icon: BarChart3 },
];

export default function HomePage() {
  const [selectedLeague, setSelectedLeague] = useState("");
  const [selectedLeagueApiId, setSelectedLeagueApiId] = useState<number | null>(
    null,
  );
  const [homeTeam, setHomeTeam] = useState("");
  const [awayTeam, setAwayTeam] = useState("");
  const [teams, setTeams] = useState<TeamStatsData[]>([]);
  const [apiTeams, setApiTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<TabType>("goals");
  const [dataSource, setDataSource] = useState<"json" | "api">("json");

  useEffect(() => {
    if (USE_API && selectedLeagueApiId) {
      leaguesService
        .getTeams(selectedLeagueApiId)
        .then((data) => {
          setApiTeams(data);
          setDataSource("api");
        })
        .catch((err) => {
          console.error("API error, falling back to JSON:", err);
          loadJsonData();
        });
    } else if (selectedLeague) {
      loadJsonData();
    }
  }, [selectedLeague, selectedLeagueApiId]);

  const loadJsonData = () => {
    fetch(`/data/${selectedLeague}.json`)
      .then((res) => res.json())
      .then((data) => {
        setTeams(data);
        setDataSource("json");
      })
      .catch((err) => console.error("Error loading data:", err));
  };

  const calculatePrediction = async () => {
    if (!homeTeam || !awayTeam) return;

    setLoading(true);

    if (USE_API && dataSource === "api") {
      try {
        const homeId = parseInt(homeTeam);
        const awayId = parseInt(awayTeam);
        const result = await predictionsService.generate(homeId, awayId);

        const homeTeamData = apiTeams.find((t) => t.id === homeId);
        const awayTeamData = apiTeams.find((t) => t.id === awayId);

        setPrediction({
          home: { name: homeTeamData?.name },
          away: { name: awayTeamData?.name },
          pgfl: result.predictedGoalsHome,
          pgfv: result.predictedGoalsAway,
          over_1_5: result.over1_5Probability * 100,
          over_2_5: result.over2_5Probability * 100,
          over_3_5: result.over3_5Probability * 100,
          btts: result.bttsProbability * 100,
          total_goals: result.predictedGoalsHome + result.predictedGoalsAway,
          win:
            result.predictedWinner === "home"
              ? 70
              : result.predictedWinner === "draw"
                ? 30
                : 20,
          draw: result.predictedWinner === "draw" ? 70 : 20,
          loss: result.predictedWinner === "away" ? 70 : 20,
          corners_local: result.homeCorners,
          corners_away: result.awayCorners,
          total_corners: result.totalCorners,
          tc_over_95: result.cornersOver9_5Probability * 100,
          tc_over_105: result.cornersOver9_5Probability * 80,
          confidence: result.confidenceLevel,
        });
      } catch (err) {
        console.error("API prediction error:", err);
      }
    } else {
      const home = teams.find((t) => t.id === parseInt(homeTeam));
      const away = teams.find((t) => t.id === parseInt(awayTeam));

      if (!home || !away) {
        setLoading(false);
        return;
      }

      const calc = (homeVal: number, awayVal: number) =>
        (homeVal + awayVal) / 2;

      setPrediction({
        home: home,
        away: away,
        pgfl: calc(
          home.goals.home.goals_scored_per_game,
          away.goals.away.goals_conceded_per_game,
        ),
        pgfv: calc(
          home.goals.home.goals_conceded_per_game,
          away.goals.away.goals_scored_per_game,
        ),
        over_1_5: calc(home.goals.home.over_1_5, away.goals.away.over_1_5),
        over_2_5: calc(home.goals.home.over_2_5, away.goals.away.over_2_5),
        over_3_5: calc(home.goals.home.over_3_5, away.goals.away.over_3_5),
        btts: calc(
          home.goals.home.both_teams_scored,
          away.goals.away.both_teams_scored,
        ),
        total_goals: calc(
          home.goals.home.total_goal_per_game,
          away.goals.away.total_goal_per_game,
        ),
        win: calc(home.goals.home.win, away.goals.away.defeats),
        draw: calc(home.goals.home.draw, away.goals.away.draw),
        loss: calc(home.goals.home.defeats, away.goals.away.win),

        gf_05: calc(
          home.scored_conceded.home.gf_over_05 || 0,
          away.scored_conceded.away.ga_over_05 || 0,
        ),
        gf_15: calc(
          home.scored_conceded.home.gf_over_15 || 0,
          away.scored_conceded.away.ga_over_15 || 0,
        ),
        gf_25: calc(
          home.scored_conceded.home.gf_over_25 || 0,
          away.scored_conceded.away.ga_over_25 || 0,
        ),
        ga_05: calc(
          home.scored_conceded.home.ga_over_05 || 0,
          away.scored_conceded.away.gf_over_05 || 0,
        ),
        ga_15: calc(
          home.scored_conceded.home.ga_over_15 || 0,
          away.scored_conceded.away.gf_over_15 || 0,
        ),
        ga_25: calc(
          home.scored_conceded.home.ga_over_25 || 0,
          away.scored_conceded.away.gf_over_25 || 0,
        ),

        first_home: calc(
          home.goals.home.team_scored_first,
          away.goals.away.opponent_scored_first,
        ),
        first_away: calc(
          home.goals.home.opponent_scored_first,
          away.goals.away.team_scored_first,
        ),

        scoring_home: calc(
          home.rates.home.scoring_rate || 0,
          away.rates.away.conceding_rate || 0,
        ),
        scoring_away: calc(
          home.rates.home.conceding_rate || 0,
          away.rates.away.scoring_rate || 0,
        ),
        ht_home: calc(
          home.rates.home.scoring_rate_1st_h || 0,
          away.rates.away.conceding_rate_1st_half || 0,
        ),
        ht_away: calc(
          home.rates.home.conceding_rate_1st_half || 0,
          away.rates.away.scoring_rate_1st_h || 0,
        ),
        st_home: calc(
          home.rates.home.scoring_rate_2nd_h || 0,
          away.rates.away.conceding_rate_2nd_half || 0,
        ),
        st_away: calc(
          home.rates.home.conceding_rate_2nd_half || 0,
          away.rates.away.scoring_rate_2nd_h || 0,
        ),
        bt_home: calc(
          home.rates.home.scored_in_both_halves || 0,
          away.rates.away.conceded_in_both_halves || 0,
        ),
        bt_away: calc(
          home.rates.home.conceded_in_both_halves || 0,
          away.rates.away.scored_in_both_halves || 0,
        ),

        corners_local: calc(
          home.corners_for.home.avg,
          away.corners_against.away.avg,
        ),
        corners_away: calc(
          home.corners_against.home.avg,
          away.corners_for.away.avg,
        ),
        total_corners: calc(
          home.Total_corners.home.avg,
          away.Total_corners.away.avg,
        ),
        cf_over_25: calc(
          home.corners_for.home.over_2_5 || 0,
          away.corners_against.away.over_2_5 || 0,
        ),
        cf_over_35: calc(
          home.corners_for.home.over_3_5 || 0,
          away.corners_against.away.over_3_5 || 0,
        ),
        cf_over_45: calc(
          home.corners_for.home.over_4_5 || 0,
          away.corners_against.away.over_4_5 || 0,
        ),
        ca_over_25: calc(
          home.corners_against.home.over_2_5 || 0,
          away.corners_for.away.over_2_5 || 0,
        ),
        tc_over_95: calc(
          home.Total_corners.home.over_9_5 || 0,
          away.Total_corners.away.over_9_5 || 0,
        ),
        tc_over_105: calc(
          home.Total_corners.home.over_10_5 || 0,
          away.Total_corners.away.over_10_5 || 0,
        ),
      });
    }
    setLoading(false);
  };

  const getWinner = () => {
    if (!prediction) return null;
    const { win, draw, loss } = prediction;
    if (win > draw && win > loss) return "home";
    if (draw > win && draw > loss) return "draw";
    if (loss > win && loss > draw) return "away";
    return "draw";
  };

  const getCellColor = (
    value: number,
    threshold: number,
    type: "high" | "low" = "high",
  ) => {
    if (type === "high")
      return value >= threshold
        ? "text-green-400 font-bold"
        : "text-betano-muted";
    return value <= threshold ? "text-betano-muted" : "";
  };

  return (
    <div className="space-y-6">
      <Header />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-4"
      >
        <h1 className="text-2xl font-bold mb-1">Pronósticos Deportivos</h1>
        <p className="text-betano-muted text-sm">
          Analiza estadísticas y genera predicciones
        </p>
      </motion.div>

      <div className="card max-w-5xl mx-auto">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[300px]">
            <label className="block text-xs font-medium mb-1 text-betano-muted">
              <MapPin className="w-3 h-3 inline mr-1" />
              Competición
            </label>
            <select
              className="select w-full text-sm py-2"
              value={selectedLeague}
              onChange={(e) => {
                const league = leagues.find((l) => l.id === e.target.value);
                setSelectedLeague(e.target.value);
                setSelectedLeagueApiId(league?.apiId || null);
                setHomeTeam("");
                setAwayTeam("");
                setPrediction(null);
              }}
            >
              <option value="">Seleccionar</option>
              {leagues.map((league) => (
                <option key={league.id} value={league.id}>
                  {league.flag} {league.name}{" "}
                  {USE_API && <Database className="w-3 h-3 inline" />}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1 min-w-[150px]">
            <label className="block text-xs font-medium mb-1 text-betano-muted">
              <Circle className="w-3 h-3 inline mr-1" />
              Local
            </label>
            <select
              className="select w-full text-sm py-2"
              value={homeTeam}
              onChange={(e) => setHomeTeam(e.target.value)}
              disabled={!selectedLeague}
            >
              <option value="">Local</option>
              {(dataSource === "api" ? apiTeams : teams).map((team: any) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1 min-w-[150px]">
            <label className="block text-xs font-medium mb-1 text-betano-muted">
              <Circle className="w-3 h-3 inline mr-1" />
              Visitante
            </label>
            <select
              className="select w-full text-sm py-2"
              value={awayTeam}
              onChange={(e) => setAwayTeam(e.target.value)}
              disabled={!selectedLeague}
            >
              <option value="">Visitante</option>
              {(dataSource === "api" ? apiTeams : teams).map((team: any) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-shrink-0 w-full">
            <label className="block text-xs font-medium mb-1 text-betano-muted">
              &nbsp;
            </label>
            <button
              className="btn-primary flex items-center w-full justify-center gap-2 px-4 py-2 text-sm whitespace-nowrap disabled:opacity-50"
              disabled={
                !homeTeam || !awayTeam || homeTeam === awayTeam || loading
              }
              onClick={calculatePrediction}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Calculator className="w-4 h-4" />
              )}
              {loading ? "Calculando" : "Calcular"}
            </button>
          </div>
        </div>

        {homeTeam === awayTeam && homeTeam && (
          <p className="text-red-400 text-xs mt-2 text-center">
            Debes seleccionar equipos diferentes
          </p>
        )}
      </div>
      {/* <AnimatePresence mode='wait'> */}
      {/*   <TopLeagues/> */}
      {/* </AnimatePresence> */}
      <AnimatePresence mode="wait">
        {/* <Info prediction={prediction}/> */}
        <Matches prediction={prediction} />
        {/* <BetanoCard  prediction={prediction}/> */}
      </AnimatePresence>
      {/* <Dashboard/> */}
      {/* <GlowBackgroundButton/> */}
      {prediction && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card max-w-5xl mx-auto"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
            <div className="flex justify-around items-center gap-3">
              <span className="text-lg font-bold text-gray-100">
                {prediction.home.name}
              </span>
              <span className="text-betano-primary">vs</span>
              <span className="text-lg font-bold text-gray-100">
                {prediction.away.name}
              </span>
            </div>
            <div className="flex gap-1 justify-between bg-betano-dark rounded-lg p-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-all ${
                    activeTab === tab.id
                      ? "bg-betano-light text-white"
                      : "text-betano-muted hover:text-betano-text"
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === "goals" && (
              <motion.div
                key="goals"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="overflow-x-auto"
              >
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-betano-border text-betano-muted">
                      <th className="text-left py-2 px-2">Métrica</th>
                      <th className="text-center py-2 px-2 text-betano-primary">
                        PGL
                      </th>
                      <th className="text-center py-2 px-2 text-betano-secondary">
                        PGV
                      </th>
                      <th className="text-center py-2 px-2">1.5</th>
                      <th className="text-center py-2 px-2">2.5</th>
                      <th className="text-center py-2 px-2">3.5</th>
                      <th className="text-center py-2 px-2">L</th>
                      <th className="text-center py-2 px-2">E</th>
                      <th className="text-center py-2 px-2">V</th>
                      <th className="text-center py-2 px-2">GG</th>
                      <th className="text-center py-2 px-2">Total</th>
                      <th className="text-center py-2 px-2">1°</th>
                      <th className="text-center py-2 px-2">HT</th>
                      <th className="text-center py-2 px-2">ST</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-betano-border">
                    <tr className="hover:bg-betano-surface/50">
                      <td className="py-2 px-2 font-medium">
                        {prediction.home.id + ` - ` + prediction.away.id}
                      </td>
                      <td className="py-2 px-2 text-center text-green-400 font-bold">
                        {Number(prediction.pgfl).toFixed(2)}
                      </td>
                      <td className="py-2 px-2 text-center text-red-400 font-bold">
                        {Number(prediction.pgfv).toFixed(2)}
                      </td>
                      <td className="py-2 px-2 text-center">
                        {prediction.over_1_5.toFixed(0)}%
                      </td>
                      <td
                        className={`py-2 px-2 text-center ${getCellColor(prediction.over_2_5, 62)}`}
                      >
                        {prediction.over_2_5.toFixed(0)}%
                      </td>
                      <td
                        className={`py-2 px-2 text-center ${getCellColor(prediction.over_3_5, 38)}`}
                      >
                        {prediction.over_3_5.toFixed(0)}%
                      </td>
                      <td
                        className={`py-2 px-2 text-center ${getWinner() === "home" ? "text-green-400 font-bold" : ""}`}
                      >
                        {prediction.win.toFixed(0)}%
                      </td>
                      <td
                        className={`py-2 px-2 text-center ${getWinner() === "draw" ? "text-yellow-400 font-bold" : ""}`}
                      >
                        {prediction.draw.toFixed(0)}%
                      </td>
                      <td
                        className={`py-2 px-2 text-center ${getWinner() === "away" ? "text-red-400 font-bold" : ""}`}
                      >
                        {prediction.loss.toFixed(0)}%
                      </td>
                      <td
                        className={`py-2 px-2 text-center ${getCellColor(prediction.btts, 55)}`}
                      >
                        {prediction.btts.toFixed(1)}%
                      </td>
                      <td className="py-2 px-2 text-center text-blue-400 font-bold">
                        {prediction.total_goals.toFixed(2)}
                      </td>
                      <td className="py-2 px-2 text-center">
                        {prediction.first_home.toFixed(0)}%
                      </td>
                      <td className="py-2 px-2 text-center">
                        {prediction.ht_home.toFixed(0)}%
                      </td>
                      <td className="py-2 px-2 text-center">
                        {prediction.ht_away.toFixed(0)}%
                      </td>
                    </tr>
                  </tbody>
                </table>
              </motion.div>
            )}

            {activeTab === "corners" && (
              <motion.div
                key="corners"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="overflow-x-auto"
              >
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-betano-border text-betano-muted">
                      <th className="text-left py-2 px-2">Local</th>
                      <th className="text-center py-2 px-2 text-green-400">
                        CL
                      </th>
                      <th className="text-center py-2 px-2 text-red-400">CV</th>
                      <th className="text-center py-2 px-2">+/-</th>
                      <th className="text-center py-2 px-2">2.5</th>
                      <th className="text-center py-2 px-2">3.5</th>
                      <th className="text-center py-2 px-2">4.5</th>
                      <th className="text-center py-2 px-2">5.5</th>
                      <th className="text-center py-2 px-2">6.5</th>
                      <th className="text-center py-2 px-2 text-yellow-400">
                        Total
                      </th>
                      <th className="text-center py-2 px-2">9.5</th>
                      <th className="text-center py-2 px-2">10.5</th>
                      <th className="text-center py-2 px-2">11.5</th>
                      <th className="text-center py-2 px-2">12.5</th>
                      <th className="text-center py-2 px-2">13.5</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-betano-border">
                    <tr className="hover:bg-betano-surface/50">
                      <td className="py-2 px-2 font-medium">
                        {prediction.home.name}
                      </td>
                      <td className="py-2 px-2 text-center text-green-400 font-bold">
                        {Number(prediction.corners_local).toFixed(2)}
                      </td>
                      <td className="py-2 px-2 text-center text-red-400 font-bold">
                        {Number(prediction.corners_away).toFixed(2)}
                      </td>
                      <td className="py-2 px-2 text-center text-yellow-400 font-bold">
                        {Number(prediction.total_corners).toFixed(2)}
                      </td>
                      <td className="py-2 px-2 text-center">
                        {prediction.cf_over_25.toFixed(0)}%
                      </td>
                      <td className="py-2 px-2 text-center">
                        {prediction.cf_over_35.toFixed(0)}%
                      </td>
                      <td className="py-2 px-2 text-center">
                        {prediction.cf_over_45.toFixed(0)}%
                      </td>
                      <td className="py-2 px-2 text-center">-</td>
                      <td className="py-2 px-2 text-center">-</td>
                      <td className="py-2 px-2 text-center">
                        {Number(prediction.total_corners).toFixed(2)}
                      </td>
                      <td className="py-2 px-2 text-center">
                        {prediction.tc_over_95.toFixed(0)}%
                      </td>
                      <td className="py-2 px-2 text-center">
                        {prediction.tc_over_105.toFixed(0)}%
                      </td>
                      <td className="py-2 px-2 text-center">-</td>
                      <td className="py-2 px-2 text-center">-</td>
                      <td className="py-2 px-2 text-center">-</td>
                    </tr>
                  </tbody>
                </table>
              </motion.div>
            )}

            {activeTab === "stats" && (
              <motion.div
                key="stats"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="overflow-x-auto"
              >
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-betano-border text-betano-muted">
                      <th className="text-left py-2 px-2">Métrica</th>
                      <th className="text-center py-2 px-2">GF 0.5</th>
                      <th className="text-center py-2 px-2">GF 1.5</th>
                      <th className="text-center py-2 px-2">GF 2.5</th>
                      <th className="text-center py-2 px-2">GA 0.5</th>
                      <th className="text-center py-2 px-2">GA 1.5</th>
                      <th className="text-center py-2 px-2">Scoring Rate</th>
                      <th className="text-center py-2 px-2">HT Sc</th>
                      <th className="text-center py-2 px-2">ST Sc</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-betano-border">
                    <tr className="hover:bg-betano-surface/50">
                      <td className="py-2 px-2 font-medium">
                        {prediction.home.name}
                      </td>
                      <td className="py-2 px-2 text-center text-green-400">
                        {prediction.gf_05.toFixed(0)}%
                      </td>
                      <td className="py-2 px-2 text-center">
                        {prediction.gf_15.toFixed(0)}%
                      </td>
                      <td className="py-2 px-2 text-center">
                        {prediction.gf_25.toFixed(0)}%
                      </td>
                      <td className="py-2 px-2 text-center text-red-400">
                        {prediction.ga_05.toFixed(0)}%
                      </td>
                      <td className="py-2 px-2 text-center">
                        {prediction.ga_15.toFixed(0)}%
                      </td>
                      <td className="py-2 px-2 text-center text-yellow-400 font-bold">
                        {prediction.scoring_home.toFixed(0)}%
                      </td>
                      <td className="py-2 px-2 text-center">
                        {prediction.ht_home.toFixed(0)}%
                      </td>
                      <td className="py-2 px-2 text-center">
                        {prediction.ht_away.toFixed(0)}%
                      </td>
                    </tr>
                  </tbody>
                </table>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {!prediction && selectedLeague && teams.length > 0 && (
        <div className="card max-w-5xl mx-auto text-center py-8">
          <Calculator className="w-12 h-12 mx-auto text-betano-muted mb-3" />
          <p className="text-betano-muted text-sm">
            Selecciona{" "}
            <span className="text-betano-primary font-medium">Local</span> y{" "}
            <span className="text-betano-secondary font-medium">Visitante</span>{" "}
            para calcular el pronóstico
          </p>
          <p className="text-betano-muted text-xs mt-2">
            {teams.length} equipos disponibles en{" "}
            {leagues.find((l) => l.id === selectedLeague)?.name}
          </p>
        </div>
      )}

      {!selectedLeague && (
        <div className="card max-w-5xl mx-auto text-center py-8">
          <MapPin className="w-12 h-12 mx-auto text-betano-muted mb-3" />
          <p className="text-betano-muted text-sm">
            Selecciona una competición para comenzar
          </p>
        </div>
      )}
    </div>
  );
}
