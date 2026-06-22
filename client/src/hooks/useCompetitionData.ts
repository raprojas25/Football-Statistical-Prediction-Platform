import { useQuery } from '@tanstack/react-query';
import { CompetitionData, TeamStatsData } from '@/types';
import { COMPETITIONS } from '@/constants/competitions';

export function useCompetitionData(competition: string | null) {
  const comp = competition ? COMPETITIONS[competition] : null;

  return useQuery<CompetitionData>({
    queryKey: ['competition', competition],
    queryFn: async () => {
      const [fixturesRes, teamsRes] = await Promise.all([
        fetch(comp!.partidosFile),
        fetch(comp!.teamsFile),
      ]);

      if (!fixturesRes.ok) {
        throw new Error(
          `Error al cargar fixtures (${fixturesRes.status} ${fixturesRes.statusText})`,
        );
      }
      if (!teamsRes.ok) {
        throw new Error(
          `Error al cargar equipos (${teamsRes.status} ${teamsRes.statusText})`,
        );
      }

      const fixturesData = await fixturesRes.json();
      const teamsData = await teamsRes.json();

      return {
        matches: fixturesData.matches || [],
        teams: teamsData as TeamStatsData[],
        leagueName: fixturesData,
      };
    },
    enabled: !!comp,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
}
