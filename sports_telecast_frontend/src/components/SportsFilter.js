import React, { useState } from 'react';

// PUBLIC_INTERFACE
const SportsFilter = ({ selectedSport, onSportChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const sports = [
    { name: 'All', icon: '🏆', count: 24, color: '#667eea', gradient: 'from-purple-500 to-blue-500' },
    { name: 'Football', icon: '⚽', count: 8, color: '#4caf50', gradient: 'from-green-500 to-emerald-500' },
    { name: 'Basketball', icon: '🏀', count: 5, color: '#ff9800', gradient: 'from-orange-500 to-red-500' },
    { name: 'Tennis', icon: '🎾', count: 3, color: '#ffeb3b', gradient: 'from-yellow-500 to-orange-500' },
    { name: 'Baseball', icon: '⚾', count: 4, color: '#2196f3', gradient: 'from-blue-500 to-indigo-500' },
    { name: 'Hockey', icon: '🏒', count: 2, color: '#9c27b0', gradient: 'from-purple-500 to-pink-500' },
    { name: 'Cricket', icon: '🏏', count: 2, color: '#ff5722', gradient: 'from-red-500 to-pink-500' }
  ];

  const handleSportClick = (sportName) => {
    onSportChange(sportName);
    setIsExpanded(false);
  };

  return (
    <div className="sticky top-16 z-40 bg-secondary-bg/95 backdrop-blur-lg border-b border-border-color">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        {/* Mobile Toggle */}
        <div className="md:hidden mb-4">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-between p-3 bg-tertiary-bg rounded-lg hover:bg-hover-bg transition-all duration-200"
          >
            <div className="flex items-center space-x-3">
              <span className="text-lg">
                {sports.find(s => s.name === selectedSport)?.icon}
              </span>
              <span className="font-medium text-text-primary">
                {selectedSport} Sports
              </span>
            </div>
            <svg 
              className={`w-5 h-5 text-text-secondary transition-transform duration-200 ${
                isExpanded ? 'rotate-180' : ''
              }`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Sports Filter Buttons */}
        <div className={`${
          isExpanded ? 'block' : 'hidden'
        } md:block transition-all duration-300`}>
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-hide">
            {sports.map((sport, index) => (
              <button
                key={sport.name}
                onClick={() => handleSportClick(sport.name)}
                className={`group flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 hover-lift whitespace-nowrap scale-in ${
                  selectedSport === sport.name
                    ? `bg-gradient-to-r ${sport.gradient} text-white shadow-lg transform scale-105`
                    : `bg-tertiary-bg text-text-secondary hover:bg-hover-bg hover:text-text-primary`
                }`}
                style={{ 
                  animationDelay: `${index * 0.05}s`,
                  boxShadow: selectedSport === sport.name ? `0 0 20px ${sport.color}40` : 'none'
                }}
              >
                <div className={`relative transition-transform duration-200 ${
                  selectedSport === sport.name ? 'scale-110' : 'group-hover:scale-110'
                }`}>
                  <span className="text-xl">{sport.icon}</span>
                  {selectedSport === sport.name && (
                    <div 
                      className="absolute inset-0 blur-md opacity-50"
                      style={{ background: sport.color }}
                    ></div>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{sport.name}</span>
                  <div className={`px-2 py-1 rounded-full text-xs font-bold transition-all duration-200 ${
                    selectedSport === sport.name
                      ? 'bg-white/20 text-white'
                      : 'bg-black/20 text-text-muted group-hover:bg-accent-blue/20 group-hover:text-accent-blue'
                  }`}>
                    {sport.count}
                  </div>
                </div>

                {/* Active indicator */}
                {selectedSport === sport.name && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full bounce-subtle"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="hidden lg:flex items-center justify-between mt-4 pt-4 border-t border-border-color">
          <div className="flex items-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-accent-red rounded-full pulse-glow"></div>
              <span className="text-text-secondary">
                <span className="text-accent-red font-bold">8</span> Live Now
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-accent-blue rounded-full"></div>
              <span className="text-text-secondary">
                <span className="text-accent-blue font-bold">16</span> Scheduled Today
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-accent-green rounded-full"></div>
              <span className="text-text-secondary">
                <span className="text-accent-green font-bold">42</span> Highlights Available
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="p-2 text-text-secondary hover:text-text-primary transition-colors hover-scale">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
            </button>
            <button className="p-2 text-text-secondary hover:text-text-primary transition-colors hover-scale">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SportsFilter;
