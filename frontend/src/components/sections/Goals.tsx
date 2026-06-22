import { motion } from "framer-motion";
import { PredictionData } from "@/types";

export default function Goals({data}: PredictionData) {
  return (
    <motion.div
      key="goals"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="overflow-x-auto mt-2"
    >
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-betano-border text-betano-muted bg-white/5">
            <th className="text-left py-2 px-2"></th>
            <th className="text-left py-2 px-2">N°</th>
            <th className="text-center py-2 px-2">Gol</th>
            <th className="text-center py-2 px-2">+0.5</th>
            <th className="text-center py-2 px-2">+1.5</th>
            <th className="text-center py-2 px-2">+2.5</th>
            <th className="text-center py-2 px-2">GG</th>
            <th className="text-center py-2 px-2">Total</th>
            <th className="text-center py-2 px-2">1.5</th>
            <th className="text-center py-2 px-2">2.5</th>
            <th className="text-center py-2 px-2">3.5</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-betano-border">
          <tr className="hover:bg-betano-surface/50">
            <td className="py-2 px-2 font-medium">L</td>
            <td className="py-2 px-2 font-medium">
              {data.home.id}
            </td>
            <td className="py-2 px-2 text-center">
              {data.pgfl.toFixed(1)}
            </td>
            <td className="py-2 px-2 text-center">
              {data.gf_05.toFixed(0)}%
            </td>
            <td className="py-2 px-2 text-center">
              {data.gf_15.toFixed(0)}%
            </td>
            <td className="py-2 px-2 text-center">
              {data.gf_25.toFixed(0)}%
            </td>
            <td rowSpan={2} className="py-2 px-2 text-center">
              {data.btts.toFixed(0)}%
            </td>
            <td rowSpan={2} className="py-2 px-2 text-center">
              {data.total_goals.toFixed(1)}
            </td>
            <td rowSpan={2} className="py-2 px-2 text-center">
              {data.over_1_5.toFixed(0)}%
            </td>
            <td rowSpan={2} className="py-2 px-2 text-center">
              {data.over_2_5.toFixed(0)}%
            </td>
            <td rowSpan={2} className="py-2 px-2 text-center">
              {data.over_3_5.toFixed(0)}%
            </td>
          </tr>
          <tr className="hover:bg-gray-700/50">
            <td className="py-2 px-2 font-medium">V</td>
            <td className="py-2 px-2 font-medium">
              {data.away.id}
            </td>
            <td className="py-2 px-2 text-center">
              {data.pgfv.toFixed(1)}
            </td>
            <td className="py-2 px-2 text-center">
              {data.ga_05.toFixed(0)}%
            </td>
            <td className="py-2 px-2 text-center">
              {data.ga_15.toFixed(0)}%
            </td>
            <td className="py-2 px-2 text-center">
              {data.ga_25.toFixed(0)}%
            </td>
          </tr>
        </tbody>
      </table>
    </motion.div>
  );
}
