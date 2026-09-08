import { CompetitionData } from '@/types';
import React from 'react';

interface Props {
  comp: CompetitionData;
  isActive: boolean;
  flag: string;
  leagueName: string;
  onClick: () => void;
}

export const TabTopLeagues: React.FC<Props> = ({
  comp,
  isActive,
  flag,
  leagueName,
  onClick,
}) => {
  return (
    <button
      key={comp.leagueName.country}
      onClick={onClick}
      className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
        isActive
          ? 'bg-primary-500 text-white'
          : 'border-betano-border bg-betano-surface text-betano-muted hover:text-betano-text border'
      }`}
    >
      <span className="text-lg">{flag}</span>
      {leagueName}
    </button>
  );
};
