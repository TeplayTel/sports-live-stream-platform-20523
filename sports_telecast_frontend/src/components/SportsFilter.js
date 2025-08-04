import React, { useState } from 'react';

// PUBLIC_INTERFACE
const SportsFilter = ({ selectedSport, onSportChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const sports = [
    { name: 'All', count: 24 },
    { name: 'Football', count: 8 },
    { name: 'Basketball', count: 5 },
    { name: 'Tennis', count: 3 },
    { name: 'Baseball', count: 4 },
    { name: 'Hockey', count: 2 },
    { name: 'Cricket', count: 2 }
  ];

  const handleSportClick = (sportName) => {
    onSportChange(sportName);
    setIsExpanded(false);
  };

  return (
    <div className="sticky top-16 z-40 bg-secondary-bg/95 backdrop-blur-lg border-b border-border-color">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Mobile Toggle */}
        <div className="md:hidden mb-4">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-between p-4 bg-tertiary-bg rounded-2xl hover:bg-hover-bg transition-all duration-200"
          >
            <span className="font-semibold text-text-primary">
              {selectedSport}
            </span>
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
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {sports.map((sport, index) => (
              <button
                key={sport.name}
                onClick={() => handleSportClick(sport.name)}
                className={`group flex items-center justify-center px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 hover-lift whitespace-nowrap scale-in min-w-fit ${
                  selectedSport === sport.name
                    ? 'bg-white text-primary-bg shadow-lg transform scale-105'
                    : 'bg-tertiary-bg text-text-secondary hover:bg-hover-bg hover:text-text-primary'
                }`}
                style={{ 
                  animationDelay: `${index * 0.05}s`
                }}
              >
                <span className="font-medium">{sport.name}</span>
                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-bold transition-all duration-200 ${
                  selectedSport === sport.name
                    ? 'bg-primary-bg/20 text-primary-bg'
                    : 'bg-black/20 text-text-muted group-hover:bg-accent-blue/20 group-hover:text-accent-blue'
                }`}>
                  {sport.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Simplified Stats */}
        <div className="hidden lg:flex items-center justify-center mt-6 pt-4">
          <div className="flex items-center space-x-8 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-accent-red rounded-full pulse-glow"></div>
              <span className="text-text-secondary">
                <span className="text-accent-red font-bold">8</span> Live
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-accent-blue rounded-full"></div>
              <span className="text-text-secondary">
                <span className="text-accent-blue font-bold">16</span> Today
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-accent-green rounded-full"></div>
              <span className="text-text-secondary">
                <span className="text-accent-green font-bold">42</span> Highlights
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SportsFilter;
