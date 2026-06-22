import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, Calculator, Loader2, Target, Trophy, BarChart3, Clock, MapPin, Home, ArrowRight, Save } from 'lucide-react'
// import { loadTeamData, mapTeamName, findTeam, COMPETITION_FILES, type TeamStats } from '@/utils/teamAdapter'
import { predictionsService, teamsService } from '../services/api'
import { loadTeamData, mapTeamName, findTeam, COMPETITION_FILES, type TeamStats } from '../utils/teamAdapter'

interface Match {
  id: number
  homeTeam: string
  awayTeam: string
  date: string
  competition: string
  matchday: number
}

interface Prediction {
  home: { name: string }
  away: { name: string }
  pgfl: number
  pgfv: number
  over_1_5: number
  over_2_5: number
  over_3_5: number
  btts: number
  total_goals: number
  win: number
  draw: number
  loss: number
  corners_local: number
  corners_away: number
  total_corners: number
  tc_over_95: number
  tc_over_105: number
}

const COMPETITIONS: Record<string, { name: string; flag: string }> = {
  BL1: { name: 'Bundesliga', flag: '🇩🇪' },
  PL: { name: 'Premier League', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  PD: { name: 'La Liga', flag: '🇪🇸' },
  SA: { name: 'Serie A', flag: '🇮🇹' },
  FL1: { name: 'Ligue 1', flag: '🇫🇷' },
  PE1: { name: 'Liga 1 Perú', flag: '🇵🇪' },
  // MX1: { name: 'Liga MX', flag: '🇲🇽' },
  // CL1: { name: 'Liga Chile', flag: '🇨🇱' },
  // CO1: { name: 'Liga Colombia', flag: '🇨🇴' },
  // AR1: { name: 'Liga Argentina', flag: '🇦🇷' },
  // BR1: { name: 'Serie A Brasil', flag: '🇧🇷' },
  // EC1: { name: 'Liga Pro Ecuador', flag: '🇪🇨' },
  // US1: { name: 'MLS', flag: '🇺🇸' },
}

type TabType = 'goals' | 'corners' | 'stats'

const tabs = [
  { id: 'goals' as TabType, label: 'Goles', icon: Target },
  { id: 'corners' as TabType, label: 'Corners', icon: Trophy },
  { id: 'stats' as TabType, label: 'Estadísticas', icon: BarChart3 },
]

function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  const now = new Date()
  const diff = date.getTime() - now.getTime()
  const hours = Math.floor(diff / (1000 * 60 * 60))
  
  if (hours < 0) return 'Finalizado'
  if (hours < 24) return `Hoy ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`
  
  const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
  return `${days[date.getDay()]} ${date.getDate()}/${date.getMonth() + 1} ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`
}

function calculatePredictionFromJSON(homeTeam: string, awayTeam: string): Prediction | null {
  return null
}

