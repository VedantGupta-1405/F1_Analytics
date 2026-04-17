import React, { useState, useEffect, createContext } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Navbar } from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Tracks from './pages/Tracks';
import Leaderboard from './pages/Leaderboard';
import TeamPerformance from './pages/TeamPerformance';
import DriverProfile from './pages/DriverProfile';
import RaceView from './pages/RaceView';
import RacesList from './pages/Races';
import News from './pages/News';
import PixelLoader from './components/ui/PixelLoader';

export const SeasonContext = createContext();

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

function App() {
  const [season, setSeason] = useState(2024);
  const [seasonData, setSeasonData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios.get(`http://localhost:8000/api/season/${season}`)
      .then(res => {
        setSeasonData(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load season data", err);
        setLoading(false);
      });
  }, [season]);

  return (
    <SeasonContext.Provider value={{ season, setSeason, seasonData, loading }}>
      <Router>
        <ScrollToTop />
        
        <div className="fixed inset-0 bg-[#0d0d0d] bg-pixel-grid -z-20"></div>
        <div className="fixed inset-0 scanlines -z-10 opacity-70 pointer-events-none"></div>

        <div className="min-h-screen flex flex-col page-transition-enter-active relative z-10">
          <Navbar />
          <main className="flex-1 w-full relative pt-24 pb-32">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/races" element={<RacesList />} />
              <Route path="/news" element={<News />} />
              <Route path="/tracks" element={<Tracks />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/teams" element={<TeamPerformance />} />
              <Route path="/driver/:driverId" element={<DriverProfile />} />
              <Route path="/race/:raceId" element={<RaceView />} />
            </Routes>
          </main>
        </div>
      </Router>
    </SeasonContext.Provider>
  );
}

export default App;
