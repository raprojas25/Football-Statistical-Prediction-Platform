import type { Score } from '@/types';

export interface PredictionResult {
  label: string;
  type:
    | 'HOME'
    | 'AWAY'
    | 'DRAW'
    | 'HOME_DRAW'
    | 'AWAY_DRAW'
    | 'HOME_AWAY'
    | 'NA';
  details: string;
  confidence: number;
}

export const calcImpliedProbs = (
  homeOdd: number,
  drawOdd: number,
  awayOdd: number,
) => {
  const rawHome = 1 / homeOdd;
  const rawDraw = 1 / drawOdd;
  const rawAway = 1 / awayOdd;
  const margin = rawHome + rawDraw + rawAway - 1;
  return {
    home: rawHome / (1 + margin),
    draw: rawDraw / (1 + margin),
    away: rawAway / (1 + margin),
    margin,
  };
};

export const difference = (home_ppg: number, away_ppg: number): number => {
  const ppgDiff = [home_ppg, away_ppg];
  const max: number = Math.max(...ppgDiff);
  const min: number = Math.min(...ppgDiff);
  return Number((max - min).toFixed(2));
};

export const getPrediction = (
  homeOdd: number = 1,
  drawOdd: number = 1,
  awayOdd: number = 1,
  homePPG: number = 0,
  awayPPG: number = 0,
): PredictionResult => {
  const imp = calcImpliedProbs(homeOdd, drawOdd, awayOdd);

  const homeAway = [homeOdd, awayOdd];
  const max = Math.max(...homeAway);
  const min = Math.min(...homeAway);

  const d: number = Number((max - min).toFixed(2));

  const totalPPG = homePPG + awayPPG;
  const formHome = totalPPG > 0 ? homePPG / totalPPG : 0.5;
  const formAway = totalPPG > 0 ? awayPPG / totalPPG : 0.5;
  const formParity = 1 - Math.abs(formHome - formAway);

  const wM = 0.6;
  const wF = 0.4;

  const scoreHome = wM * imp.home + wF * formHome;
  const scoreDraw = wM * imp.draw + wF * (0.33 * formParity);
  const scoreAway = wM * imp.away + wF * formAway;

  const scores = [
    { label: 'HOME' as const, score: scoreHome },
    { label: 'DRAW' as const, score: scoreDraw },
    { label: 'AWAY' as const, score: scoreAway },
  ];
  scores.sort((a, b) => b.score - a.score);

  const top = scores[0];
  const second = scores[1];
  const edge = top.score > 0 ? (top.score - second.score) / top.score : 0;
  const confidence = Math.min(Math.round(edge * 100), 100);

  const details = `Mdo: ${(imp.home * 100).toFixed(0)}/${(imp.draw * 100).toFixed(0)}/${(imp.away * 100).toFixed(0)} Frm: ${(formHome * 100).toFixed(0)}/${(formAway * 100).toFixed(0)} Brg: ${(imp.margin * 100).toFixed(1)}% Eth: ${edge.toFixed(2)}`;

  if (d > 3.4 || edge > 0.65) {
    return { label: 'No Apostar', type: 'NA', details, confidence };
  }

  if (top.label === 'HOME') {
    if (edge > 0.25) {
      return { label: 'LOCAL (1)', type: 'HOME', details, confidence };
    }
    if (second.label === 'DRAW') {
      return {
        label: 'Local o Empate (1X)',
        type: 'HOME_DRAW',
        details,
        confidence,
      };
    }
    return {
      label: 'Local o Visita (12)',
      type: 'HOME_AWAY',
      details,
      confidence,
    };
  }

  if (top.label === 'AWAY') {
    if (edge > 0.25) {
      return { label: 'VISITA (2)', type: 'AWAY', details, confidence };
    }
    if (second.label === 'DRAW') {
      return {
        label: 'Visita o Empate (2X)',
        type: 'AWAY_DRAW',
        details,
        confidence,
      };
    }
    return {
      label: 'Local o Visita (12)',
      type: 'HOME_AWAY',
      details,
      confidence,
    };
  }

  if (edge > 0.15) {
    return { label: 'EMPATE (X)', type: 'DRAW', details, confidence };
  }
  if (second.label === 'HOME') {
    return {
      label: 'Local o Empate (1X)',
      type: 'HOME_DRAW',
      details,
      confidence,
    };
  }
  return {
    label: 'Visita o Empate (2X)',
    type: 'AWAY_DRAW',
    details,
    confidence,
  };
};

export const isPredictionHit = (
  predType: string,
  score: Score | undefined,
): boolean => {
  if (!score) return false;
  const actualResult =
    score.home > score.away
      ? 'HOME'
      : score.home < score.away
        ? 'AWAY'
        : 'DRAW';
  if (predType === 'HOME' && actualResult === 'HOME') return true;
  if (predType === 'AWAY' && actualResult === 'AWAY') return true;
  if (predType === 'DRAW' && actualResult === 'DRAW') return true;
  if (
    predType === 'HOME_DRAW' &&
    (actualResult === 'HOME' || actualResult === 'DRAW')
  )
    return true;
  if (
    predType === 'AWAY_DRAW' &&
    (actualResult === 'AWAY' || actualResult === 'DRAW')
  )
    return true;
  if (
    predType === 'HOME_AWAY' &&
    (actualResult === 'HOME' || actualResult === 'AWAY')
  )
    return true;
  if (predType === 'NA') return true;
  return false;
};