function calculatePrediction(homeTeam: string, awayTeam: string): Prediction | null {
  const hashTeam = (name: string) => {
    let hash = 0
    for (let i = 0; i < name.length; i++) {
      hash = ((hash << 5) - hash) + name.charCodeAt(i)
      hash |= 0
    }
    return Math.abs(hash) % 100
  }
  
  const homeHash = hashTeam(homeTeam)
  const awayHash = hashTeam(awayTeam)
  
  const homeStats = {
    goalsScored: 1.5 + (homeHash / 100),
    goalsConceded: 1.2 + ((100 - homeHash) / 100),
    over15: 55 + (homeHash % 40),
    over25: 35 + (homeHash % 30),
    over35: 15 + (homeHash % 25),
    btts: 45 + (homeHash % 35),
    win: 40 + (homeHash % 35),
    draw: 20 + ((homeHash * 2) % 20),
    loss: 100 - (40 + (homeHash % 35)) - (20 + ((homeHash * 2) % 20)),
  }
  
  const awayStats = {
    goalsScored: 1.3 + (awayHash / 100),
    goalsConceded: 1.4 + ((100 - awayHash) / 100),
    over15: 50 + (awayHash % 40),
    over25: 30 + (awayHash % 30),
    over35: 12 + (awayHash % 25),
    btts: 40 + (awayHash % 35),
    win: 35 + (awayHash % 35),
    draw: 22 + ((awayHash * 2) % 18),
    loss: 100 - (35 + (awayHash % 35)) - (22 + ((awayHash * 2) % 18)),
  }
  
  const calc = (a: number, b: number) => (a + b) / 2
  
  return {
    home: { name: homeTeam },
    away: { name: awayTeam },
    pgfl: calc(homeStats.goalsScored, awayStats.goalsConceded),
    pgfv: calc(homeStats.goalsConceded, awayStats.goalsScored),
    over_1_5: calc(homeStats.over15, awayStats.over15),
    over_2_5: calc(homeStats.over25, awayStats.over25),
    over_3_5: calc(homeStats.over35, awayStats.over35),
    btts: calc(homeStats.btts, awayStats.btts),
    total_goals: calc(homeStats.goalsScored + homeStats.goalsConceded, awayStats.goalsScored + awayStats.goalsConceded),
    win: calc(homeStats.win, awayStats.loss),
    draw: calc(homeStats.draw, awayStats.draw),
    loss: calc(homeStats.loss, awayStats.win),
    corners_local: calc(4.5 + (homeHash % 30) / 10, 4 + (awayHash % 30) / 10),
    corners_away: calc(4 + (awayHash % 30) / 10, 4.5 + (homeHash % 30) / 10),
    total_corners: calc(8.5 + (homeHash % 40) / 10, 8.5 + (awayHash % 40) / 10),
    tc_over_95: 55 + ((homeHash + awayHash) % 30),
    tc_over_105: 35 + ((homeHash + awayHash) % 25),
  }
}

const getWinner = (pred: Prediction) => {
  const { win, draw, loss } = pred
  if (win > draw && win > loss) return 'home'
  if (draw > win && draw > loss) return 'draw'
  if (loss > win && loss > draw) return 'away'
  return 'draw'
}

const getCellColor = (value: number, threshold: number, type: 'high' | 'low' = 'high') => {
  if (type === 'high') return value >= threshold ? 'text-green-400 font-bold' : 'text-betano-muted'
  return value <= threshold ? 'text-betano-muted' : ''
}

const getCompetitionApiId = (compCode: string): number | null => {
  const mapping: Record<string, number> = {
    'BL1': 1, // Bundesliga
    'PL': 2,  // Premier League
    'PD': 3,  // La Liga
    'SA': 4,  // Serie A
    'FL1': 5, // Ligue 1
  }
  return mapping[compCode] || null
}

const USE_API = import.meta.env.VITE_USE_API === 'true'

