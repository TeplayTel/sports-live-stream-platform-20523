import React, { useState, useEffect } from 'react';

// PUBLIC_INTERFACE
const SportsFilter = ({ selectedSport, onSportChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [sports, setSports] = useState([
    { name: 'All', count: 0 }
  ]);
  const [loading, setLoading] = useState(true);

  // Attempt to get sports dynamically from API
  useEffect(() => {
    setLoading(true);
    const fetchSports = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
        // Fetch all matches, get unique sport types and counts
        let res = await fetch(`${apiUrl}/matches/`);
        let data = await res.json();
        if (data.matches && Array.isArray(data.matches)) {
          const sportsMap = {};
          data.matches.forEach((match) => {
            if (match.sport_type) {
              const sport = match.sport_type.charAt(0).toUpperCase() + match.sport_type.slice(1);
              sportsMap[sport] = (sportsMap[sport] || 0) + 1;
            }
          });
          // Fallback static order if no data
          let arr = [{ name: 'All', count: data.matches.length }];
          Object.keys(sportsMap).forEach(k => arr.push({ name: k, count: sportsMap[k] }));
          setSports(arr);
        } else {
          setSports([
            { name: 'All', count: 0 },
            { name: 'Football', count: 0 },
            { name: 'Basketball', count: 0 },
            { name: 'Tennis', count: 0 },
            { name: 'Baseball', count: 0 },
            { name: 'Hockey', count: 0 },
            { name: 'Cricket', count: 0 }
          ]);
        }
      } catch (e) {
        // fallback to static
        setSports([
          { name: 'All', count: 0 },
          { name: 'Football', count: 0 },
          { name: 'Basketball', count: 0 },
          { name: 'Tennis', count: 0 },
          { name: 'Baseball', count: 0 },
          { name: 'Hockey', count: 0 },
          { name: 'Cricket', count: 0 }
        ]);
      }
      setLoading(false);
    };
    fetchSports();
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
