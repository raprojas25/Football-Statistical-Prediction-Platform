export interface League {
  id: number
  name: string
  country: string
  continent: string
  logo_url?: string
  created_at: string
  updated_at: string
}

export interface Team {
  id: number
  league_id: number
  name: string
  slug: string
  logo_url?: string
  league?: League
}

export interface TeamStats {
  id: number
  team_id: number
  match_date: string
  is_home: boolean
  goals_scored: number
  goals_conceded: number
  total_goals: number
  over_1_5: number
  over_2_5: number
  over_3_5: number
  both_teams_scored: number
  win_rate: number
  draw_rate: number
  defeat_rate: number
  scored_first_rate: number
  conceded_first_rate: number
  corners_for_avg: number
  corners_against_avg: number
  total_corners_avg: number
  corners_over_2_5: number
  corners_over_3_5: number
  scoring_rate: number
  scoring_rate_1st_half: number
  scoring_rate_2nd_half: number
  conceding_rate: number
}

export interface Match {
  id: number
  league_id: number
  home_team_id: number
  away_team_id: number
  match_date: string
  status: 'scheduled' | 'live' | 'finished'
  home_goals?: number
  away_goals?: number
  home_team?: Team
  away_team?: Team
  league?: League
}

export interface Prediction {
  id: number
  match_id: number
  predicted_winner: 'home' | 'draw' | 'away'
  over_1_5_probability: number
  over_2_5_probability: number
  over_3_5_probability: number
  btts_probability: number
  corners_over_9_5_probability: number
  confidence_level: 'high' | 'medium' | 'low'
  created_at: string
}

export interface TeamStatsData {
  goals: {
    home: Record<string, number>
    away: Record<string, number>
  }
  scored_conceded: {
    home: Record<string, number>
    away: Record<string, number>
  }
  rates: {
    home: Record<string, number>
    away: Record<string, number>
  }
  corners_for: {
    home: Record<string, number>
    away: Record<string, number>
  }
  corners_against: {
    home: Record<string, number>
    away: Record<string, number>
  }
  Total_corners: {
    home: Record<string, number>
    away: Record<string, number>
  }
}

export interface ScraperTeamData {
  id: number
  name: string
  goals: Record<string, Record<string, number>>
  scored_conceded: Record<string, Record<string, number>>
  rates: Record<string, Record<string, number>>
  corners_for: Record<string, Record<string, number>>
  corners_against: Record<string, Record<string, number>>
  Total_corners: Record<string, Record<string, number>>
}