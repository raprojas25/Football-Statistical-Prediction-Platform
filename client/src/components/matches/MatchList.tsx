import { Hexagon, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import Tabs from '../ui/Tabs';
import { Badge } from '../ui/Bagde';
import { Goals } from './Goals';
import { Rates } from './Rates';
import { BadgeStats } from './BadgeStats';
import { OutComes } from './OutComes';
import { Corners } from './Corners';
import { AnimatePresence, motion } from 'framer-motion';
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

  const diff  = difference(prediction.pgfl, prediction.pgfv)
  
  function formatDate(dateStr: string) {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = date.getTime() - now.getTime();

    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 0) return 'Finalizado';
    if (hours < 24)
      return `Hoy ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;

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

  const name = league.competition_name.split(' (');

  const tabs = [
    { id: 'goals', label: 'Goles' },
    { id: 'outcome', label: '(1X2)' },
    { id: 'scoring', label: 'HT-FT' },
    { id: 'corners', label: 'Corners' },
    { id: 'odds', label: 'Odds' },
  ];

  const menuVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: 'auto',
      transition: { duration: 0.3 },
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: { duration: 0.3 },
    },
  };

  if (!prediction)
    return (
      <div className="relative space-y-3 overflow-hidden rounded-md border border-betano-border bg-betano-card p-2">
        <div className="absolute right-0 top-0 rounded-bl-lg bg-betano-primary px-2 text-[10px] font-bold text-white">
          BB
        </div>
        <h5 className="text-gray-300">No hay datos</h5>
      </div>
    );

  return (
    <div className="space-y-2 rounded-md border border-slate-200 bg-gray-50 p-2 shadow dark:border-slate-700 dark:bg-betano-card">
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-start gap-1">
          <Hexagon size={14} />
          <span className="text-[12px] font-semibold text-gray-700 after:ml-0.5 after:text-gray-500 after:content-['-'] dark:text-gray-300">
            {league.country}
          </span>
          <span className="text-[12px] font-medium text-gray-600 dark:text-gray-400">
            {name[0]}
          </span>
          {/* <span className="text-[12px] font-light text-gray-600 before:ml-0.5 before:font-bold before:text-gray-500 before:content-['•'] dark:text-gray-400"> */}
          {/*   J{date.matchday} */}
          {/* </span> */}
        </div>
        <div className="flex items-center justify-start gap-2">
          {/* <span className="text-xs font-semibold text-betano-muted">26/04</span> */}
          <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400">
            {formatDate(date.date)}
          </span>
        </div>
      </div>
      {/* Nombres de los Equipos */}
      <div className="flex items-center justify-between">
        <div
          className="flex-1 space-y-1 pr-2 relative"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex items-center justify-between">
            <p className="text-sm">{prediction.home.name}</p>
            <Badge size="sm" variant={goalsColor(prediction.pgfl)}>
              {prediction.pgfl.toFixed(1)}
            </Badge>
          </div>

            <div className={`absolute p-1 text-[9px] bottom-[25%] right-9 rounded-full bg-white/30 dark:bg-black/20 border 
${diff > 0.64 ? 'border-emerald-500/50 text-emerald-400' : diff > 0.46 ? 'text-amber-400 border-amber-500/50' : 'text-orange-500 border-orange-500/50'}`}>
              {diff.toFixed(1)}
            </div>

          <div className="flex items-center justify-between">
            <p className="text-sm">{prediction.away.name}</p>
            <Badge size="sm" variant={goalsColor(prediction.pgfv)}>
              {prediction.pgfv.toFixed(1)}
            </Badge>
          </div>
        </div>
        <button
          className="rounded-md border border-slate-300 p-2 hover:bg-white/5 dark:border-slate-600"
          onClick={() => setIsOpen(!isOpen)}
        >
          <ChevronDown
            size={20}
            className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>
      </div>
      {/* stats calculados */}
      <div>
        {/* stats de resultado */}
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
        {/* others stats hidden */}
        {isOpen && (
          <AnimatePresence mode="wait">
            <motion.div
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="mt-4"
            >
              <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
              {activeTab === 'goals' && <Goals data={prediction} />}
              {activeTab === 'outcome' && <OutComes data={prediction} />}
              {activeTab === 'scoring' && <Rates data={prediction} />}
              {activeTab === 'corners' && <Corners data={prediction} />}
              {activeTab === 'odds' && <Odds data={prediction} />}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
