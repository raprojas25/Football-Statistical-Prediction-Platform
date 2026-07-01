interface TeamStatsDataGoals {
  win: number;
  draw: number;
  defeats: number;
  goals_scored_per_game: number;
  goals_conceded_per_game: number;
  team_scored_first: number;
  opponent_scored_first: number;
  total_goal_per_game: number;
  over_1_5: number;
  over_2_5: number;
  over_3_5: number;
  both_teams_scored: number;
}

interface TeamStatsDataScored {
  gf_over_05: number;
  gf_over_15: number;
  gf_over_25: number;
  gf_over_35: number;
  gf_over_45: number;
  ga_over_05: number;
  ga_over_15: number;
  ga_over_25: number;
  ga_over_35: number;
  ga_over_45: number;
}

interface TeamStatsDataRates {
  scoring_rate: number;
  scoring_rate_1st_h: number;
  scoring_rate_2nd_h: number;
  scored_in_both_halves: number;
  both_teams_scored: number;
  conceding_rate: number;
  conceding_rate_1st_half: number;
  conceding_rate_2nd_half: number;
  conceded_in_both_halves: number;
}
interface TeamStatsDataCorners {
  avg: number;
  over_2_5: number;
  over_3_5: number;
  over_4_5: number;
  over_5_5: number;
  over_6_5: number;
}
interface TeamStatsDataTotalCorners {
  avg: number;
  over_9_5: number;
  over_10_5: number;
  over_11_5: number;
  over_12_5: number;
  over_13_5: number;
}

export interface TeamStatsData {
  id: number;
  name: string;
  goals: {
    home: TeamStatsDataGoals;
    away: TeamStatsDataGoals;
  };
  scored_conceded: {
    home: TeamStatsDataScored;
    away: TeamStatsDataScored;
  };
  rates: {
    away: TeamStatsDataRates;
    home: TeamStatsDataRates;
  };
  corners_for: {
    home: TeamStatsDataCorners;
    away: TeamStatsDataCorners;
  };
  corners_against: {
    home: TeamStatsDataCorners;
    away: TeamStatsDataCorners;
  };
  Total_corners: {
    home: TeamStatsDataTotalCorners;
    away: TeamStatsDataTotalCorners;
  };
}

export interface PredictionData {
  home: TeamStatsData;
  away: TeamStatsData;
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

  corners_home: number;
  corners_away: number;

  cf_over_25: number;
  cf_over_35: number;
  cf_over_45: number;
  cf_over_55: number;
  cf_over_65: number;

  ca_over_25: number;
  ca_over_35: number;
  ca_over_45: number;
  ca_over_55: number;
  ca_over_65: number;

  tc_over_95: number;
  tc_over_105: number;
  tc_over_115: number;
  tc_over_125: number;

  total_corners_match: number;

  homePpg: number;
  awayPpg: number;
  odds: {
    home: number;
    draw: number;
    away: number;
  };
}
// new interfaces
export interface League {
  id: number;
  name: string;
  country: string;
  continent: string;
  logo_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Match {
  id: number;
  homeTeam: string;
  awayTeam: string;
  date: string;
  competition: string;
  matchday?: number | null;

  homePpg: number;
  awayPpg: number;
  odds?: {
    home?: number;
    draw?: number;
    away?: number;
  };
}

export interface Fixture {
  generated_at: string;
  competition: string;
  competition_name: string;
  country: string;
  count: number;
  matches: Match[];
}

export interface CompetitionData {
  matches: Match[];
  teams: TeamStatsData[];
  leagueName: Fixture;
}

export interface Score {
  home: number;
  away: number;
}
export interface MatchOdds {
  home: number;
  draw: number;
  away: number;
}
export interface OddsFixture {
  id: string;
  date_timestamp: number | null;
  date_str: string;
  home_team: string;
  away_team: string;
  home_ppg: number;
  away_ppg: number;
  status: string;
  score?: Score;
  odds?: MatchOdds;
}
export interface OddsData {
  generated_at?: string;
  source?: string;
  league?: string;
  country?: string;
  season?: number;
  fixtures?: OddsFixture[];
}

export interface TeamStats {
  id: number;
  name: string;
  goals: {
    home: {
      win: number;
      draw: number;
      defeats: number;
      goals_scored_per_game: number;
      goals_conceded_per_game: number;
      team_scored_first: number;
      opponent_scored_first: number;
      total_goal_per_game: number;
      over_1_5: number;
      over_2_5: number;
      over_3_5: number;
      both_teams_scored: number;
    };
    away: {
      win: number;
      draw: number;
      defeats: number;
      goals_scored_per_game: number;
      goals_conceded_per_game: number;
      team_scored_first: number;
      opponent_scored_first: number;
      total_goal_per_game: number;
      over_1_5: number;
      over_2_5: number;
      over_3_5: number;
      both_teams_scored: number;
    };
  };
  scored_conceded: {
    home: Record<string, number>;
    away: Record<string, number>;
  };
  rates: {
    home: Record<string, number>;
    away: Record<string, number>;
  };
  corners_for: {
    home: Record<string, number>;
    away: Record<string, number>;
  };
  corners_against: {
    home: Record<string, number>;
    away: Record<string, number>;
  };
  Total_corners: {
    home: Record<string, number>;
    away: Record<string, number>;
  };
}
