import {
  pgTable,
  serial,
  varchar,
  timestamp,
  boolean,
  real,
  integer,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const leagues = pgTable("leagues", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  country: varchar("country", { length: 50 }),
  continent: varchar("continent", { length: 50 }),
  logoUrl: varchar("logo_url", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const teams = pgTable("teams", {
  id: serial("id").primaryKey(),
  leagueId: integer("league_id")
    .references(() => leagues.id)
    .notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).unique(),
  logoUrl: varchar("logo_url", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const teamStats = pgTable(
  "team_stats",
  {
    id: serial("id").primaryKey(),
    teamId: integer("team_id")
      .references(() => teams.id)
      .notNull(),
    matchDate: timestamp("match_date").notNull(),
    isHome: boolean("is_home").notNull(),
    goalsScored: real("goals_scored"),
    goalsConceded: real("goals_conceded"),
    totalGoals: real("total_goals"),
    over1_5: real("over_1_5"),
    over2_5: real("over_2_5"),
    over3_5: real("over_3_5"),
    bothTeamsScored: real("both_teams_scored"),
    winRate: real("win_rate"),
    drawRate: real("draw_rate"),
    defeatRate: real("defeat_rate"),
    scoredFirstRate: real("scored_first_rate"),
    concededFirstRate: real("conceded_first_rate"),
    cornersForAvg: real("corners_for_avg"),
    cornersAgainstAvg: real("corners_against_avg"),
    totalCornersAvg: real("total_corners_avg"),
    cornersOver2_5: real("corners_over_2_5"),
    cornersOver3_5: real("corners_over_3_5"),
    scoringRate: real("scoring_rate"),
    scoringRate1stHalf: real("scoring_rate_1st_half"),
    scoringRate2ndHalf: real("scoring_rate_2nd_half"),
    concedingRate: real("conceding_rate"),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    unique: uniqueIndex("unique_team_match_home").on(
      table.teamId,
      table.matchDate,
      table.isHome,
    ),
  }),
);

export const matches = pgTable("matches", {
  id: serial("id").primaryKey(),
  leagueId: integer("league_id")
    .references(() => leagues.id)
    .notNull(),
  homeTeamId: integer("home_team_id")
    .references(() => teams.id)
    .notNull(),
  awayTeamId: integer("away_team_id")
    .references(() => teams.id)
    .notNull(),
  matchDate: timestamp("match_date").notNull(),
  status: varchar("status", { length: 20 }).default("scheduled"),
  homeGoals: integer("home_goals"),
  awayGoals: integer("away_goals"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const predictions = pgTable("predictions", {
  id: serial("id").primaryKey(),
  matchId: integer("match_id")
    .references(() => matches.id)
    .notNull(),
  homeTeamId: integer("home_team_id")
    .references(() => teams.id)
    .notNull(),
  awayTeamId: integer("away_team_id")
    .references(() => teams.id)
    .notNull(),
  predictedWinner: varchar("predicted_winner", { length: 10 }),
  predictedGoalsHome: real("predicted_goals_home"),
  predictedGoalsAway: real("predicted_goals_away"),
  over1_5Probability: real("over_1_5_probability"),
  over2_5Probability: real("over_2_5_probability"),
  over3_5Probability: real("over_3_5_probability"),
  bttsProbability: real("btts_probability"),
  cornersOver9_5Probability: real("corners_over_9_5_probability"),
  totalCornersPredicted: real("total_corners_predicted"),
  confidenceLevel: varchar("confidence_level", { length: 20 }),
  createdAt: timestamp("created_at").defaultNow(),
});

export type League = typeof leagues.$inferSelect;
export type Team = typeof teams.$inferSelect;
export type TeamStats = typeof teamStats.$inferSelect;
export type Match = typeof matches.$inferSelect;
export type Prediction = typeof predictions.$inferSelect;
