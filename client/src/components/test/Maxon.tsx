import { BoxSpin } from '../animated/BoxSpin';
import './style.css';

export const Maxon = () => {
  return (
    <div className="container grid grid-cols-2">
      <div className="relative flex h-72 w-44 flex-col overflow-hidden rounded-sm bg-gradient-to-b from-red-950 to-black text-white shadow-lg shadow-slate-950/70">
        <div className="absolute -left-[15%] top-6 h-44 w-[150%] origin-left -rotate-12 transform bg-gradient-to-br from-orange-800/80 via-orange-900/60 to-orange-900/30"></div>
        <div className="relative z-20 px-3 pt-8">
          <div className="font-sans text-5xl italic tracking-tighter text-white">
            MAXON
          </div>
          <span className="mt-1 block font-sans text-[9px] font-bold uppercase tracking-[0.32em] text-gray-300">
            General Use
          </span>
          <span className="mt-1 block text-[7px] font-light uppercase italic tracking-[0.2em] text-gray-400">
            High Quality for Everyday Recording
          </span>
        </div>
        <div className="relative z-20 mt-auto flex items-end justify-between border-t border-orange-900/30 px-3 py-3 text-sm text-gray-500">
          <span className="font-sans">EX-120</span>
          <span className="border border-gray-600 px-1 text-xs">VHS</span>
        </div>
      </div>

      <div className="relative flex h-72 w-44 flex-col overflow-hidden rounded-sm bg-gradient-to-b from-violet-900 via-black to-violet-800/70 p-3 text-white shadow-lg shadow-slate-950/70">
        <div className="flex flex-col">
          <span className="text-[9px] leading-5 tracking-widest text-gray-400">
            Nova
          </span>
        </div>
        <div className="text-2xl leading-4 tracking-wider">VIVID</div>
        <div className="font-sans text-[9px] uppercase leading-5 tracking-widest text-orange-400">
          High Grade
        </div>
        <div className="flex w-full items-center justify-center py-4">
          <div className="h-28 w-28 rounded-full bg-gradient-to-br from-amber-600 via-black to-amber-700 shadow-lg shadow-orange-950"></div>
        </div>
        <div className="text-center text-[8px] uppercase tracking-[0.15rem] text-gray-400">
          Clear · Crisp · Colour
        </div>
        <div className="h-1 w-full bg-gradient-to-r from-orange-500 via-emerald-500 to-violet-600"></div>
        <div className="mt-2 flex items-end justify-between">
          <div className="text-orange-400">
            <span className="text-4xl leading-none">
              6<span className="text-sm">hrs</span>
            </span>
          </div>
          <div className="flex flex-col items-end text-xs text-gray-400">
            <span className="text-[10px]">T-120</span>
            <span className="border border-orange-400 px-1 text-orange-400">
              VHS
            </span>
          </div>
        </div>
      </div>

      <div className="tape maxon">
        <div className="maxon-diag"></div>
        <div className="maxon-brandarea">
          <div className="maxon-brand">MAXON</div>
          <span className="maxon-use">General Use</span>
          <span className="maxon-quality">
            High Quality for Everyday Recording
          </span>
        </div>
        <div className="maxon-footer">
          <span className="maxon-designation">EX-120</span>
          <span className="vhs-badge">VHS</span>
        </div>
      </div>
      {/* border-spin */}
      <BoxSpin />
    </div>
  );
};
