import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);
    return Promise.reject(error);
  },
);

export interface League {
  id: number;
  name: string;
  country?: string;
  continent?: string;
  logoUrl?: string;
  _count?: { teams: number };
}

export interface Team {
  id: number;
  name: string;
  slug: string;
  leagueId: number;
  league?: League;
  logoUrl?: string;
}

export interface TeamStats {
  id: number;
  teamId: number;
  matchDate: string;
  isHome: boolean;
  goalsScored?: number;
  goalsConceded?: number;
  totalGoals?: number;
  over1_5?: number;
  over2_5?: number;
  over3_5?: number;
  bothTeamsScored?: number;
  winRate?: number;
  drawRate?: number;
  defeatRate?: number;
  scoredFirstRate?: number;
  concededFirstRate?: number;
  cornersForAvg?: number;
  cornersAgainstAvg?: number;
  totalCornersAvg?: number;
  cornersOver2_5?: number;
  cornersOver3_5?: number;
  scoringRate?: number;
  scoringRate1stHalf?: number;
  scoringRate2ndHalf?: number;
  concedingRate?: number;
}

export interface Prediction {
  predictedWinner: string;
  predictedGoalsHome: number;
  predictedGoalsAway: number;
  over1_5Probability: number;
  over2_5Probability: number;
  over3_5Probability: number;
  bttsProbability: number;
  cornersOver9_5Probability: number;
  confidenceLevel: string;
  homeCorners: number;
  awayCorners: number;
  totalCorners: number;
}

export const leaguesService = {
  getAll: () => api.get<League[]>("/leagues").then((r) => r.data),
  getById: (id: number) =>
    api.get<League>(`/leagues/${id}`).then((r) => r.data),
  getTeams: (id: number) =>
    api.get<Team[]>(`/leagues/${id}/teams`).then((r) => r.data),
};

export const teamsService = {
  getAll: () => api.get<Team[]>("/teams").then((r) => r.data),
  getById: (id: number) => api.get<Team>(`/teams/${id}`).then((r) => r.data),
  getStats: (id: number) =>
    api.get<TeamStats[]>(`/teams/${id}/stats`).then((r) => r.data),
  getHistory: (id: number) =>
    api.get(`/teams/${id}/history`).then((r) => r.data),
};

export const predictionsService = {
  generate: (homeTeamId: number, awayTeamId: number, matchId?: number) =>
    api
      .post<Prediction & { saved: boolean; predictionId: number | null }>(
        "/predictions/generate",
        {
          homeTeamId,
          awayTeamId,
          matchId,
        },
      )
      .then((r) => r.data),
  getByMatch: (matchId: number) =>
    api.get(`/predictions/match/${matchId}`).then((r) => r.data),
  getByLeague: (leagueId: number) =>
    api.get(`/predictions/league/${leagueId}`).then((r) => r.data),
  getAll: () => api.get("/predictions").then((r) => r.data),
};
