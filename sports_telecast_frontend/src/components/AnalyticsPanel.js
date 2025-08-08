import React, { useState, useEffect } from 'react';

// PUBLIC_INTERFACE
const AnalyticsPanel = () => {
  // Only show statistics and upcoming matches, live chat removed
  const [activeTab, setActiveTab] = useState('stats');
  const [stats, setStats] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [statsError, setStatsError] = useState(null);

  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [loadingUpcoming, setLoadingUpcoming] = useState(true);
  const [upcomingError, setUpcomingError] = useState(null);

  // Static mock data for match statistics
  const mockStats = [
    { label: 'Possession', home: 58, away: 42, homeDisplay: '58%', awayDisplay: '42%' },
    { label: 'Shots', home: 14, away: 9, homeDisplay: '14', awayDisplay: '9' },
    { label: 'On Target', home: 7, away: 4, homeDisplay: '7', awayDisplay: '4' },
    { label: 'Corners', home: 8, away: 5, homeDisplay: '8', awayDisplay: '5' },
    { label: 'Fouls', home: 12, away: 8, homeDisplay: '12', awayDisplay: '8' },
    { label: 'Yellow Cards', home: 3, away: 1, homeDisplay: '3', awayDisplay: '1' }
  ];

  // Load stats with simulated delay
  useEffect(() => {
    setLoadingStats(true);
    setStatsError(null);
    setTimeout(() => {
      setStats(mockStats);
      setLoadingStats(false);
    }, 500); // Simulate network delay
  }, []);

  // Static mock data for upcoming matches
  const mockUpcomingMatches = [
    {
      match_id: 'upcoming_001',
      home_team: { name: 'Manchester United' },
      away_team: { name: 'Tottenham' },
      start_time: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
      competition: 'Premier League',
      sport_type: 'football'
    },
    {
      match_id: 'upcoming_002',
      home_team: { name: 'Bucks' },
      away_team: { name: 'Nets' },
      start_time: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(), // 4 hours from now
      competition: 'NBA',
      sport_type: 'basketball'
    },
    {
      match_id: 'upcoming_003',
      home_team: { name: 'Roger Federer' },
      away_team: { name: 'Andy Murray' },
      start_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
      competition: 'ATP Masters',
      sport_type: 'tennis'
    },
    {
      match_id: 'upcoming_004',
      home_team: { name: 'Dodgers' },
      away_team: { name: 'Giants' },
      start_time: new Date(Date.now() + 26 * 60 * 60 * 1000).toISOString(), // Tomorrow
      competition: 'MLB',
      sport_type: 'baseball'
    },
    {
      match_id: 'upcoming_005',
      home_team: { name: 'England' },
      away_team: { name: 'South Africa' },
      start_time: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(), // Day after tomorrow
      competition: 'Test Series',
      sport_type: 'cricket'
    }
  ];

  // Load upcoming matches with simulated delay
  useEffect(() => {
    setLoadingUpcoming(true);
    setUpcomingError(null);

    setTimeout(() => {
      setUpcomingMatches(mockUpcomingMatches.slice(0, 5));
      setLoadingUpcoming(false);
    }, 400); // Simulate network delay
  }, []);

  const StatBar = ({ stat, index }) => {
    const total = stat.home + stat.away;
    const homePercent = total > 0 ? (stat.home / total) * 100 : 50;
    const awayPercent = total > 0 ? (stat.away / total) * 100 : 50;

    return (
      <div
        className="space-y-2 scale-in"
        style={{ animationDelay: `${index * 0.1}s` }}
      >
        <div className="flex items-center justify-between">
          <div className="text-sm text-accent-red font-bold w-12 text-center">
            {stat.homeDisplay}
          </div>
          <div className="flex-1 mx-4">
            <div className="text-xs text-text-secondary text-center mb-2 font-medium">
              {stat.label}
            </div>
            <div className="bg-tertiary-bg rounded-full h-3 relative overflow-hidden">
              <div
                className="bg-gradient-to-r from-red-500 to-red-600 h-full rounded-full transition-all duration-1000 ease-out relative"
                style={{ width: `${homePercent}%` }}
              >
                <div className="absolute inset-0 bg-white/20 rounded-full opacity-0 hover:opacity-100 transition-opacity"></div>
              </div>
              <div
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full absolute right-0 top-0 transition-all duration-1000 ease-out"
                style={{ width: `${awayPercent}%` }}
              >
                <div className="absolute inset-0 bg-white/20 rounded-full opacity-0 hover:opacity-100 transition-opacity"></div>
              </div>
            </div>
          </div>
          <div className="text-sm text-accent-blue font-bold w-12 text-center">
            {stat.awayDisplay}
          </div>
        </div>
      </div>
    );
  };

  // Only statistics and upcoming, remove chat tab/logic
  const tabs = [
    { id: 'stats', label: 'Statistics', icon: '📊' },
    { id: 'matches', label: 'Upcoming', icon: '📅' }
  ];

  // Only render the two tabs
  return (
    <div className="space-y-4">
      {/* Tab Navigation */}
      <div className="bg-secondary-bg rounded-xl p-1">
        <div className="flex space-x-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-gradient-primary text-white shadow-lg'
                  : 'text-text-secondary hover:text-text-primary hover:bg-hover-bg'
              }`}
            >
              <span>{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Statistics Tab */}
      {activeTab === 'stats' && (
        <div className="bg-secondary-bg rounded-xl p-6 hover-lift">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-text-primary font-primary tracking-tight" style={{ letterSpacing: 0.1 }}>Match Statistics</h3>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-accent-green rounded-full bounce-subtle"></div>
              <span className="text-xs text-text-secondary">Live Updates</span>
            </div>
          </div>
          {loadingStats ? (
            <div className="text-text-muted text-center py-4">Loading stats...</div>
          ) : statsError ? (
            <div className="p-2 bg-red-900/40 rounded text-red-300 text-center mb-2">{statsError}</div>
          ) : (
            <div className="space-y-4">
              {stats.map((stat, index) => (
                <StatBar key={stat.label} stat={stat} index={index} />
              ))}
            </div>
          )}
          {/* Team Legend */}
          <div className="flex items-center justify-center space-x-6 mt-6 pt-4 border-t border-border-color">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gradient-to-r from-red-500 to-red-600 rounded-lg"></div>
              <span className="text-sm text-text-secondary">Home</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg"></div>
              <span className="text-sm text-text-secondary">Away</span>
            </div>
          </div>
        </div>
      )}

      {/* Upcoming Matches Tab */}
      {activeTab === 'matches' && (
        <div className="bg-secondary-bg rounded-xl p-6 hover-lift">
          <h3 className="text-lg font-bold mb-4 text-text-primary">Upcoming Matches</h3>
          {loadingUpcoming ? (
            <div className="text-center text-text-muted py-4">Loading upcoming matches...</div>
          ) : upcomingError ? (
            <div className="p-2 bg-red-900/40 rounded text-red-300 text-center mb-2">{upcomingError}</div>
          ) : (
            <div className="space-y-3">
              {upcomingMatches.map((match, index) => (
                <div
                  key={match.match_id || index}
                  className="group p-4 bg-tertiary-bg rounded-xl hover:bg-hover-bg transition-all duration-200 cursor-pointer hover-scale slide-in-left"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="text-sm font-medium text-text-primary group-hover:text-accent-blue transition-colors">
                        {(match.home_team?.name ?? '') + " vs " + (match.away_team?.name ?? '')}
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs text-text-secondary">{match.start_time ? new Date(match.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'TBD'}</span>
                        <span className="text-xs text-text-muted">•</span>
                        <span className="text-xs text-text-secondary">Upcoming</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="bg-gradient-primary text-white px-2 py-1 rounded-lg text-xs font-bold">
                        {match.competition || match.sport_type || ''}
                      </div>
                      <svg className="w-4 h-4 text-text-muted group-hover:text-accent-blue transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <button className="w-full mt-4 p-3 border-2 border-dashed border-border-color rounded-xl text-text-secondary hover:border-accent-blue hover:text-accent-blue transition-all duration-200 text-center">
            <span className="text-sm font-medium">View All Upcoming Matches</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default AnalyticsPanel;
