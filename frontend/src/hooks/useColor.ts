type ColorMetric =
  | 'amber'
  | 'indigo'
  | 'violet'
  | 'teal'
  | 'emerald'
  | 'blue'
  | 'rose';

export const useColor = (value: number, level: number, metric: ColorMetric) => {
  if (value > level) {
    switch (metric) {
      case 'amber':
        return 'text-amber-600 dark:text-amber-400';
      case 'indigo':
        return 'text-indigo-600 dark:text-indigo-400';
      case 'violet':
        return 'text-violet-600 dark:text-violet-400';
      case 'teal':
        return 'text-teal-600 dark:text-teal-400';
      case 'emerald':
        return 'text-emerald-600 dark:text-emerald-400';
      case 'blue':
        return 'text-blue-600 dark:text-blue-400';
      case 'rose':
        return 'text-rose-600 dark:text-rose-400';
    }
  }
  return 'text-slate-500 dark:text-slate-400';
};
