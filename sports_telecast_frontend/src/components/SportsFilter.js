import React from 'react';

// PUBLIC_INTERFACE
const SportsFilter = ({ selectedSport, onSportChange }) => {
  const sports = [
    { name: 'All', icon: '🏆', count: 24 },
    { name: 'Football', icon: '⚽', count: 8 },
    { name: 'Basketball', icon: '🏀', count: 5 },
    { name: 'Tennis', icon: '🎾', count: 3 },
    { name: 'Baseball', icon: '⚾', count: 4 },
    { name: 'Hockey', icon: '🏒', count: 2 },
    { name: 'Cricket', icon: '🏏', count: 2 }
  ];

  return (
    <div className="bg-secondary-bg border-b border-border-color">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center space-x-1 overflow-x-auto">
          {sports.map((sport) => (
            <button
              key={sport.name}
              onClick={() => onSportChange(sport.name)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-standard hover-scale whitespace-nowrap ${
                selectedSport === sport.name
                  ? 'bg-accent-red text-white'
                  : 'bg-tertiary-bg text-text-secondary hover:bg-hover-bg hover:text-text-primary'
              }`}
            >
              <span className="text-lg">{sport.icon}</span>
              <span>{sport.name}</span>
              <span className="bg-black bg-opacity-20 px-2 py-1 rounded-full text-xs">
                {sport.count}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SportsFilter;
