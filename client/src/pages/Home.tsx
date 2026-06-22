import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// const SignIn = lazy(() => import('./SignIn');
export const Home = () => {
  const [activeTab, setActiveTab] = useState('goals');
  return (
    <div className="space-y-6">
      {/* <GlowBackgroundButton/> */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-5xl rounded-xl border border-betano-border bg-betano-card p-4"
      >
        <AnimatePresence mode="wait">
          {activeTab === 'goals' && (
            <motion.div
              key="goals"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="overflow-x-auto"
            >
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-betano-border text-betano-muted">
                    <th className="px-2 py-2 text-left">Métrica</th>
                    <th className="px-2 py-2 text-center text-betano-primary">
                      PGL
                    </th>
                    <th className="px-2 py-2 text-center text-betano-secondary">
                      PGV
                    </th>
                    <th className="px-2 py-2 text-center">1.5</th>
                    <th className="px-2 py-2 text-center">2.5</th>
                    <th className="px-2 py-2 text-center">3.5</th>
                    <th className="px-2 py-2 text-center">L</th>
                    <th className="px-2 py-2 text-center">E</th>
                    <th className="px-2 py-2 text-center">V</th>
                    <th className="px-2 py-2 text-center">GG</th>
                    <th className="px-2 py-2 text-center">Total</th>
                    <th className="px-2 py-2 text-center">1°</th>
                    <th className="px-2 py-2 text-center">HT</th>
                    <th className="px-2 py-2 text-center">ST</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-betano-border">
                  <tr className="hover:bg-betano-surface/50">
                    <td className="px-2 py-2 font-medium">2</td>
                    <td className="px-2 py-2 text-center font-bold text-green-400">
                      2.2
                    </td>
                    <td className="px-2 py-2 text-center font-bold text-red-400">
                      0.9
                    </td>
                    <td className="px-2 py-2 text-center">80%</td>
                    <td className={`px-2 py-2 text-center`}>70%</td>
                    <td className={`px-2 py-2 text-center`}>40%</td>
                    <td className={`px-2 py-2 text-center`}>30%</td>
                    <td className={`px-2 py-2 text-center`}>15%</td>
                    <td className={`px-2 py-2 text-center`}>55%</td>
                    <td className={`px-2 py-2 text-center`}>78%</td>
                    <td className="px-2 py-2 text-center font-bold text-blue-400">
                      2.5
                    </td>
                    <td className="px-2 py-2 text-center">45%</td>
                    <td className="px-2 py-2 text-center">76%</td>
                    <td className="px-2 py-2 text-center">54%</td>
                  </tr>
                </tbody>
              </table>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
