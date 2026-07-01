import { Calendar, CheckCircle, ChevronDown, Lightbulb, XCircle } from "lucide-react";
import { Badge } from "../ui/Bagde";
import { useState } from "react";

export const PredictorCard = () => {
  const [actualWinner, setActualWinner] = useState("HOME")
  const goalDiff = 0.77
  const isHit= true
  const imp = {
    home:0.35,
    draw:0.22,
    away:0.45
  }
  return (
    <div
      key={1}
      className={`flex flex-col justify-between overflow-hidden rounded-xl border bg-betano-card shadow-md transition-all duration-300 hover:scale-[1.01] hover:shadow-lg ${true ? 'border-green-500/20 hover:border-green-500/40' : 'border-betano-border hover:border-betano-light'}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-betano-border/60 bg-slate-900/45 px-4 py-2">
        <div className="flex items-center gap-2">
          <Calendar className="h-3.5 w-3.5 text-betano-muted" />
          <span className="font-mono text-[11px] font-medium text-betano-muted">
            ID: {2234}
            Mon 26
          </span>
        </div>
        {/* <div> */}
        {/*   <Badge */}
        {/*       variant="success" */}
        {/*       size="xs" */}
        {/*       className="border border-green-500/20" */}
        {/*     > */}
        {/*       Local */}
        {/*     </Badge> */}
        {/* </div> */}
      </div>

      <div className="flex flex-grow flex-col justify-between space-y-4 p-3">
        {/* Teams */}
        <div className="grid grid-cols-7 items-end gap-2 gap-y-1">
          <div className="col-span-3 text-right">
            <span
              className="block truncate text-xs font-semibold text-white md:text-sm"
              // title={match.home_team}
            >
              Comerciantes Unidos
            </span>
            <Badge variant="warning" size="xs">
              PPG: 1.31
            </Badge>

            {/* <span className="mt-1 inline-block rounded-full bg-white/5 px-1.5 py-0.5 text-[9px] font-medium text-betano-muted"> */}
              {/* PPG: {match.home_ppg.toFixed(2)} */}
            {/*   PPG: 1.31 */}
            {/* </span> */}
          </div>
          <div className="col-span-1 flex flex-col  items-center justify-between">
            {/* <div className="truncate rounded-md border border-betano-border bg-slate-900 px-2 py-1 text-xs font-black tracking-wider text-white shadow-inner"> */}
              {/* {homeScore} - {awayScore} */}
            {/*   VS */}
            {/* </div> */}
            {/* <Badge */}
            {/*   variant={`${goalDiff > 0.64 ? 'success' : goalDiff > 0.46 ? 'warning' : 'danger'}`} */}
            {/*   size="xs" */}
            {/* > */}
            {/*   {goalDiff.toFixed(2)} */}
            {/* </Badge> */}
            <span className="text-[11px] font-bold text-emerald-400">0.77</span>
          </div>
          <div className="col-span-3 text-left">
            <span
              className="block truncate text-xs font-semibold text-white md:text-sm"
              // title={match.away_team}
            >
              {/* {match.away_team} */}
              Deportivo Garcilazo
            </span>
            <Badge variant="danger" size="xs">
              PPG: 0.78
            </Badge>
          </div>


          <div className="col-span-3 text-right">

            <Badge variant="warning" size="xs">
              PPG: 1.31
            </Badge>
          </div>
          <div className="col-span-1 text-center">
            <span className="text-[11px] font-bold text-emerald-400">0.77</span>
          </div>
          <div className="col-span-3 text-left">
            <Badge variant="warning" size="xs">
              PPG: 1.31
            </Badge>
            {/* <span className="mt-1 inline-block rounded-full bg-white/5 px-1.5 py-0.5 text-[9px] font-medium text-betano-muted"> */}
              {/* PPG: {match.away_ppg.toFixed(2)} */}
            {/*   PPG: 0.87 */}
            {/* </span> */}
          </div>

        </div>

        {/* Implied probabilities bar */}
        {/* <div className="space-y-0.5"> */}
          {/* <div className="flex justify-between text-[9px] text-betano-muted"> */}
          {/*   <span>Prob. Implícitas (1)</span> */}
          {/*   <span>(X)</span> */}
          {/*   <span>(2)</span> */}
          {/* </div> */}
        {/*   <div className="flex h-3 w-full overflow-hidden rounded-full bg-slate-800"> */}
        {/*     <div */}
        {/*       style={{ width: `${imp.home * 100}%` }} */}
        {/*       className="h-full bg-gradient-to-r from-green-500/50 to-yellow-500/80 text-center font-mono text-[9px] text-gray-200" */}
        {/*       title={`Local: ${(imp.home * 100).toFixed(1)}%`} */}
        {/*     > */}
        {/*       {(imp.home * 100).toFixed(1)}% */}
        {/*     </div> */}
        {/**/}
        {/*     <div */}
        {/*       style={{ width: `${imp.draw * 100}%` }} */}
        {/*       className="h-full bg-yellow-500/80 text-center font-mono text-[9px] text-gray-200" */}
        {/*       title={`Empate: ${(imp.draw * 100).toFixed(1)}%`} */}
        {/*     > */}
        {/*       {(imp.draw * 100).toFixed(1)}% */}
        {/*     </div> */}
        {/**/}
        {/*     <div */}
        {/*       style={{ width: `${imp.away * 100}%` }} */}
        {/*       className="h-full bg-blue-500/80 text-center font-mono text-[9px] text-gray-300" */}
        {/*       title={`Visita: ${(imp.away * 100).toFixed(1)}%`} */}
        {/*     > */}
        {/*       {(imp.away * 100).toFixed(1)}% */}
        {/*     </div> */}
        {/*   </div> */}
        {/* </div> */}

        {/* Odds */}
        <div className="grid grid-cols-3 gap-1.5">
          <div
            className={`flex flex-col items-center justify-center rounded-lg border px-2 py-1 text-center transition-all ${actualWinner === 'HOME' ? 'border-green-500/40 bg-green-500/10 font-bold text-green-400' : 'border-betano-border/60 bg-slate-900/30 text-betano-muted'}`}
          >
            <span className="text-[9px] opacity-70">1</span>
            {/* <span className="text-xs font-semibold">{homeOdd.toFixed(2)}</span> */}
            <span className="text-xs font-semibold">2.22</span>
          </div>
          <div
            className={`flex flex-col items-center justify-center rounded-lg border px-2 py-1 text-center transition-all ${actualWinner === 'DRAW' ? 'border-yellow-500/40 bg-yellow-500/10 font-bold text-yellow-400' : 'border-betano-border/60 bg-slate-900/30 text-betano-muted'}`}
          >
            <span className="text-[9px] opacity-70">X</span>
            {/* <span className="text-xs font-semibold">{drawOdd.toFixed(2)}</span> */}
            <span className="text-xs font-semibold">3.22</span>
          </div>
          <div
            className={`flex flex-col items-center justify-center rounded-lg border px-2 py-1 text-center transition-all ${actualWinner === 'AWAY' ? 'border-blue-500/40 bg-blue-500/10 font-bold text-blue-400' : 'border-betano-border/60 bg-slate-900/30 text-betano-muted'}`}
          >
            <span className="text-[9px] opacity-70">2</span>
            {/* <span className="text-xs font-semibold">{awayOdd.toFixed(2)}</span> */}
            <span className="text-xs font-semibold">2.92</span>
          </div>
        </div>

        {/* Prediction */}
        <div className="mt-4 space-y-2 rounded-lg border border-betano-border/40 bg-slate-950/40 p-3 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Lightbulb className="h-3.5 w-3.5 text-yellow-500" />
              <span className="text-[11px] font-bold text-white">
                Pronóstico:
              </span>
            </div>
            <div className="flex items-center gap-4">
            <span className="rounded border border-yellow-500/15 bg-yellow-500/5 px-2 py-0.5 text-[10px] font-bold text-yellow-500">
              {/* {predInfo.label} */}
              Home
            </span>
              <Badge
                variant="success"
                size="xs"
              >
                43%
              </Badge>
            </div>
          </div>
          {/* <div className="flex items-center justify-between border-t border-betano-border/30 "> */}
          {/*   <span className="text-[10px] text-betano-muted">Sugerencia:</span> */}
          {/*   <span className="rounded border border-yellow-500/15 bg-yellow-500/5 px-2 py-0.5 text-[10px] font-bold text-yellow-500"> */}
              {/* {predInfo.label} */}
          {/*     Home */}
          {/*   </span> */}
          {/* </div> */}

          <div className="flex items-center justify-between border-t border-betano-border/50 pt-1 ">
            <span className="text-[10px] text-betano-muted">Ver mas detalles</span>
            <ChevronDown size={14}/>
          </div>
        </div>
      </div>
    </div>
  );
};
