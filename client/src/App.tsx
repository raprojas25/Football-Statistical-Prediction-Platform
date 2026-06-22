import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import { useThemeStore } from './stores/theme.store';
import { useEffect } from 'react';
import Matches from './pages/Matches';
import { Odds } from './pages/Odds';
import { OddsPredictor } from './pages/OddsPredictor';
import { TeamStats } from './pages/TeamStats';
import { Maxon } from './components/test/Maxon';

function App() {
  const { isDarkMode } = useThemeStore();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Matches />} />
        <Route path="cuotas/" element={<Odds />} />
        <Route path="predictor/" element={<OddsPredictor />} />
        <Route path="equipos/" element={<TeamStats />} />
        <Route path="home" element={<Maxon />} />
      </Route>
    </Routes>
  );
}

export default App;
