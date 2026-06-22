import { Hexagon, ChevronDown, Shield } from "lucide-react";
import { BadgeStat } from "./BadgeStat";
import { useState } from "react";
import Tabs from "./Tabs";
import Goals from "../sections/Goals";
import { Outcome } from "../sections/Outcome";
import { Rates } from "../sections/Rates";
import { Badge } from "./Badge";

type Props = {};

export default function Matches({ prediction }: any) {
  const [isOpen, setIsOpen] = useState<Boolean>(false);
  const [activeTab, setActiveTab] = useState("goals");

  const tabs = [
    { id: "goals", label: "Goles" },
    { id: "outcome", label: "(1X2)" },
    { id: "scoring", label: "HT-FT" },
    { id: "corners", label: "Corners" },
  ];
  if (!prediction)
    return (
      <div className="bg-betano-card p-2 rounded-md border border-betano-border space-y-3 relative overflow-hidden">
        <div className="absolute top-0 right-0 bg-betano-primary text-white rounded-bl-lg px-2 text-[10px] font-bold">
          BB
        </div>
        <h5 className="text-gray-300">No hay datos</h5>
      </div>
    );

  return (
    <div className="bg-betano-card border border-betano-border p-2 rounded-md space-y-2">
      <div className="flex justify-between items-center">
        <div className="flex justify-start items-center gap-1">
          <Hexagon size={14} />
          <span className="text-[12px] font-medium text-betano-muted">
            Perú
          </span>
          <span className="text-[12px] font-light text-betano-muted">
            Liga 1
          </span>
        </div>
        <div className="flex justify-start items-center gap-2">
          <span className="text-xs font-semibold text-betano-muted">26/04</span>
          <span className="text-xs font-semibold before:contents[*] before:text-red-500 before:block text-betano-muted">
            18:00
          </span>
        </div>
      </div>
      {/* Nombres de los Equipos */}
      <div className="flex justify-between items-center">
        <div className="flex-1 space-y-1 pr-2">
          <div className="grid grid-cols-2 items-center gap-2">
            <div className="flex justify-start items-center gap-2">
              {/* <Shield size={18} /> */}
              <p className="text-sm font-medium">{prediction.home.name}</p>
            </div>

            <div className="flex justify-end items-center gap-4">
              <Badge size="sm" variant="purple">
                {prediction.pgfl.toFixed(1)}
              </Badge>
              <Badge size="sm" variant="success">
                {prediction.win.toFixed(0)}%
              </Badge>
            </div>
          </div>
          <div className="grid grid-cols-2 items-center gap-2">
            <div className="flex justify-start items-center gap-2">
              {/* <Shield size={18} /> */}
              <p className="text-sm font-medium">{prediction.away.name}</p>
            </div>

            <div className="flex justify-end items-center gap-4">
              <Badge size="sm" variant="info">
                {prediction.pgfv.toFixed(1)}
              </Badge>
              <Badge size="sm" variant="error">
                {prediction.loss.toFixed(0)}%
              </Badge>
            </div>
          </div>
        </div>
        <div className="pr-2">
          <Badge size="sm" variant="warning">
            {prediction.draw.toFixed(0)}%
          </Badge>
        </div>
        <button
          className="rounded-md border border-betano-border p-2 hover:bg-white/5"
          onClick={() => setIsOpen(!isOpen)}
        >
          <ChevronDown
            size={20}
            className={`transition-transform duration-300 ${isOpen ? "-rotate-180" : ""}`}
          />
        </button>
      </div>
      {/* stats calculados */}
      <div>
        {/* stats de resultado */}
        <div className="grid grid-cols-3 gap-2 hidden">
          <BadgeStat metric="1" value={20} />
          <BadgeStat metric="X" value={20} />
          <BadgeStat metric="2" value={60} />
        </div>
        {/* others stats hidden */}
        {isOpen && (
          <div className="mt-4">
            <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
            {activeTab === "goals" && <Goals data={prediction} />}

            {activeTab === "outcome" && <Outcome data={prediction} />}

            {activeTab === "scoring" && <Rates data={prediction} />}
            {activeTab === "corners" && <div>Corners</div>}
          </div>
        )}
      </div>
    </div>
  );
}
