import React, { useState } from 'react';

// PUBLIC_INTERFACE
const SportsCards = ({ selectedSport, onSportChange }) => {
  const [filter, setFilter] = useState('All');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('viewers');
  const [isLoading, setIsLoading] = useState(false);
  
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
      viewers: 18500,
      trending: true,
      featured: true,
      thumbnail: '/api/placeholder/400/225'
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
      viewers: 25000,
      trending: true,
      featured: false,
      thumbnail: '/api/placeholder/400/225'
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
      viewers: 0,
      trending: false,
      featured: false,
      thumbnail: '/api/placeholder/400/225'
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
      viewers: 0,
      trending: false,
      featured: true,
      thumbnail: '/api/placeholder/400/225'
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
      viewers: 0,
      trending: false,
      featured: false,
      thumbnail: '/api/placeholder/400/225'
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
      viewers: 8200,
      trending: false,
      featured: false,
      thumbnail: '/api/placeholder/400/225'
    }
  ];

  const filteredMatches = matches
    .filter(match => {
      const sportMatch = selectedSport === 'All' || match.sport === selectedSport;
      const statusMatch = filter === 'All' || 
        (filter === 'Live' && match.status === 'LIVE') ||
        (filter === 'Recorded' && (match.status === 'RECORDED' || match.status === 'FINAL'));
      
      return sportMatch && statusMatch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'viewers':
          return b.viewers - a.viewers;
        case 'time':
          return new Date(b.id) - new Date(a.id);
        case 'alphabetical':
          return a.homeTeam.localeCompare(b.homeTeam);
        default:
          return 0;
      }
    });

  const handleFilterChange = (newFilter) => {
    setIsLoading(true);
    setFilter(newFilter);
    setTimeout(() => setIsLoading(false), 300);
  };

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

  const getStatusConfig = (status) => {
    switch (status) {
      case 'LIVE': 
        return { 
          bg: 'bg-gradient-to-r from-red-500 to-red-600', 
          text: 'text-white',
          glow: 'shadow-red-500/50',
          pulse: true
        };
      case 'FINAL': 
        return { 
          bg: 'bg-gray-600', 
          text: 'text-white',
          glow: 'shadow-gray-500/30',
          pulse: false
        };
      case 'RECORDED': 
        return { 
          bg: 'bg-gradient-to-r from-blue-500 to-blue-600', 
          text: 'text-white',
          glow: 'shadow-blue-500/50',
          pulse: false
        };
      default: 
        return { 
          bg: 'bg-gray-600', 
          text: 'text-white',
          glow: 'shadow-gray-500/30',
          pulse: false
        };
    }
  };

  const MatchCard = ({ match, index }) => {
    const [isHovered, setIsHovered] = useState(false);
    const statusConfig = getStatusConfig(match.status);

    return (
      <div 
        className={`group relative bg-secondary-bg rounded-xl overflow-hidden hover-lift transition-all duration-300 cursor-pointer ${
          match.featured ? 'ring-2 ring-accent-blue/50' : ''
        }`}
        style={{ animationDelay: `${index * 0.1}s` }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Featured Badge */}
        {match.featured && (
          <div className="absolute top-3 left-3 z-20 bg-gradient-primary text-white px-2 py-1 rounded-full text-xs font-bold">
            ⭐ Featured
          </div>
        )}

        {/* Trending Badge */}
        {match.trending && (
          <div className="absolute top-3 right-3 z-20 bg-gradient-accent text-white px-2 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
            <span>🔥</span>
            <span>Trending</span>
          </div>
        )}

        {/* Thumbnail */}
        <div className="relative aspect-video bg-tertiary-bg overflow-hidden">
          <img 
            src={match.thumbnail} 
            alt={`${match.homeTeam} vs ${match.awayTeam}`}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          
          {/* Play Button Overlay */}
          <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}>
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 hover-scale">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-lg">{getSportIcon(match.sport)}</span>
              <span className="text-xs text-text-muted bg-tertiary-bg px-2 py-1 rounded-full">
                {match.competition}
              </span>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-bold ${statusConfig.bg} ${statusConfig.text} ${statusConfig.glow} ${
              statusConfig.pulse ? 'pulse-glow' : ''
            }`}>
              {match.status}
            </div>
          </div>

          {/* Teams and Score */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 flex-1">
                <div className="relative">
                  <div className="w-10 h-10 bg-accent-red rounded-full flex items-center justify-center text-sm font-bold text-white shadow-lg">
                    {match.homeTeam[0]}
                  </div>
                  <div className="absolute inset-0 bg-accent-red rounded-full blur opacity-30"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary truncate">{match.homeTeam}</p>
                </div>
              </div>
              
              <div className="mx-4">
                <div className="bg-tertiary-bg rounded-lg px-3 py-2">
                  <div className="font-mono text-lg font-bold text-text-primary text-center">
                    <span className="hover-scale inline-block transition-transform duration-200">
                      {match.homeScore}
                    </span>
                    <span className="mx-2 text-text-muted">-</span>
                    <span className="hover-scale inline-block transition-transform duration-200">
                      {match.awayScore}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 flex-1">
                <div className="flex-1 min-w-0 text-right">
                  <p className="text-sm font-medium text-text-primary truncate">{match.awayTeam}</p>
                </div>
                <div className="relative">
                  <div className="w-10 h-10 bg-accent-blue rounded-full flex items-center justify-center text-sm font-bold text-white shadow-lg">
                    {match.awayTeam[0]}
                  </div>
                  <div className="absolute inset-0 bg-accent-blue rounded-full blur opacity-30"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-border-color">
            <span className="text-xs text-text-muted font-mono">{match.time}</span>
            {match.viewers > 0 && (
              <div className="flex items-center space-x-1 text-xs text-text-muted">
                <div className="w-2 h-2 bg-accent-green rounded-full bounce-subtle"></div>
                <span className="font-medium">{match.viewers.toLocaleString()}</span>
                <span>watching</span>
              </div>
            )}
          </div>
        </div>

        {/* Hover Glow Effect */}
        <div className={`absolute inset-0 rounded-xl transition-all duration-300 pointer-events-none ${
          isHovered ? 'shadow-xl bg-gradient-to-r from-transparent via-white/5 to-transparent' : ''
        }`}></div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-text-primary mb-2">
            {selectedSport === 'All' ? 'All Sports' : selectedSport} Matches
          </h2>
          <p className="text-text-secondary">
            {filteredMatches.length} matches found
          </p>
        </div>
        
        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
          {/* Filter Buttons */}
          <div className="flex space-x-2">
            {['All', 'Live', 'Recorded'].map((filterOption) => (
              <button
                key={filterOption}
                onClick={() => handleFilterChange(filterOption)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover-scale ${
                  filter === filterOption
                    ? 'bg-gradient-primary text-white shadow-lg'
                    : 'bg-tertiary-bg text-text-secondary hover:bg-hover-bg hover:text-text-primary'
                }`}
              >
                {filterOption}
              </button>
            ))}
          </div>

          {/* View Mode and Sort */}
          <div className="flex items-center space-x-2">
            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-tertiary-bg border border-border-color rounded-lg px-3 py-2 text-sm text-text-primary focus:border-accent-blue focus:outline-none"
            >
              <option value="viewers">Most Watched</option>
              <option value="time">Recent</option>
              <option value="alphabetical">A-Z</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex bg-tertiary-bg rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-all duration-200 ${
                  viewMode === 'grid' ? 'bg-accent-blue text-white' : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z"/>
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-all duration-200 ${
                  viewMode === 'list' ? 'bg-accent-blue text-white' : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-secondary-bg rounded-xl p-4 space-y-4">
              <div className="aspect-video bg-tertiary-bg rounded-lg shimmer"></div>
              <div className="space-y-2">
                <div className="h-4 bg-tertiary-bg rounded shimmer"></div>
                <div className="h-3 bg-tertiary-bg rounded shimmer w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Matches Grid/List */}
      {!isLoading && (
        <div className={`${
          viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
            : 'space-y-4'
        }`}>
          {filteredMatches.map((match, index) => (
            <div key={match.id} className="scale-in">
              <MatchCard match={match} index={index} />
            </div>
          ))}
        </div>
      )}

      {/* No Results */}
      {!isLoading && filteredMatches.length === 0 && (
        <div className="text-center py-16 scale-in">
          <div className="text-6xl mb-4">🏟️</div>
          <h3 className="text-xl font-bold text-text-primary mb-2">No matches found</h3>
          <p className="text-text-secondary mb-6">
            Try adjusting your filters or check back later for more content.
          </p>
          <button
            onClick={() => {
              setFilter('All');
              onSportChange('All');
            }}
            className="bg-gradient-primary text-white px-6 py-3 rounded-lg font-medium hover-lift transition-all duration-200"
          >
            View All Matches
          </button>
        </div>
      )}
    </div>
  );
};

export default SportsCards;
