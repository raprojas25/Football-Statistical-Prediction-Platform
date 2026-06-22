import { db, schema } from "../db";
import { eq, desc } from "drizzle-orm";

interface TeamStatsAvg {
  avgGoalsScored: number;
  avgGoalsConceded: number;
  avgOver2_5: number;
  avgBtts: number;
  avgCornersFor: number;
  avgCornersAgainst: number;
  avgTotalCorners: number;
  winRate: number;
}

async function getTeamAverages(teamId: number): Promise<TeamStatsAvg> {
  const stats = await db
    .select()
    .from(schema.teamStats)
    .where(eq(schema.teamStats.teamId, teamId))
    .orderBy(desc(schema.teamStats.matchDate))
    .limit(5);

  if (stats.length === 0) {
    return {
      avgGoalsScored: 1.5,
      avgGoalsConceded: 1.3,
      avgOver2_5: 0.55,
      avgBtts: 0.5,
      avgCornersFor: 5.5,
      avgCornersAgainst: 4.5,
      avgTotalCorners: 10,
      winRate: 0.4,
    };
  }

  const avg = (field: keyof (typeof stats)[0]) => {
    const values = stats
      .map((s) => s[field])
      .filter((v): v is number => v !== null && v !== undefined);
    return values.length > 0
      ? values.reduce((a, b) => a + b, 0) / values.length
      : 0;
  };

  return {
    avgGoalsScored: avg("goalsScored"),
    avgGoalsConceded: avg("goalsConceded"),
    avgOver2_5: avg("over2_5"),
    avgBtts: avg("bothTeamsScored"),
    avgCornersFor: avg("cornersForAvg"),
    avgCornersAgainst: avg("cornersAgainstAvg"),
    avgTotalCorners: avg("totalCornersAvg"),
    winRate: avg("winRate"),
  };
}

function weightedAverage(
  home: number,
  away: number,
  homeWeight = 0.55,
): number {
  return home * homeWeight + away * (1 - homeWeight);
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export async function calculatePrediction(
  db: any,
  homeTeamId: number,
  awayTeamId: number,
) {
  const home = await getTeamAverages(homeTeamId);
  const away = await getTeamAverages(awayTeamId);

  const predictedGoalsHome = weightedAverage(
    home.avgGoalsScored,
    away.avgGoalsConceded,
  );
  const predictedGoalsAway = weightedAverage(
    away.avgGoalsScored,
    home.avgGoalsConceded,
  );
  const totalGoals = predictedGoalsHome + predictedGoalsAway;

  const over1_5 = totalGoals > 1.5 ? 0.85 : 0.25;
  const over2_5 = totalGoals > 2.5 ? 0.65 : 0.35;
  const over3_5 = totalGoals > 3.5 ? 0.4 : 0.2;

  const btts = weightedAverage(home.avgBtts, away.avgBtts);

  const homeCorners = weightedAverage(
    home.avgCornersFor,
    away.avgCornersAgainst,
  );
  const awayCorners = weightedAverage(
    away.avgCornersFor,
    home.avgCornersAgainst,
  );
  const totalCorners = homeCorners + awayCorners;
  const cornersOver9_5 = totalCorners > 9.5 ? 0.7 : 0.3;

  const homeStrength = home.winRate;
  const awayStrength = away.winRate;
  const strengthDiff = homeStrength - awayStrength;

  let predictedWinner: string;
  if (strengthDiff > 0.15) predictedWinner = "home";
  else if (strengthDiff < -0.15) predictedWinner = "away";
  else predictedWinner = "draw";

  const confidence = Math.min(Math.abs(strengthDiff) * 2 + 0.3, 0.95);

  return {
    predictedWinner,
    predictedGoalsHome: Math.round(predictedGoalsHome * 10) / 10,
    predictedGoalsAway: Math.round(predictedGoalsAway * 10) / 10,
    over1_5Probability: clamp(over1_5, 0, 1),
    over2_5Probability: clamp(over2_5, 0, 1),
    over3_5Probability: clamp(over3_5, 0, 1),
    bttsProbability: clamp(btts, 0, 1),
    cornersOver9_5Probability: clamp(cornersOver9_5, 0, 1),
    confidenceLevel:
      confidence > 0.7 ? "high" : confidence > 0.5 ? "medium" : "low",
    homeCorners: Math.round(homeCorners * 10) / 10,
    awayCorners: Math.round(awayCorners * 10) / 10,
    totalCorners: Math.round(totalCorners * 10) / 10,
  };
}
