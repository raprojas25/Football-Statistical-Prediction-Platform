import { useState } from 'react'
import { motion } from 'framer-motion'
import { Football, MapPin, Calendar, Calculator } from 'lucide-react'

const leagues = [
  { id: 'alemania', name: 'Bundesliga', country: 'Alemania', flag: '🇩🇪' },
  { id: 'inglaterra', name: 'Premier League', country: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { id: 'espana', name: 'La Liga', country: 'España', flag: '🇪🇸' },
  { id: 'italia', name: 'Serie A', country: 'Italia', flag: '🇮🇹' },
  { id: 'francia', name: 'Ligue 1', country: 'Francia', flag: '🇫🇷' },
]

export default function HomePage() {
  const [selectedLeague, setSelectedLeague] = useState('')
  const [homeTeam, setHomeTeam] = useState('')
  const [awayTeam, setAwayTeam] = useState('')

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-8"
      >
        <h1 className="text-3xl font-bold mb-2">
          Pronósticos Deportivos
        </h1>
        <p className="text-betano-muted">
          Analiza estadísticas y genera predicciones inteligente
        </p>
      </motion.div>

      <div className="card max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-betano-muted">
                <MapPin className="w-4 h-4 inline mr-1" />
                Seleccionar Competencia
              </label>
              <select
                className="select w-full"
                value={selectedLeague}
                onChange={(e) => setSelectedLeague(e.target.value)}
              >
                <option value="">Seleccionar Liga</option>
                {leagues.map((league) => (
                  <option key={league.id} value={league.id}>
                    {league.flag} {league.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-betano-muted">
                <Football className="w-4 h-4 inline mr-1" />
                Equipo Local
              </label>
              <select
                className="select w-full"
                value={homeTeam}
                onChange={(e) => setHomeTeam(e.target.value)}
                disabled={!selectedLeague}
              >
                <option value="">Seleccionar Local</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-betano-muted">
                <Football className="w-4 h-4 inline mr-1" />
                Equipo Visitante
              </label>
              <select
                className="select w-full"
                value={awayTeam}
                onChange={(e) => setAwayTeam(e.target.value)}
                disabled={!selectedLeague}
              >
                <option value="">Seleccionar Visitante</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <button
              className="btn-primary flex items-center gap-2 px-8 py-4 text-lg"
              disabled={!homeTeam || !awayTeam || homeTeam === awayTeam}
            >
              <Calculator className="w-5 h-5" />
              Calcular Pronóstico
            </button>
          </div>
        </div>

        {!homeTeam || !awayTeam || homeTeam === awayTeam ? (
          <p className="text-center text-betano-muted mt-4 text-sm">
            Selecciona dos equipos diferentes para calcular el pronóstico
          </p>
        ) : null}
      </div>

      <div className="card max-w-4xl mx-auto">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-betano-primary" />
          <h2 className="text-lg font-semibold">Resultados Recientes</h2>
        </div>
        <p className="text-betano-muted text-center py-8">
          Selecciona una competencia y dos equipos para ver el análisis
        </p>
      </div>
    </div>
  )
}