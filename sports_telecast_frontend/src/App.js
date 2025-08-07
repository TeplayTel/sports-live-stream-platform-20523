import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import SportsFilter from './components/SportsFilter';
import VideoPlayer from './components/VideoPlayer';
import MatchInfoSection from './components/MatchInfoSection';
import AnalyticsPanel from './components/AnalyticsPanel';
import MatchSummary from './components/MatchSummary';
import SportsCards from './components/SportsCards';
import './App.css';

// PUBLIC_INTERFACE
function App() {
  const [selectedSport, setSelectedSport] = useState('All');
  const [viewerCount, setViewerCount] = useState(12847);
  const [isLoading, setIsLoading] = useState(true);
  const [theme] = useState('dark');
  const [currentMatch, setCurrentMatch] = useState(null);
  const [matchLoading, setMatchLoading] = useState(false);
  const [matchError, setMatchError] = useState(null);

  // Fetch current LIVE match, fallback to most recent if none
  useEffect(() => {
    setMatchLoading(true);
    setMatchError(null);

    const fetchCurrentMatch = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
        // Try fetching live matches and pick first, fallback to latest if none
        let res = await fetch(`${apiUrl}/matches/live`);
        let data = await res.json();
        if (data.matches && data.matches.length > 0) {
          const liveMatch = data.matches[0];
          setCurrentMatch({
            matchId: liveMatch.match_id,
            homeTeam: liveMatch.home_team.name,
            awayTeam: liveMatch.away_team.name,
            homeScore: liveMatch.score?.home_score ?? 0,
            awayScore: liveMatch.score?.away_score ?? 0,
            status: (liveMatch.status || '').toUpperCase(),
            time: liveMatch.start_time ? new Date(liveMatch.start_time).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}) : '',
            competition: liveMatch.competition || liveMatch.sport_type || '',
            streamUrl: liveMatch.stream_url,
          });
        } else {
          // Fallback to latest match if no live
          let allRes = await fetch(`${apiUrl}/matches/?page=1&page_size=1`);
          let allData = await allRes.json();
          if (allData.matches && allData.matches.length > 0) {
            const match = allData.matches[0];
            setCurrentMatch({
              matchId: match.match_id,
              homeTeam: match.home_team.name,
              awayTeam: match.away_team.name,
              homeScore: match.score?.home_score ?? 0,
              awayScore: match.score?.away_score ?? 0,
              status: (match.status || '').toUpperCase(),
              time: match.start_time ? new Date(match.start_time).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}) : '',
              competition: match.competition || match.sport_type || '',
              streamUrl: match.stream_url,
            });
          }
        }
        setMatchLoading(false);
      } catch (err) {
        setMatchError('Failed to load current match');
        setMatchLoading(false);
      }
    };

    fetchCurrentMatch();
  }, []);

  // Simulate real-time viewer count updates
  useEffect(() => {
    const interval = setInterval(() => {
      setViewerCount(prev => {
        const change = Math.floor(Math.random() * 200) - 100; // -100 to +100
        const newCount = Math.max(1000, prev + change);
        return newCount;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // App loading screen (just for show, transition to loaded once match is ready)
  useEffect(() => {
    if (matchLoading) {
      setIsLoading(true);
    } else {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 800); // Fast fade after match data
      return () => clearTimeout(timer);
    }
  }, [matchLoading]);

  const handleSportChange = (sport) => {
    setSelectedSport(sport);
    // Add analytics tracking here if needed
    console.log(`Sport changed to: ${sport}`);
  };

  const LoadingScreen = () => (
    <div className="min-h-screen bg-primary-bg flex items-center justify-center">
      <div className="text-center space-y-6">
        <div className="relative">
          <div className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto">
            <span className="text-3xl">⚡</span>
          </div>
          <div className="absolute inset-0 bg-gradient-primary rounded-2xl blur-lg opacity-50 animate-pulse"></div>
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            SportsStream
          </h2>
          <p className="text-text-secondary">Loading your premium sports experience...</p>
        </div>
        <div className="flex space-x-1 justify-center">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-accent-red rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.1}s` }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className={`min-h-screen bg-primary-bg text-text-primary font-primary ${theme}`}>
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-accent-red/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent-blue/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent-purple/3 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <Header viewerCount={viewerCount} />
      
      {/* Main Content */}
      <div className="pt-16 relative z-10">
        {/* Sports Filter */}
        <SportsFilter selectedSport={selectedSport} onSportChange={handleSportChange} />
        
        {/* Match Info Section */}
        <div className="max-w-7xl mx-auto p-4 sm:p-6 pt-0">
          {matchLoading && <div className="py-12 text-lg text-center text-text-secondary">Loading match info...</div>}
          {matchError && <div className="p-4 bg-red-900/50 rounded text-red-300 mb-4">{matchError}</div>}
          {currentMatch && <MatchInfoSection currentMatch={currentMatch} />}
        </div>
        
        {/* Main Layout Grid */}
        <div className="max-w-7xl mx-auto p-4 sm:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Main Video Area */}
            <div className="lg:col-span-8 space-y-6">
              <div className="slide-in-left">
                {/* Pass currentMatch to VideoPlayer only when loaded */}
                {currentMatch && <VideoPlayer currentMatch={currentMatch} />}
              </div>
              <div className="slide-in-left" style={{ animationDelay: '0.1s' }}>
                {currentMatch && <MatchSummary currentMatch={currentMatch} />}
              </div>
            </div>
            
            {/* Right Sidebar */}
            <div className="lg:col-span-4">
              <div className="slide-in-right">
                <AnalyticsPanel />
              </div>
            </div>
          </div>
        </div>
        
        {/* Sports Cards Section */}
        <div className="max-w-7xl mx-auto p-4 sm:p-6 pt-8">
          <div className="slide-in-left" style={{ animationDelay: '0.4s' }}>
            <SportsCards 
              selectedSport={selectedSport} 
              onSportChange={handleSportChange}
            />
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 bg-secondary-bg border-t border-border-color">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="col-span-1 md:col-span-2">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-lg">⚡</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                      SportsStream
                    </h3>
                    <p className="text-sm text-text-muted">Premium Sports Experience</p>
                  </div>
                </div>
                <p className="text-text-secondary text-sm leading-relaxed">
                  Experience sports like never before with premium streaming, real-time analytics, 
                  and interactive features that bring you closer to the action.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-text-primary mb-4">Sports</h4>
                <ul className="space-y-2 text-sm text-text-secondary">
                  <li><button className="hover:text-accent-blue transition-colors text-left">Football</button></li>
                  <li><button className="hover:text-accent-blue transition-colors text-left">Basketball</button></li>
                  <li><button className="hover:text-accent-blue transition-colors text-left">Tennis</button></li>
                  <li><button className="hover:text-accent-blue transition-colors text-left">Baseball</button></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-text-primary mb-4">Features</h4>
                <ul className="space-y-2 text-sm text-text-secondary">
                  <li><button className="hover:text-accent-blue transition-colors text-left">Live Streaming</button></li>
                  <li><button className="hover:text-accent-blue transition-colors text-left">Real-time Stats</button></li>
                  <li><button className="hover:text-accent-blue transition-colors text-left">Match Analysis</button></li>
                  <li><button className="hover:text-accent-blue transition-colors text-left">Highlights</button></li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-border-color mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
              <p className="text-text-muted text-sm">
                © 2024 SportsStream. All rights reserved.
              </p>
              <div className="flex items-center space-x-6 mt-4 sm:mt-0">
                <button className="text-text-muted hover:text-accent-blue transition-colors">Privacy</button>
                <button className="text-text-muted hover:text-accent-blue transition-colors">Terms</button>
                <button className="text-text-muted hover:text-accent-blue transition-colors">Support</button>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
