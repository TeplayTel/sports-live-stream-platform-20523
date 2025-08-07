import React, { useState, useEffect } from 'react';

// PUBLIC_INTERFACE
const AnalyticsPanel = () => {
  const [activeTab, setActiveTab] = useState('stats');
  const [newMessage, setNewMessage] = useState('');
  const [stats, setStats] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [statsError, setStatsError] = useState(null);

  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [loadingUpcoming, setLoadingUpcoming] = useState(true);
  const [upcomingError, setUpcomingError] = useState(null);

  // Chat/demo only
  const [chatMessages, setChatMessages] = useState([
    { id: 1, user: 'SportsF4n', message: 'Great goal by Arsenal! 🔥', time: '2m', avatar: '🔥' },
    { id: 2, user: 'FootyExpert', message: 'Chelsea needs to step up their game', time: '3m', avatar: '⚽' },
    { id: 3, user: 'GoalMachine', message: 'This match is incredible!', time: '5m', avatar: '🎯' },
    { id: 4, user: 'PremierFan', message: 'Arsenal looking strong today', time: '7m', avatar: '🏆' }
  ]);

  // Fetch stats from the backend (simulate: pick a live match and display some stats)
  useEffect(() => {
    setLoadingStats(true);
    setStatsError(null);

    const fetchStats = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
        // Try to get one live match and display its statistics if available
        let res = await fetch(`${apiUrl}/matches/live`);
        let data = await res.json();
        if (data.matches && data.matches.length > 0 && data.matches[0].statistics) {
          let statObj = data.matches[0].statistics;
          // Normalize: create display array from statistics object if available
          const statLabels = [
            { key: 'possession', label: 'Possession', percent: true },
            { key: 'shots', label: 'Shots', percent: false },
            { key: 'on_target', label: 'On Target', percent: false },
            { key: 'corners', label: 'Corners', percent: false },
            { key: 'fouls', label: 'Fouls', percent: false },
            { key: 'yellow_cards', label: 'Yellow Cards', percent: false },
          ];
          const arr = statLabels.map(s => ({
            label: s.label,
            home: statObj?.home?.[s.key] ?? 0,
            away: statObj?.away?.[s.key] ?? 0,
            homeDisplay: s.percent ? `${statObj?.home?.[s.key] ?? 0}%` : `${statObj?.home?.[s.key] ?? 0}`,
            awayDisplay: s.percent ? `${statObj?.away?.[s.key] ?? 0}%` : `${statObj?.away?.[s.key] ?? 0}`
          }));
          setStats(arr);
        } else {
          // Fallback demo
          setStats([
            { label: 'Possession', home: 58, away: 42, homeDisplay: '58%', awayDisplay: '42%' },
            { label: 'Shots', home: 12, away: 8, homeDisplay: '12', awayDisplay: '8' },
            { label: 'On Target', home: 6, away: 3, homeDisplay: '6', awayDisplay: '3' },
            { label: 'Corners', home: 7, away: 4, homeDisplay: '7', awayDisplay: '4' },
            { label: 'Fouls', home: 11, away: 9, homeDisplay: '11', awayDisplay: '9' },
            { label: 'Yellow Cards', home: 2, away: 1, homeDisplay: '2', awayDisplay: '1' }
          ]);
        }
        setLoadingStats(false);
      } catch (err) {
        setStatsError('Failed to load match statistics.');
        setStats([]);
        setLoadingStats(false);
      }
    };
    fetchStats();
  }, []);

  // Fetch upcoming matches (schedules)
  useEffect(() => {
    setLoadingUpcoming(true);
    setUpcomingError(null);
    const fetchUpcoming = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
        let url = `${apiUrl}/matches/schedule/upcoming`;
        let res = await fetch(url);
        let data = await res.json();
        if (data.matches && Array.isArray(data.matches)) {
          setUpcomingMatches(data.matches.slice(0, 5)); // show only top 5 for panel
        } else if (data.daily_schedules && Array.isArray(data.daily_schedules)) {
          // API may return weekly block
          const upcoming = [];
          for (const ds of data.daily_schedules) {
            if (Array.isArray(ds.matches)) {
              upcoming.push(...ds.matches.map((m) => m));
            }
          }
          setUpcomingMatches(upcoming.slice(0, 5));
        } else {
          setUpcomingMatches([]);
        }
        setLoadingUpcoming(false);
      } catch (err) {
        setUpcomingError('Failed to load upcoming matches.');
        setUpcomingMatches([]);
        setLoadingUpcoming(false);
      }
    };
    fetchUpcoming();
  }, []);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: Date.now(),
        user: 'You',
        message: newMessage,
        time: 'now',
        avatar: '👤'
      };
      setChatMessages(prev => [message, ...prev]);
      setNewMessage('');
    }
  };

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

  const tabs = [
    { id: 'stats', label: 'Statistics', icon: '📊' },
    { id: 'chat', label: 'Live Chat', icon: '💬' },
    { id: 'matches', label: 'Upcoming', icon: '📅' }
  ];

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
            <h3 className="text-lg font-bold text-text-primary">Match Statistics</h3>
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

      {/* Live Chat Tab */}
      {activeTab === 'chat' && (
        <div className="bg-secondary-bg rounded-xl overflow-hidden hover-lift">
          <div className="p-4 border-b border-border-color">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-text-primary">Live Chat</h3>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-accent-green rounded-full bounce-subtle"></div>
                <span className="text-xs text-text-secondary">{chatMessages.length} messages</span>
              </div>
            </div>
          </div>
          
          <div className="h-80 overflow-y-auto p-4 space-y-4">
            {chatMessages.map((msg, index) => (
              <div key={msg.id} className="flex items-start space-x-3 slide-in-right" style={{ animationDelay: `${index * 0.05}s` }}>
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center text-sm">
                  {msg.avatar}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-sm text-accent-blue font-medium">{msg.user}</span>
                    <span className="text-xs text-text-muted">{msg.time}</span>
                  </div>
                  <p className="text-sm text-text-primary bg-tertiary-bg rounded-lg px-3 py-2">
                    {msg.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-4 border-t border-border-color">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type a message..."
                className="flex-1 bg-tertiary-bg border border-border-color rounded-lg px-4 py-2 text-sm text-text-primary placeholder-text-muted focus:border-accent-blue focus:outline-none transition-colors"
              />
              <button 
                onClick={handleSendMessage}
                className="bg-gradient-primary hover:shadow-lg text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover-scale"
              >
                Send
              </button>
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
                        <span className="text-xs text-text-secondary">{match.start_time ? new Date(match.start_time).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}) : 'TBD'}</span>
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
