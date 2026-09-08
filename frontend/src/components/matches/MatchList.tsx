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
import { Modal } from '../ui/Modal';
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
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const OpenModal = () => {
    setIsModalOpen(true);
  };

  const homeData = prediction.home.home.goals;

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
      <div className="border-betano-border bg-betano-card relative overflow-hidden rounded-xl border p-4">
        <div className="bg-betano-primary absolute top-0 right-0 rounded-bl-xl px-2.5 py-1 text-[10px] font-bold text-white">
          BB
        </div>
        <div className="text-betano-muted flex items-center gap-2">
          <Hexagon size={16} className="text-betano-light" />
          <span className="text-[12px] font-semibold">
            {league.country} · {name[0]}
          </span>
        </div>
        <h5 className="text-betano-muted mt-3 text-sm font-medium">
          No hay datos disponibles
        </h5>
      </div>
    );

  return (
    <div className="border-betano-border bg-betano-card hover:border-betano-light/40 overflow-hidden rounded-xl border transition-all duration-200">
      {/* Header: Liga + Fecha */}
      <div className="border-betano-border/60 bg-betano-surface/50 flex items-center justify-between border-b px-3 py-1.5">
        <div className="flex min-w-0 items-center gap-1.5">
          <Hexagon size={13} className="text-betano-primary shrink-0" />
          <span className="text-betano-muted truncate text-[11px] font-semibold">
            {league.country}
          </span>
          <span className="text-betano-light">·</span>
          <span className="text-betano-muted/80 truncate text-[11px] font-normal">
            {name[0]}
          </span>
        </div>
        <div className="text-betano-muted/70 flex shrink-0 items-center gap-1">
          <Clock size={11} />
          <span className="text-[11px] font-medium">
            {formatDate(date.date)}
          </span>
        </div>
      </div>

      {/* Equipos */}
      <div className="hover:bg-betano-surface/30 focus-visible:ring-betano-primary/50 flex w-full items-center justify-between gap-3 px-3 py-3 text-left transition-colors duration-150 focus:outline-none focus-visible:ring-2">
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex items-center justify-between gap-2">
            <button
              className="text-betano-text hover:text-betano-primary truncate text-sm font-medium hover:underline"
              onClick={() => OpenModal()}
            >
              {prediction.home.name}
            </button>
            <Badge size="sm" variant={goalsColor(prediction.pgfl)}>
              {prediction.pgfl.toFixed(1)}
            </Badge>
          </div>
          <div className="flex items-center justify-between gap-2">
            <button
              className="text-betano-text hover:text-betano-primary truncate text-sm font-medium hover:underline"
              onClick={() => OpenModal()}
            >
              {prediction.away.name}
            </button>
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
          <button
            className="border-betano-border bg-betano-surface/50 text-betano-muted group-hover:text-betano-primary flex h-8 w-8 items-center justify-center rounded-lg border transition-colors duration-200"
            onClick={() => setIsOpen(!isOpen)}
          >
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
          </button>
        </div>
      </div>

      {/* Stats de resultado 1X2 */}
      <div className="border-betano-border/60 border-t px-3 py-2">
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

      {/* Modal de creación/edición */}

      <Modal
        title={prediction.home.name}
        size="lg"
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
      >
        <div className="flex justify-between">
          <p>Wins:</p>
          <p>{prediction.home.home.goals.wins}</p>
        </div>
        <div className="flex justify-between">
          <p>draws:</p>
          <p>{prediction.home.home.goals.draws}</p>
        </div>
        <div className="flex justify-between">
          <p>defeats:</p>
          <p>{prediction.home.home.goals.defeats}</p>
        </div>
      </Modal>
    </div>
  );
}
