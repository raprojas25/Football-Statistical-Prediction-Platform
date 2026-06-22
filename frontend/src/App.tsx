import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import HomePage from './pages/HomePage'
import MatchesPage from './pages/MatchesPage'
import NewMatches from './pages/NewMatches'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="partidos" element={<MatchesPage />} />
        <Route path="new-matches" element={<NewMatches />} />
      </Route>
    </Routes>
  )
}

export default App
