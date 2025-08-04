import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import SportsFilter from './components/SportsFilter';
import VideoPlayer from './components/VideoPlayer';
import AnalyticsPanel from './components/AnalyticsPanel';
import MatchSummary from './components/MatchSummary';
import SportsCards from './components/SportsCards';
import './App.css';

// PUBLIC_INTERFACE
function App() {
  const [selectedSport, setSelectedSport] = useState('All');
  const [viewerCount, setViewerCount] = useState(12847);
  const [currentMatch] = useState({
    homeTeam: 'Arsenal',
    awayTeam: 'Chelsea', 
    homeScore: 2,
    awayScore: 1,
    status: 'LIVE',
    time: "67'",
    competition: 'Premier League'
  });

  // Simulate real-time viewer count updates
  useEffect(() => {
    const interval = setInterval(() => {
      setViewerCount(prev => prev + Math.floor(Math.random() * 100) - 50);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-primary-bg text-text-primary font-primary">
      {/* Header */}
      <Header 
        currentMatch={currentMatch}
        viewerCount={viewerCount}
      />
      
      {/* Main Content */}
      <div className="pt-16"> {/* Account for fixed header */}
        {/* Sports Filter */}
        <SportsFilter 
          selectedSport={selectedSport}
          onSportChange={setSelectedSport}
        />
        
        {/* Main Layout Grid */}
        <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Video Area */}
          <div className="lg:col-span-8">
            <VideoPlayer currentMatch={currentMatch} />
            <MatchSummary currentMatch={currentMatch} />
          </div>
          
          {/* Right Sidebar */}
          <div className="lg:col-span-4">
            <AnalyticsPanel />
          </div>
        </div>
        
        {/* Sports Cards Section */}
        <div className="max-w-7xl mx-auto p-6">
          <SportsCards selectedSport={selectedSport} />
        </div>
      </div>
    </div>
  );
}

export default App;
