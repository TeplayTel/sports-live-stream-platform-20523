import React from 'react';

// PUBLIC_INTERFACE
const MatchSummary = ({ currentMatch }) => {
  const events = [
    { time: "12'", type: 'goal', team: 'home', player: 'Bukayo Saka', description: 'Goal' },
    { time: "28'", type: 'card', team: 'away', player: 'N. Kante', description: 'Yellow Card' },
    { time: "45'", type: 'goal', team: 'away', player: 'Raheem Sterling', description: 'Goal' },
    { time: "56'", type: 'goal', team: 'home', player: 'Gabriel Jesus', description: 'Goal' },
    { time: "63'", type: 'substitution', team: 'home', player: 'Eddie Nketiah', description: 'Substitution' }
  ];

  const lineup = {
    home: {
      formation: '4-3-3',
      players: [
        'Ramsdale', 'White', 'Saliba', 'Gabriel', 'Zinchenko',
        'Partey', 'Odegaard', 'Xhaka', 'Saka', 'Jesus', 'Martinelli'
      ]
    },
    away: {
      formation: '4-2-3-1',
      players: [
        'Kepa', 'James', 'Silva', 'Koulibaly', 'Chilwell',
        'Kante', 'Jorginho', 'Mount', 'Sterling', 'Havertz', 'Aubameyang'
      ]
    }
  };

  const getEventIcon = (type) => {
    switch (type) {
      case 'goal': return '⚽';
      case 'card': return '🟨';
      case 'substitution': return '🔄';
      default: return '•';
    }
  };

  return (
    <div className="mt-6 bg-secondary-bg rounded-md p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Match Timeline */}
        <div>
          <h3 className="text-xl font-bold mb-4 text-text-primary">Match Events</h3>
          <div className="space-y-3">
            {events.map((event, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-tertiary-bg rounded-md">
                <div className="text-sm font-mono text-text-secondary w-12">
                  {event.time}
                </div>
                <div className="text-lg">{getEventIcon(event.type)}</div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-text-primary">
                    {event.player}
                  </div>
                  <div className="text-xs text-text-secondary">
                    {event.description}
                  </div>
                </div>
                <div className={`w-3 h-3 rounded-full ${
                  event.team === 'home' ? 'bg-accent-red' : 'bg-accent-blue'
                }`}></div>
              </div>
            ))}
          </div>
        </div>

        {/* Team Lineups */}
        <div>
          <h3 className="text-xl font-bold mb-4 text-text-primary">Lineups</h3>
          <div className="space-y-6">
            {/* Home Team */}
            <div>
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-6 h-6 bg-accent-red rounded-full flex items-center justify-center text-xs font-bold">
                  A
                </div>
                <span className="font-medium text-text-primary">{currentMatch.homeTeam}</span>
                <span className="text-sm text-text-secondary">({lineup.home.formation})</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {lineup.home.players.map((player, index) => (
                  <div key={index} className="text-xs text-text-secondary bg-tertiary-bg rounded px-2 py-1">
                    {player}
                  </div>
                ))}
              </div>
            </div>

            {/* Away Team */}
            <div>
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-6 h-6 bg-accent-blue rounded-full flex items-center justify-center text-xs font-bold">
                  C
                </div>
                <span className="font-medium text-text-primary">{currentMatch.awayTeam}</span>
                <span className="text-sm text-text-secondary">({lineup.away.formation})</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {lineup.away.players.map((player, index) => (
                  <div key={index} className="text-xs text-text-secondary bg-tertiary-bg rounded px-2 py-1">
                    {player}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchSummary;
