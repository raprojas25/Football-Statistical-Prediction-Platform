import React from 'react';

interface BadgeProps {
  metric: string;
  value: number;
  className?: string;
  percent?: boolean;
  odds?: number;
  /** Tamaño del texto: 'sm', 'base' (por defecto) o 'lg' */
  size?: 'sm' | 'md' | 'lg';
  /** Color del texto: 'default' (gris oscuro/claro) o 'muted' (más suave) */
  color?: 'success' | 'muted' | 'warning' | 'danger' | 'active';
  /** Espaciado inferior: si es true, añade margin-bottom */
  margin?: boolean;
}

export const BadgeStats: React.FC<BadgeProps> = ({
  metric,
  value,
  percent = true,
  odds,
  className = '',
  color = 'muted',
  size = 'sm',
}) => {
  const baseClasses = 'flex justify-between items-center rounded-lg border p-2';
  const colors = {
    success: 'border-green-200 bg-green-50 text-green-700 ',
    muted:
      'border-gray-200 bg-gray-500/5 dark:bg-white/5 text-gray-500 dark:border-slate-600 dark:text-gray-400',
    warning: 'border-amber-200 bg-amber-50 text-amber-700 ',
    danger: 'border-red-200 bg-red-50 text-red-700',
    active:
      'bg-betano-primary/90 dark:bg-betano-secondary text-white dark:border-slate-700',
  };

  const sizes = {
    sm: 'text-sm',
    md: 'p-1 text-base',
    lg: 'p-1 text-lg',
  };
  return (
    <div
      className={`${baseClasses} ${className} ${colors[color]} ${sizes[size]}`}
    >
      <span>{metric}</span>
      <div className='flex items-center gap-1'>
        {odds && (
        <span className='text-[11px] '>({odds.toFixed(2)})</span>
        )}
        <span className='text-[9px] opacity-80'>
        {value}
        {percent && '%'}
        </span>
      </div>

    </div>
    // <div
    //   className={`flex flex-col items-center justify-center rounded-lg border px-2 py-1.5 text-center transition-all border-green-500/40 bg-green-500/10 font-bold text-green-400`}
    // >
    //   <span className="text-[9px] opacity-70">{metric}</span>
    //   <div className="flex gap-1 items-center">
    //   <span className="text-xs font-semibold">3.22</span>
    //   <span className="font-mono text-[9px] text-gray-400">({value})%</span>
    //   </div>
    // </div>
  );
};
