import { Hexagon, ChevronDown, Clock, Minus } from 'lucide-react';
import { useState } from 'react';
import Tabs from '../ui/Tabs';
import { Badge } from '../ui/Bagde';
import { Goals } from './Goals';
import { Rates } from './Rates';
import { BadgeStats } from './BadgeStats';
import { OutComes } from './OutComes';
import { Corners } from './Corners';
import { AnimatePresence, motion, Variants } from 'framer-motion';
import { PredictionData } from '@/types';
import { Odds } from './Odds';
import { difference } from '@/utils/prediction';

export default function MatchList({
  prediction,
  date,
  league,
}: {
  prediction: PredictionData;
  date: any;
  league: any;
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState('scoring');

  const diff = difference(prediction.pgfl, prediction.pgfv);

  function formatDate(dateStr: string) {
    const date = new Date(dateStr);
    // const now = new Date();
    // const diff = date.getTime() - now.getTime();

    // const hours = Math.floor(diff / (1000 * 60 * 60));

    // if (hours < 0) return 'Finalizado';
    // if (hours < 24)
    //   return `Hoy ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;

    const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    return `${days[date.getDay()]} ${date.getDate()}/${date.getMonth() + 1} ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
  }

  const home: number = Number(prediction.win.toFixed(0));
  const draw: number = Number(prediction.draw.toFixed(0));
  const away: number = Number(prediction.loss.toFixed(0));

  function winner(caso: '1' | 'x' | '2') {
    switch (caso) {
      case '1':
        if (home - draw >= 4 && home - away >= 19) return 'active';
        break;
      case 'x':
        if (draw - home >= 4 && draw - away >= 4) return 'active';
        break;
      case '2':
        if (away - draw >= 4 && away - home >= 14) return 'active';
        break;
    }
  }

  function goalsColor(val: number) {
    if (val < 1) return 'danger';
    if (val > 0.9 && val < 1.6) return 'warning';
    if (val > 1.59) return 'success';
  }

  function diffColor(val: number) {
    if (val > 0.64) return 'text-betano-green';
    if (val > 0.46) return 'text-amber-700 dark:text-amber-400';
    return 'text-betano-orange';
  }

  function diffBorder(val: number) {
    if (val > 0.64) return 'border-betano-green/50 bg-betano-green/10';
    if (val > 0.46) return 'border-amber-500/50 bg-amber-500/10';
    return 'border-betano-orange/50 bg-betano-orange/10';
  }

  const name = league.competition_name.split(' (');

  const tabs = [
    { id: 'goals', label: 'Goles' },
    { id: 'outcome', label: '(1X2)' },
    { id: 'scoring', label: 'HT-FT' },
    { id: 'corners', label: 'Corners' },
    { id: 'odds', label: 'Odds' },
  ];

  const menuVariants: Variants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: 'auto',
      transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] },
    },
  };

  if (!prediction)
    return (
      <div className="relative overflow-hidden rounded-xl border border-betano-border bg-betano-card p-4">
        <div className="absolute right-0 top-0 rounded-bl-xl bg-betano-primary px-2.5 py-1 text-[10px] font-bold text-white">
          BB
        </div>
        <div className="flex items-center gap-2 text-betano-muted">
          <Hexagon size={16} className="text-betano-light" />
          <span className="text-[12px] font-semibold">
            {league.country} · {name[0]}
          </span>
        </div>
        <h5 className="mt-3 text-sm font-medium text-betano-muted">
          No hay datos disponibles
        </h5>
      </div>
    );

  return (
    <div className="overflow-hidden rounded-xl border border-betano-border bg-betano-card transition-all duration-200 hover:border-betano-light/40">
      {/* Header: Liga + Fecha */}
      <div className="flex items-center justify-between border-b border-betano-border/60 bg-betano-surface/50 px-3 py-1.5">
        <div className="flex min-w-0 items-center gap-1.5">
          <Hexagon size={13} className="shrink-0 text-betano-primary" />
          <span className="truncate text-[11px] font-semibold text-betano-muted">
            {league.country}
          </span>
          <span className="text-betano-light">·</span>
          <span className="truncate text-[11px] font-normal text-betano-muted/80">
            {name[0]}
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-1 text-betano-muted/70">
          <Clock size={11} />
          <span className="text-[11px] font-medium">
            {formatDate(date.date)}
          </span>
        </div>
      </div>

      {/* Equipos */}
      <button
        className="flex w-full items-center justify-between gap-3 px-3 py-3 text-left transition-colors duration-150 hover:bg-betano-surface/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-betano-primary/50"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label={`Ver detalles del partido ${prediction.home.name} vs ${prediction.away.name}`}
      >
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate text-sm font-medium text-betano-text">
              {prediction.home.name}
            </p>
            <Badge size="sm" variant={goalsColor(prediction.pgfl)}>
              {prediction.pgfl.toFixed(1)}
            </Badge>
          </div>
          <div className="flex items-center justify-between gap-2">
            <p className="truncate text-sm font-medium text-betano-text">
              {prediction.away.name}
            </p>
            <Badge size="sm" variant={goalsColor(prediction.pgfv)}>
              {prediction.pgfv.toFixed(1)}
            </Badge>
          </div>
        </div>

        {/* Diff + Expand */}
        <div className="flex shrink-0 items-center gap-2">
          <div
            className={`flex flex-col items-center justify-center rounded-full border p-1 text-[9px] font-bold opacity-90 ${diffBorder(diff)} ${diffColor(diff)}`}
            title={`Diferencia de poder: ${diff.toFixed(2)}`}
          >
            {diff.toFixed(1)}
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-betano-border bg-betano-surface/50 text-betano-muted transition-colors duration-200 group-hover:text-betano-primary">
            {isOpen ? (
              <Minus
                size={18}
                className={`transition-transform duration-300`}
              />
            ) : (
              <ChevronDown
                size={18}
                className={`transition-transform duration-300`}
              />
            )}
          </div>
        </div>
      </button>

      {/* Stats de resultado 1X2 */}
      <div className="border-t border-betano-border/60 px-3 py-2">
        {/* 1X2 Probabilidades */}
        <div className="grid grid-cols-3 gap-2">
          <BadgeStats
            metric="1"
            value={home}
            color={winner('1')}
            odds={prediction.odds?.home}
          />
          <BadgeStats
            metric="X"
            value={draw}
            color={winner('x')}
            odds={prediction.odds?.draw}
          />
          <BadgeStats
            metric="2"
            value={away}
            color={winner('2')}
            odds={prediction.odds?.away}
          />
        </div>

        {/* Detalles expandibles */}
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              key="details"
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="overflow-hidden"
            >
              <div className="pt-3">
                <Tabs
                  tabs={tabs}
                  activeTab={activeTab}
                  onChange={setActiveTab}
                />
                <div className="pt-2">
                  {activeTab === 'goals' && <Goals data={prediction} />}
                  {activeTab === 'outcome' && <OutComes data={prediction} />}
                  {activeTab === 'scoring' && <Rates data={prediction} />}
                  {activeTab === 'corners' && <Corners data={prediction} />}
                  {activeTab === 'odds' && <Odds data={prediction} />}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
