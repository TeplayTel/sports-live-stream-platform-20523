import React, { useState, useEffect } from 'react';

// PUBLIC_INTERFACE
const AnalyticsPanel = () => {
  const [activeTab, setActiveTab] = useState('stats');
  const [newMessage, setNewMessage] = useState('');

  const [stats, setStats] = useState([
    { label: 'Possession', home: 58, away: 42, homeDisplay: '58%', awayDisplay: '42%' },
    { label: 'Shots', home: 12, away: 8, homeDisplay: '12', awayDisplay: '8' },
    { label: 'On Target', home: 6, away: 3, homeDisplay: '6', awayDisplay: '3' },
    { label: 'Corners', home: 7, away: 4, homeDisplay: '7', awayDisplay: '4' },
    { label: 'Fouls', home: 11, away: 9, homeDisplay: '11', awayDisplay: '9' },
    { label: 'Yellow Cards', home: 2, away: 1, homeDisplay: '2', awayDisplay: '1' }
  ]);

  const upcomingMatches = [
    { 
      time: '15:30', 
      teams: 'Liverpool vs Man City', 
      competition: 'PL',
      status: 'upcoming',
      viewers: '12.5K expected'
    },
    { 
      time: '18:00', 
      teams: 'Barcelona vs Real Madrid', 
      competition: 'La Liga',
      status: 'upcoming',
      viewers: '25K expected'
    },
    { 
      time: '20:45', 
      teams: 'PSG vs Bayern', 
      competition: 'UCL',
      status: 'upcoming',
      viewers: '30K expected'
    }
  ];

  const [chatMessages, setChatMessages] = useState([
    { id: 1, user: 'SportsF4n', message: 'Great goal by Arsenal! 🔥', time: '2m', avatar: '🔥' },
    { id: 2, user: 'FootyExpert', message: 'Chelsea needs to step up their game', time: '3m', avatar: '⚽' },
    { id: 3, user: 'GoalMachine', message: 'This match is incredible!', time: '5m', avatar: '🎯' },
    { id: 4, user: 'PremierFan', message: 'Arsenal looking strong today', time: '7m', avatar: '🏆' }
  ]);

  // Simulate real-time stats updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prevStats => 
        prevStats.map(stat => {
          if (Math.random() > 0.8) { // 20% chance to update each stat
            const homeChange = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
            const awayChange = Math.floor(Math.random() * 3) - 1;
            const newHome = Math.max(0, stat.home + homeChange);
            const newAway = Math.max(0, stat.away + awayChange);
            
            return {
              ...stat,
              home: newHome,
              away: newAway,
              homeDisplay: stat.label.includes('%') ? `${newHome}%` : `${newHome}`,
              awayDisplay: stat.label.includes('%') ? `${newAway}%` : `${newAway}`
            };
          }
          return stat;
        })
      );
    }, 10000);

    return () => clearInterval(interval);
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
          <div className="space-y-4">
            {stats.map((stat, index) => (
              <StatBar key={stat.label} stat={stat} index={index} />
            ))}
          </div>
          
          {/* Team Legend */}
          <div className="flex items-center justify-center space-x-6 mt-6 pt-4 border-t border-border-color">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gradient-to-r from-red-500 to-red-600 rounded-full"></div>
              <span className="text-sm text-text-secondary">Arsenal</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"></div>
              <span className="text-sm text-text-secondary">Chelsea</span>
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
                <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center text-sm">
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
          <div className="space-y-3">
            {upcomingMatches.map((match, index) => (
              <div 
                key={index} 
                className="group p-4 bg-tertiary-bg rounded-xl hover:bg-hover-bg transition-all duration-200 cursor-pointer hover-scale slide-in-left"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="text-sm font-medium text-text-primary group-hover:text-accent-blue transition-colors">
                      {match.teams}
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs text-text-secondary">{match.time}</span>
                      <span className="text-xs text-text-muted">•</span>
                      <span className="text-xs text-text-secondary">{match.viewers}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="bg-gradient-primary text-white px-2 py-1 rounded-full text-xs font-bold">
                      {match.competition}
                    </div>
                    <svg className="w-4 h-4 text-text-muted group-hover:text-accent-blue transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <button className="w-full mt-4 p-3 border-2 border-dashed border-border-color rounded-xl text-text-secondary hover:border-accent-blue hover:text-accent-blue transition-all duration-200 text-center">
            <span className="text-sm font-medium">View All Upcoming Matches</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default AnalyticsPanel;
