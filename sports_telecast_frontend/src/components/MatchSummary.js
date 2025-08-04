import React, { useState } from 'react';

// PUBLIC_INTERFACE
const MatchSummary = ({ currentMatch }) => {
  const [activeSection, setActiveSection] = useState('events');

  const events = [
    { 
      time: "12'", 
      type: 'goal', 
      team: 'home', 
      player: 'Bukayo Saka', 
      description: 'Goal',
      details: 'Right footed shot from the centre of the box to the bottom left corner.',
      impact: 'high'
    },
    { 
      time: "28'", 
      type: 'card', 
      team: 'away', 
      player: 'N. Kante', 
      description: 'Yellow Card',
      details: 'Foul on Gabriel Jesus',
      impact: 'medium'
    },
    { 
      time: "45'", 
      type: 'goal', 
      team: 'away', 
      player: 'Raheem Sterling', 
      description: 'Goal',
      details: 'Left footed shot from outside the box to the top right corner.',
      impact: 'high'
    },
    { 
      time: "56'", 
      type: 'goal', 
      team: 'home', 
      player: 'Gabriel Jesus', 
      description: 'Goal',
      details: 'Header from very close range to the bottom right corner.',
      impact: 'high'
    },
    { 
      time: "63'", 
      type: 'substitution', 
      team: 'home', 
      player: 'Eddie Nketiah', 
      description: 'Substitution',
      details: 'In for Gabriel Jesus',
      impact: 'low'
    }
  ];

  const lineup = {
    home: {
      formation: '4-3-3',
      players: [
        { name: 'Ramsdale', position: 'GK', number: '1' },
        { name: 'White', position: 'RB', number: '4' },
        { name: 'Saliba', position: 'CB', number: '12' },
        { name: 'Gabriel', position: 'CB', number: '6' },
        { name: 'Zinchenko', position: 'LB', number: '35' },
        { name: 'Partey', position: 'CM', number: '5' },
        { name: 'Odegaard', position: 'CM', number: '8' },
        { name: 'Xhaka', position: 'CM', number: '34' },
        { name: 'Saka', position: 'RW', number: '7' },
        { name: 'Jesus', position: 'ST', number: '9' },
        { name: 'Martinelli', position: 'LW', number: '11' }
      ]
    },
    away: {
      formation: '4-2-3-1',
      players: [
        { name: 'Kepa', position: 'GK', number: '1' },
        { name: 'James', position: 'RB', number: '24' },
        { name: 'Silva', position: 'CB', number: '6' },
        { name: 'Koulibaly', position: 'CB', number: '26' },
        { name: 'Chilwell', position: 'LB', number: '21' },
        { name: 'Kante', position: 'CDM', number: '7' },
        { name: 'Jorginho', position: 'CDM', number: '5' },
        { name: 'Mount', position: 'CAM', number: '19' },
        { name: 'Sterling', position: 'RW', number: '17' },
        { name: 'Havertz', position: 'LW', number: '29' },
        { name: 'Aubameyang', position: 'ST', number: '9' }
      ]
    }
  };

  const getEventIcon = (type) => {
    switch (type) {
      case 'goal': return '⚽';
      case 'card': return '🟨';
      case 'red-card': return '🟥';
      case 'substitution': return '🔄';
      case 'corner': return '📐';
      case 'offside': return '🚩';
      default: return '•';
    }
  };

  const getEventColor = (type, impact) => {
    if (impact === 'high') return 'from-red-500 to-orange-500';
    if (impact === 'medium') return 'from-yellow-500 to-orange-500';
    return 'from-blue-500 to-purple-500';
  };

  const sections = [
    { id: 'events', label: 'Timeline', icon: '⏱️' },
    { id: 'lineups', label: 'Lineups', icon: '👥' },
    { id: 'stats', label: 'Heat Map', icon: '🔥' }
  ];

  return (
    <div className="mt-6 bg-secondary-bg rounded-xl overflow-hidden hover-lift">
      {/* Section Navigation */}
      <div className="border-b border-border-color">
        <div className="flex">
          {sections.map(section => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex-1 flex items-center justify-center space-x-2 py-4 px-6 text-sm font-medium transition-all duration-200 ${
                activeSection === section.id
                  ? 'bg-gradient-primary text-white'
                  : 'text-text-secondary hover:text-text-primary hover:bg-hover-bg'
              }`}
            >
              <span>{section.icon}</span>
              <span>{section.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        {/* Match Timeline */}
        {activeSection === 'events' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-text-primary">Match Events</h3>
              <div className="text-sm text-text-secondary">
                {events.length} events recorded
              </div>
            </div>
            
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-accent-red via-accent-blue to-accent-green"></div>
              
              <div className="space-y-4">
                {events.map((event, index) => (
                  <div 
                    key={index} 
                    className="relative flex items-start space-x-4 group scale-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {/* Timeline Dot */}
                    <div className="relative z-10">
                      <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${getEventColor(event.type, event.impact)} flex items-center justify-center shadow-lg`}>
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/30 to-transparent animate-ping"></div>
                    </div>

                    {/* Event Card */}
                    <div className="flex-1 bg-tertiary-bg rounded-xl p-4 hover:bg-hover-bg transition-all duration-200 hover-scale group-hover:shadow-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <span className="text-lg">{getEventIcon(event.type)}</span>
                            <span className="text-sm font-mono text-text-secondary bg-secondary-bg px-2 py-1 rounded">
                              {event.time}
                            </span>
                            <div className={`w-3 h-3 rounded-full ${
                              event.team === 'home' ? 'bg-accent-red' : 'bg-accent-blue'
                            }`}></div>
                          </div>
                          
                          <div className="space-y-1">
                            <div className="text-sm font-bold text-text-primary">
                              {event.player}
                            </div>
                            <div className="text-xs text-text-secondary font-medium">
                              {event.description}
                            </div>
                            <div className="text-xs text-text-muted">
                              {event.details}
                            </div>
                          </div>
                        </div>
                        
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-2 text-text-muted hover:text-accent-blue transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Team Lineups */}
        {activeSection === 'lineups' && (
          <div className="space-y-8">
            <h3 className="text-xl font-bold text-text-primary">Team Lineups</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Home Team */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-accent-red rounded-full flex items-center justify-center text-sm font-bold text-white">
                    A
                  </div>
                  <div>
                    <span className="font-bold text-text-primary">{currentMatch.homeTeam}</span>
                    <span className="text-sm text-text-secondary ml-2">({lineup.home.formation})</span>
                  </div>
                </div>
                
                <div className="bg-tertiary-bg rounded-xl p-4">
                  <div className="space-y-2">
                    {lineup.home.players.map((player, index) => (
                      <div 
                        key={index} 
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-hover-bg transition-colors scale-in"
                        style={{ animationDelay: `${index * 0.02}s` }}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-6 h-6 bg-accent-red text-white rounded text-xs font-bold flex items-center justify-center">
                            {player.number}
                          </div>
                          <span className="text-sm font-medium text-text-primary">{player.name}</span>
                        </div>
                        <span className="text-xs text-text-secondary bg-secondary-bg px-2 py-1 rounded">
                          {player.position}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Away Team */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-accent-blue rounded-full flex items-center justify-center text-sm font-bold text-white">
                    C
                  </div>
                  <div>
                    <span className="font-bold text-text-primary">{currentMatch.awayTeam}</span>
                    <span className="text-sm text-text-secondary ml-2">({lineup.away.formation})</span>
                  </div>
                </div>
                
                <div className="bg-tertiary-bg rounded-xl p-4">
                  <div className="space-y-2">
                    {lineup.away.players.map((player, index) => (
                      <div 
                        key={index} 
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-hover-bg transition-colors scale-in"
                        style={{ animationDelay: `${index * 0.02}s` }}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-6 h-6 bg-accent-blue text-white rounded text-xs font-bold flex items-center justify-center">
                            {player.number}
                          </div>
                          <span className="text-sm font-medium text-text-primary">{player.name}</span>
                        </div>
                        <span className="text-xs text-text-secondary bg-secondary-bg px-2 py-1 rounded">
                          {player.position}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Heat Map Section */}
        {activeSection === 'stats' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-text-primary">Player Heat Map</h3>
            
            <div className="bg-gradient-to-r from-green-900 via-green-800 to-green-900 rounded-xl p-6 relative overflow-hidden">
              {/* Field markings */}
              <div className="absolute inset-4 border-2 border-white/30 rounded-lg">
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/30 transform -translate-y-0.5"></div>
                <div className="absolute top-1/2 left-1/2 w-20 h-20 border-2 border-white/30 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
              </div>
              
              {/* Player Heat Dots */}
              <div className="relative h-64">
                {/* Home team heat spots */}
                {[...Array(15)].map((_, i) => (
                  <div
                    key={`home-${i}`}
                    className="absolute w-4 h-4 bg-red-500/60 rounded-full animate-pulse"
                    style={{
                      left: `${Math.random() * 45 + 5}%`,
                      top: `${Math.random() * 80 + 10}%`,
                      animationDelay: `${i * 0.2}s`
                    }}
                  ></div>
                ))}
                
                {/* Away team heat spots */}
                {[...Array(12)].map((_, i) => (
                  <div
                    key={`away-${i}`}
                    className="absolute w-4 h-4 bg-blue-500/60 rounded-full animate-pulse"
                    style={{
                      left: `${Math.random() * 45 + 50}%`,
                      top: `${Math.random() * 80 + 10}%`,
                      animationDelay: `${i * 0.3}s`
                    }}
                  ></div>
                ))}
              </div>
              
              <div className="flex items-center justify-center space-x-8 mt-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-white text-sm">Arsenal Activity</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-white text-sm">Chelsea Activity</span>
                </div>
              </div>
            </div>
            
            <div className="text-center text-text-secondary text-sm">
              Heat map shows player movement intensity throughout the match
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchSummary;
