import React from 'react';

// PUBLIC_INTERFACE
const AnalyticsPanel = () => {
  const stats = [
    { label: 'Possession', home: '58%', away: '42%' },
    { label: 'Shots', home: '12', away: '8' },
    { label: 'On Target', home: '6', away: '3' },
    { label: 'Corners', home: '7', away: '4' },
    { label: 'Fouls', home: '11', away: '9' },
    { label: 'Yellow Cards', home: '2', away: '1' }
  ];

  const upcomingMatches = [
    { time: '15:30', teams: 'Liverpool vs Man City', competition: 'PL' },
    { time: '18:00', teams: 'Barcelona vs Real Madrid', competition: 'La Liga' },
    { time: '20:45', teams: 'PSG vs Bayern', competition: 'UCL' }
  ];

  const chatMessages = [
    { user: 'SportsF4n', message: 'Great goal by Arsenal! 🔥', time: '2m' },
    { user: 'FootyExpert', message: 'Chelsea needs to step up their game', time: '3m' },
    { user: 'GoalMachine', message: 'This match is incredible!', time: '5m' },
    { user: 'PremierFan', message: 'Arsenal looking strong today', time: '7m' }
  ];

  return (
    <div className="space-y-6">
      {/* Match Statistics */}
      <div className="bg-secondary-bg rounded-md p-4">
        <h3 className="text-lg font-bold mb-4 text-text-primary">Match Statistics</h3>
        <div className="space-y-3">
          {stats.map((stat, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="text-sm text-accent-blue font-medium w-16 text-right">
                {stat.home}
              </div>
              <div className="flex-1 mx-4">
                <div className="text-xs text-text-secondary text-center mb-1">
                  {stat.label}
                </div>
                <div className="bg-tertiary-bg rounded-full h-2 relative">
                  <div 
                    className="bg-accent-red h-2 rounded-full"
                    style={{ width: stat.home }}
                  ></div>
                </div>
              </div>
              <div className="text-sm text-accent-blue font-medium w-16">
                {stat.away}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Live Chat */}
      <div className="bg-secondary-bg rounded-md p-4">
        <h3 className="text-lg font-bold mb-4 text-text-primary">Live Chat</h3>
        <div className="space-y-3 h-64 overflow-y-auto">
          {chatMessages.map((msg, index) => (
            <div key={index} className="flex items-start space-x-2">
              <div className="w-6 h-6 bg-accent-blue rounded-full flex items-center justify-center text-xs font-bold">
                {msg.user[0]}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-accent-blue font-medium">
                    {msg.user}
                  </span>
                  <span className="text-xs text-text-muted">{msg.time}</span>
                </div>
                <p className="text-sm text-text-primary">{msg.message}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex">
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 bg-tertiary-bg border border-border-color rounded-l-md px-3 py-2 text-sm text-text-primary placeholder-text-muted focus:border-accent-blue focus:outline-none"
          />
          <button className="bg-accent-red hover:bg-red-600 text-white px-4 py-2 rounded-r-md text-sm font-medium transition-standard">
            Send
          </button>
        </div>
      </div>

      {/* Upcoming Matches */}
      <div className="bg-secondary-bg rounded-md p-4">
        <h3 className="text-lg font-bold mb-4 text-text-primary">Upcoming Matches</h3>
        <div className="space-y-3">
          {upcomingMatches.map((match, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-tertiary-bg rounded-md hover:bg-hover-bg transition-standard cursor-pointer">
              <div>
                <div className="text-sm font-medium text-text-primary">
                  {match.teams}
                </div>
                <div className="text-xs text-text-secondary">{match.time}</div>
              </div>
              <div className="bg-accent-blue text-white px-2 py-1 rounded text-xs font-bold">
                {match.competition}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPanel;
