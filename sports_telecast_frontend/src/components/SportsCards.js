import React, { useState } from 'react';

// PUBLIC_INTERFACE
const SportsCards = ({ selectedSport }) => {
  const [filter, setFilter] = useState('All');
  
  const matches = [
    {
      id: 1,
      homeTeam: 'Liverpool',
      awayTeam: 'Manchester City',
      homeScore: 1,
      awayScore: 1,
      status: 'LIVE',
      time: "73'",
      competition: 'Premier League',
      sport: 'Football',
      viewers: 18500
    },
    {
      id: 2,
      homeTeam: 'Barcelona',
      awayTeam: 'Real Madrid',
      homeScore: 2,
      awayScore: 0,
      status: 'LIVE',
      time: "89'",
      competition: 'La Liga',
      sport: 'Football',
      viewers: 25000
    },
    {
      id: 3,
      homeTeam: 'Lakers',
      awayTeam: 'Warriors',
      homeScore: 108,
      awayScore: 112,
      status: 'FINAL',
      time: 'FT',
      competition: 'NBA',
      sport: 'Basketball',
      viewers: 0
    },
    {
      id: 4,
      homeTeam: 'Federer',
      awayTeam: 'Nadal',
      homeScore: 2,
      awayScore: 1,
      status: 'RECORDED',
      time: 'Highlights',
      competition: 'Wimbledon',
      sport: 'Tennis',
      viewers: 0
    },
    {
      id: 5,
      homeTeam: 'Yankees',
      awayTeam: 'Red Sox',
      homeScore: 7,
      awayScore: 4,
      status: 'FINAL',
      time: '9th',
      competition: 'MLB',
      sport: 'Baseball',
      viewers: 0
    },
    {
      id: 6,
      homeTeam: 'Rangers',
      awayTeam: 'Bruins',
      homeScore: 3,
      awayScore: 2,
      status: 'LIVE',
      time: '2nd Period',
      competition: 'NHL',
      sport: 'Hockey',
      viewers: 8200
    }
  ];

  const filteredMatches = matches.filter(match => {
    const sportMatch = selectedSport === 'All' || match.sport === selectedSport;
    const statusMatch = filter === 'All' || 
      (filter === 'Live' && match.status === 'LIVE') ||
      (filter === 'Recorded' && (match.status === 'RECORDED' || match.status === 'FINAL'));
    
    return sportMatch && statusMatch;
  });

  const getSportIcon = (sport) => {
    const icons = {
      'Football': '⚽',
      'Basketball': '🏀',
      'Tennis': '🎾',
      'Baseball': '⚾',
      'Hockey': '🏒',
      'Cricket': '🏏'
    };
    return icons[sport] || '🏆';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'LIVE': return 'bg-accent-red';
      case 'FINAL': return 'bg-text-muted';
      case 'RECORDED': return 'bg-accent-blue';
      default: return 'bg-text-muted';
    }
  };

  return (
    <div>
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-text-primary">
          {selectedSport === 'All' ? 'All Sports' : selectedSport} Matches
        </h2>
        
        {/* Filter Buttons */}
        <div className="flex space-x-2">
          {['All', 'Live', 'Recorded'].map((filterOption) => (
            <button
              key={filterOption}
              onClick={() => setFilter(filterOption)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-standard ${
                filter === filterOption
                  ? 'bg-accent-red text-white'
                  : 'bg-tertiary-bg text-text-secondary hover:bg-hover-bg hover:text-text-primary'
              }`}
            >
              {filterOption}
            </button>
          ))}
        </div>
      </div>

      {/* Matches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMatches.map((match) => (
          <div key={match.id} className="bg-secondary-bg rounded-md p-4 hover:bg-hover-bg transition-standard cursor-pointer hover-scale">
            {/* Match Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <span className="text-lg">{getSportIcon(match.sport)}</span>
                <span className="text-xs text-text-secondary">{match.competition}</span>
              </div>
              <div className={`px-2 py-1 rounded text-xs font-bold text-white ${getStatusColor(match.status)} ${
                match.status === 'LIVE' ? 'pulse-animation' : ''
              }`}>
                {match.status}
              </div>
            </div>

            {/* Teams and Score */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-accent-red rounded-full flex items-center justify-center text-xs font-bold">
                  {match.homeTeam[0]}
                </div>
                <span className="text-sm font-medium text-text-primary">{match.homeTeam}</span>
              </div>
              
              <div className="font-mono text-lg font-bold text-text-primary">
                {match.homeScore} - {match.awayScore}
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-text-primary">{match.awayTeam}</span>
                <div className="w-8 h-8 bg-accent-blue rounded-full flex items-center justify-center text-xs font-bold">
                  {match.awayTeam[0]}
                </div>
              </div>
            </div>

            {/* Match Details */}
            <div className="flex items-center justify-between text-xs text-text-secondary">
              <span>{match.time}</span>
              {match.viewers > 0 && (
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-accent-green rounded-full"></div>
                  <span>{match.viewers.toLocaleString()} viewers</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredMatches.length === 0 && (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">🏟️</div>
          <h3 className="text-lg font-medium text-text-primary mb-2">No matches found</h3>
          <p className="text-text-secondary">Try adjusting your filters or check back later.</p>
        </div>
      )}
    </div>
  );
};

export default SportsCards;