export default function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>([])
  const [teamsData, setTeamsData] = useState<Record<string, TeamStats[]>>({})
  const [selectedCompetition, setSelectedCompetition] = useState<string>('all')
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null)
  const [prediction, setPrediction] = useState<Prediction | null>(null)
  const [predictionSaved, setPredictionSaved] = useState(false)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<TabType>('goals')
  const [dataSource, setDataSource] = useState<'real' | 'simulated' | 'api'>('simulated')

  useEffect(() => {
    Promise.all([
      fetch('/data/matches.json').then(r => r.json()).catch(() => ({ matches: [] })),
      fetch('/data/matches_latam.json').then(r => r.json()).catch(() => ({ matches: [] })),
      fetch('/data/partidos_soccerway.json').then(r => r.json()).catch(() => ({ matches: [] })),
    ]).then(([europe, latam, soccerway]) => {
      const allMatches = [
        ...(europe.matches || []), 
        ...(latam.matches || []),
        ...(soccerway.matches || [])
      ]
      console.log('Matches loaded:', allMatches.length)
      setMatches(allMatches)
    }).catch(err => console.error('Error loading matches:', err))
  }, [])

  useEffect(() => {
    const loadAllTeams = async () => {
      const loaded: Record<string, TeamStats[]> = {}
      
      for (const [comp, file] of Object.entries(COMPETITION_FILES)) {
        try {
          const res = await fetch(file)
          const data = await res.json()
          loaded[comp] = data
          console.log(`Loaded ${data.length} teams for ${comp}`)
        } catch (err) {
          console.error(`Error loading ${comp}:`, err)
        }
      }
      
      setTeamsData(loaded)
    }
    
    loadAllTeams()
  }, [])

  const filteredMatches = selectedCompetition === 'all' 
    ? matches 
    : matches.filter(m => m.competition === selectedCompetition)

  const calculateRealPrediction = (homeTeamName: string, awayTeamName: string, competition: string): Prediction | null => {
    const teams = teamsData[competition]
    
    if (!teams || teams.length === 0) {
      console.log('No team data for', competition)
      return null
    }
    
    const homeMapped = mapTeamName(homeTeamName, competition)
    const awayMapped = mapTeamName(awayTeamName, competition)
    
    const homeTeam = findTeam(homeMapped, teams)
    const awayTeam = findTeam(awayMapped, teams)
    
    console.log('Looking for:', homeMapped, 'vs', awayMapped)
    console.log('Found:', homeTeam?.name, 'vs', awayTeam?.name)
    
    if (!homeTeam || !awayTeam) {
      console.log('Teams not found, using simulated')
      return null
    }
    
    const calc = (a: number, b: number) => (a + b) / 2
    
    const hGoals = homeTeam.goals.home
    const aGoals = awayTeam.goals.away
    
    const homeWinRate = hGoals.win
    const awayLossRate = aGoals.defeats
    
    return {
      home: { name: homeTeamName },
      away: { name: awayTeamName },
      pgfl: calc(hGoals.goals_scored_per_game, aGoals.goals_conceded_per_game),
      pgfv: calc(hGoals.goals_conceded_per_game, aGoals.goals_scored_per_game),
      over_1_5: calc(hGoals.over_1_5, aGoals.over_1_5),
      over_2_5: calc(hGoals.over_2_5, aGoals.over_2_5),
      over_3_5: calc(hGoals.over_3_5, aGoals.over_3_5),
      btts: calc(hGoals.both_teams_scored, aGoals.both_teams_scored),
      total_goals: calc(hGoals.total_goal_per_game, aGoals.total_goal_per_game),
      win: calc(homeWinRate, awayLossRate),
      draw: calc(hGoals.draw, aGoals.draw),
      loss: calc(hGoals.defeats, aGoals.win),
      corners_local: calc(5.5, 4.8),
      corners_away: calc(4.2, 5.1),
      total_corners: calc(9.7, 9.9),
      tc_over_95: 72,
      tc_over_105: 55,
    }
  }

  const handleMatchClick = async (match: Match) => {
    console.log('Clicked match:', match.homeTeam, 'vs', match.awayTeam, '(' + match.competition + ')')
    setSelectedMatch(match)
    setPrediction(null)
    setPredictionSaved(false)
    setDataSource('simulated')
    
    if (USE_API) {
      try {
        const compCode = getCompetitionApiId(match.competition)
        if (compCode) {
          const teams = await teamsService.getTeams(compCode)
          
          const homeTeamApi = teams.find(t => 
            t.name.toLowerCase().includes(match.homeTeam.toLowerCase().split(' ').pop() || '') ||
            match.homeTeam.toLowerCase().includes(t.name.toLowerCase().split(' ').pop() || '')
          )
          const awayTeamApi = teams.find(t => 
            t.name.toLowerCase().includes(match.awayTeam.toLowerCase().split(' ').pop() || '') ||
            match.awayTeam.toLowerCase().includes(t.name.toLowerCase().split(' ').pop() || '')
          )
          
          if (homeTeamApi && awayTeamApi) {
            setLoading(true)
            const result = await predictionsService.generate(homeTeamApi.id, awayTeamApi.id, match.id)
            
            setPrediction({
              home: { name: match.homeTeam },
              away: { name: match.awayTeam },
              pgfl: result.predictedGoalsHome,
              pgfv: result.predictedGoalsAway,
              over_1_5: result.over1_5Probability * 100,
              over_2_5: result.over2_5Probability * 100,
              over_3_5: result.over3_5Probability * 100,
              btts: result.bttsProbability * 100,
              total_goals: result.predictedGoalsHome + result.predictedGoalsAway,
              win: result.predictedWinner === 'home' ? 70 : result.predictedWinner === 'draw' ? 30 : 20,
              draw: result.predictedWinner === 'draw' ? 70 : 20,
              loss: result.predictedWinner === 'away' ? 70 : 20,
              corners_local: result.homeCorners || 5.5,
              corners_away: result.awayCorners || 4.5,
              total_corners: result.totalCorners || 10,
              tc_over_95: result.cornersOver9_5Probability * 100,
              tc_over_105: result.cornersOver9_5Probability * 80,
            })
            setDataSource('api')
            if (result.saved) {
              setPredictionSaved(true)
            }
            setLoading(false)
            console.log('Using API data for prediction, saved:', result.saved)
            return
          }
        }
      } catch (err) {
        console.error('API error, falling back to local:', err)
      }
    }
    
    // Try to use real data from JSON
    const realPred = calculateRealPrediction(match.homeTeam, match.awayTeam, match.competition)
    
    if (realPred) {
      setPrediction(realPred)
      setDataSource('real')
      console.log('Using REAL data for prediction')
    } else {
      const pred = calculatePrediction(match.homeTeam, match.awayTeam)
      setPrediction(pred)
      console.log('Using SIMULATED data for prediction')
    }
  }

  const handleCalculate = () => {
    if (!selectedMatch) return
    console.log('Calculating prediction for:', selectedMatch.homeTeam, 'vs', selectedMatch.awayTeam)
    setLoading(true)
    
    setTimeout(() => {
      const pred = calculatePrediction(selectedMatch.homeTeam, selectedMatch.awayTeam)
      console.log('Prediction result:', pred)
      setPrediction(pred)
      setLoading(false)
    }, 500)
  }

  const competitions = [...new Set(matches.map(m => m.competition))]

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-4"
      >
        <h1 className="text-2xl font-bold mb-1 flex items-center justify-center gap-2">
          <Calendar className="w-6 h-6 text-betano-primary" />
          Partidos Programados
        </h1>
        <p className="text-betano-muted text-sm">
          Próximos 14 días • {matches.length} partidos disponibles
        </p>
      </motion.div>

      <div className="card max-w-5xl mx-auto">
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
              selectedCompetition === 'all' 
                ? 'bg-betano-primary text-white' 
                : 'bg-betano-surface text-betano-muted hover:text-betano-text'
            }`}
            onClick={() => setSelectedCompetition('all')}
          >
            Todas
          </button>
          {competitions.map(comp => (
            <button
              key={comp}
              className={`px-3 py-1.5 rounded-lg text-sm transition-all flex items-center gap-1 ${
                selectedCompetition === comp 
                  ? 'bg-betano-primary text-white' 
                  : 'bg-betano-surface text-betano-muted hover:text-betano-text'
              }`}
              onClick={() => setSelectedCompetition(comp)}
            >
              {COMPETITIONS[comp]?.flag} {COMPETITIONS[comp]?.name || comp}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-betano-dark">
              <tr className="border-b border-betano-border text-betano-muted">
                <th className="text-left py-2 px-2">Fecha</th>
                <th className="text-left py-2 px-2">Liga</th>
                <th className="text-left py-2 px-2">Local</th>
                <th className="text-center py-2 px-2">-</th>
                <th className="text-left py-2 px-2">Visitante</th>
                <th className="text-center py-2 px-2">Jornada</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-betano-border">
              {filteredMatches.slice(0, 50).map(match => (
                <tr 
                  key={match.id} 
                  className={`hover:bg-betano-surface/50 cursor-pointer transition-colors ${
                    selectedMatch?.id === match.id ? 'bg-betano-primary/20' : ''
                  }`}
                  onClick={() => handleMatchClick(match)}
                >
                  <td className="py-2 px-2 text-betano-muted">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDate(match.date)}
                    </div>
                  </td>
                  <td className="py-2 px-2">
                    <span className="text-lg">{COMPETITIONS[match.competition]?.flag}</span>
                  </td>
                  <td className="py-2 px-2 font-medium">{match.homeTeam}</td>
                  <td className="py-2 px-2 text-center text-betano-muted">vs</td>
                  <td className="py-2 px-2 font-medium">{match.awayTeam}</td>
                  <td className="py-2 px-2 text-center text-betano-muted">{match.matchday}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredMatches.length > 50 && (
          <p className="text-betano-muted text-xs text-center mt-2">
            Mostrando 50 de {filteredMatches.length} partidos
          </p>
        )}
      </div>

      {selectedMatch && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card max-w-5xl mx-auto"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
            <div className="flex justify-around items-center gap-3 flex-1">
              <div className="text-center">
                <div className="text-base font-bold text-gray-100">{selectedMatch.homeTeam}</div>
                <div className="text-xs text-betano-muted flex items-center justify-center gap-1">
                </div>
              </div>
              <span className="text-betano-primary text-lg font-bold">vs</span>
              <div className="text-center">
                <div className="text-base font-bold text-gray-100">{selectedMatch.awayTeam}</div>
                <div className="text-xs text-betano-muted flex items-center justify-center gap-1">
                </div>
              </div>
            </div>
            <div className="flex justify-center items-center gap-2">
              <span className={`text-xs px-2 py-1 rounded ${
                dataSource === 'api' ? 'bg-blue-600 text-white' : 
                dataSource === 'real' ? 'bg-green-600 text-white' : 'bg-yellow-600 text-white'
              }`}>
                {dataSource === 'api' ? '🔌 API' : dataSource === 'real' ? '✅ Datos Reales' : '⚠️ Simulado'}
              </span>
              {predictionSaved && (
                <span className="text-xs px-2 py-1 rounded bg-green-600 text-white flex items-center gap-1">
                  <Save className="w-3 h-3" /> Guardado
                </span>
              )}
            </div>
          </div>
            <button
              className="btn-primary flex items-center gap-2 px-4 py-2"
              onClick={handleCalculate}
              disabled={loading}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Calculator className="w-4 h-4" />}
              {loading ? 'Calculando...' : 'Generar Pronóstico'}
            </button>

          {prediction && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="flex gap-1 justify-between bg-betano-dark rounded-lg p-1 mb-4">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-all ${
                      activeTab === tab.id
                        ? 'bg-betano-light text-white'
                        : 'text-betano-muted hover:text-betano-text'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </div>

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
                          <th className="text-left py-2 px-2">Métrica</th>
                          <th className="text-center py-2 px-2 text-betano-primary">PGL</th>
                          <th className="text-center py-2 px-2 text-betano-secondary">PGV</th>
                          <th className="text-center py-2 px-2">1.5</th>
                          <th className="text-center py-2 px-2">2.5</th>
                          <th className="text-center py-2 px-2">3.5</th>
                          <th className="text-center py-2 px-2">L</th>
                          <th className="text-center py-2 px-2">E</th>
                          <th className="text-center py-2 px-2">V</th>
                          <th className="text-center py-2 px-2">GG</th>
                          <th className="text-center py-2 px-2">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-betano-border">
                        <tr className="hover:bg-betano-surface/50">
                          <td className="py-2 px-2 font-medium">{prediction.home.name}</td>
                          <td className="py-2 px-2 text-center text-green-400 font-bold">{Number(prediction.pgfl).toFixed(2)}</td>
                          <td className="py-2 px-2 text-center text-red-400 font-bold">{Number(prediction.pgfv).toFixed(2)}</td>
                          <td className="py-2 px-2 text-center">{prediction.over_1_5.toFixed(0)}%</td>
                          <td className={`py-2 px-2 text-center ${getCellColor(prediction.over_2_5, 62)}`}>{prediction.over_2_5.toFixed(0)}%</td>
                          <td className={`py-2 px-2 text-center ${getCellColor(prediction.over_3_5, 38)}`}>{prediction.over_3_5.toFixed(0)}%</td>
                          <td className={`py-2 px-2 text-center ${getWinner(prediction) === 'home' ? 'text-green-400 font-bold' : ''}`}>{prediction.win.toFixed(0)}%</td>
                          <td className={`py-2 px-2 text-center ${getWinner(prediction) === 'draw' ? 'text-yellow-400 font-bold' : ''}`}>{prediction.draw.toFixed(0)}%</td>
                          <td className={`py-2 px-2 text-center ${getWinner(prediction) === 'away' ? 'text-red-400 font-bold' : ''}`}>{prediction.loss.toFixed(0)}%</td>
                          <td className={`py-2 px-2 text-center ${getCellColor(prediction.btts, 55)}`}>{prediction.btts.toFixed(1)}%</td>
                          <td className="py-2 px-2 text-center text-blue-400 font-bold">{prediction.total_goals.toFixed(2)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </motion.div>
                )}

                {activeTab === 'corners' && (
                  <motion.div
                    key="corners"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="overflow-x-auto"
                  >
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-betano-border text-betano-muted">
                          <th className="text-left py-2 px-2">Local</th>
                          <th className="text-center py-2 px-2 text-green-400">CL</th>
                          <th className="text-center py-2 px-2 text-red-400">CV</th>
                          <th className="text-center py-2 px-2">+/-</th>
                          <th className="text-center py-2 px-2">9.5</th>
                          <th className="text-center py-2 px-2">10.5</th>
                          <th className="text-center py-2 px-2">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-betano-border">
                        <tr className="hover:bg-betano-surface/50">
                          <td className="py-2 px-2 font-medium">{prediction.home.name}</td>
                          <td className="py-2 px-2 text-center text-green-400 font-bold">{Number(prediction.corners_local).toFixed(2)}</td>
                          <td className="py-2 px-2 text-center text-red-400 font-bold">{Number(prediction.corners_away).toFixed(2)}</td>
                          <td className="py-2 px-2 text-center text-yellow-400 font-bold">{Number(prediction.total_corners).toFixed(2)}</td>
                          <td className="py-2 px-2 text-center">{prediction.tc_over_95.toFixed(0)}%</td>
                          <td className="py-2 px-2 text-center">{prediction.tc_over_105.toFixed(0)}%</td>
                          <td className="py-2 px-2 text-center">{Number(prediction.total_corners).toFixed(2)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </motion.div>
                )}

                {activeTab === 'stats' && (
                  <motion.div
                    key="stats"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="text-center py-4 text-betano-muted"
                  >
                    Estadísticas detalladas en desarrollo
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </motion.div>
      )}

      {!selectedMatch && matches.length > 0 && (
        <div className="card max-w-5xl mx-auto text-center py-8">
          <Calendar className="w-12 h-12 mx-auto text-betano-muted mb-3" />
          <p className="text-betano-muted text-sm">
            Selecciona un partido para generar el pronóstico
          </p>
        </div>
      )}
    </div>
  )
}
