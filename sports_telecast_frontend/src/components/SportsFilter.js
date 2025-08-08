import React, { useState, useEffect } from 'react';

// PUBLIC_INTERFACE
const SportsFilter = ({ selectedSport, onSportChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [sports, setSports] = useState([
    { name: 'All', count: 0 }
  ]);
  const [loading, setLoading] = useState(true);

  // Static mock data for sports with realistic counts
  const mockSports = [
    { name: 'All', count: 47 },
    { name: 'Football', count: 18 },
    { name: 'Basketball', count: 12 },
    { name: 'Tennis', count: 8 },
    { name: 'Baseball', count: 5 },
    { name: 'Hockey', count: 3 },
    { name: 'Cricket', count: 1 }
  ];

  // Load sports data with simulated delay
  useEffect(() => {
    setLoading(true);
    
    setTimeout(() => {
      setSports(mockSports);
      setLoading(false);
    }, 200); // Simulate network delay
  }, []);

  const handleSportClick = (sportName) => {
    onSportChange(sportName);
    setIsExpanded(false);
  };

  return (
    <div className="sticky top-16 z-40 bg-primary-bg/95 backdrop-blur-lg border-b border-border-color">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        {/* Mobile Toggle */}
        <div className="md:hidden mb-3">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-between px-4 py-2 bg-secondary-bg rounded-md hover:bg-hover-bg transition-all duration-200"
          >
            <span className="font-medium text-text-primary text-sm">
              {selectedSport}
            </span>
            <svg 
              className={`w-4 h-4 text-text-secondary transition-transform duration-200 ${
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

        {/* Sports Filter Buttons - Navbar Style */}
        <div className={`${
          isExpanded ? 'block' : 'hidden'
        } md:block transition-all duration-300`}>
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
            {(!loading ? sports : [
              { name: 'All', count: '-' },
              { name: 'Football', count: '-' },
              { name: 'Basketball', count: '-' }
            ]).map((sport, index) => (
              <button
                key={sport.name}
                onClick={() => handleSportClick(sport.name)}
                className={`flex items-center justify-center px-4 py-2 text-sm font-medium transition-all duration-200 whitespace-nowrap min-w-fit hover-scale ${
                  selectedSport === sport.name
                    ? 'bg-text-primary text-primary-bg shadow-md'
                    : 'bg-secondary-bg text-text-secondary hover:bg-hover-bg hover:text-text-primary'
                }`}
                style={{ 
                  borderRadius: '8px',
                  animationDelay: `${index * 0.02}s`
                }}
              >
                <span>{sport.name}</span>
                <span className={`ml-2 px-2 py-0.5 text-xs font-semibold rounded ${
                  selectedSport === sport.name
                    ? 'bg-primary-bg/20 text-primary-bg'
                    : 'bg-black/20 text-text-muted'
                }`} style={{ borderRadius: '4px' }}>
                  {sport.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SportsFilter;
