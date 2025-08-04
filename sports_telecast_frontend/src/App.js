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
  const [theme, setTheme] = useState('dark');
  
  const [currentMatch] = useState({
    homeTeam: 'Arsenal',
    awayTeam: 'Chelsea', 
    homeScore: 2,
    awayScore: 1,
    status: 'LIVE',
    time: "67'",
    competition: 'Premier League'
  });

  // Simulate real-time viewer count updates with more realistic fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      setViewerCount(prev => {
        const change = Math.floor(Math.random() * 200) - 100; // -100 to +100
        const newCount = Math.max(1000, prev + change); // Minimum 1000 viewers
        return newCount;
      });
    }, 3000); // Update every 3 seconds for more dynamic feel
    
    return () => clearInterval(interval);
  }, []);

  // Simulate app loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  // Handle sport change with smooth transition
  const handleSportChange = (sport) => {
    setSelectedSport(sport);
    // Add analytics tracking here if needed
    console.log(`Sport changed to: ${sport}`);
  };

  // Loading Screen Component
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
      <Header 
        viewerCount={viewerCount}
      />
      
      {/* Main Content */}
      <div className="pt-16 relative z-10">
        {/* Sports Filter */}
        <SportsFilter 
          selectedSport={selectedSport}
          onSportChange={handleSportChange}
        />
        
        {/* Main Layout Grid */}
        <div className="max-w-7xl mx-auto p-4 sm:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Main Video Area */}
            <div className="lg:col-span-8 space-y-6">
              <div className="slide-in-left">
                <VideoPlayer currentMatch={currentMatch} />
              </div>
              <div className="slide-in-left" style={{ animationDelay: '0.1s' }}>
                <MatchInfoSection currentMatch={currentMatch} />
              </div>
              <div className="slide-in-left" style={{ animationDelay: '0.2s' }}>
                <MatchSummary currentMatch={currentMatch} />
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
