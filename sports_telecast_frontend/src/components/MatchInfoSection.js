import React, { useState, useEffect } from 'react';

// PUBLIC_INTERFACE
const MatchInfoSection = ({ currentMatch }) => {
  /**
   * Compact match information section with scroll-based visibility
   * Shows team names, score, and status in a horizontal nav-like layout
   * Appears/disappears based on scroll direction like a sticky nav bar
   * @param {Object} currentMatch - Match data containing team info and scores
   */

  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [scrollDirection, setScrollDirection] = useState('up');

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Determine scroll direction
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down and past threshold
        setScrollDirection('down');
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY || currentScrollY <= 50) {
        // Scrolling up or at top of page
        setScrollDirection('up');
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    // Throttle scroll events for better performance
    let timeoutId;
    const throttledHandleScroll = () => {
      if (timeoutId) return;
      timeoutId = setTimeout(() => {
        handleScroll();
        timeoutId = null;
      }, 16); // ~60fps
    };

    window.addEventListener('scroll', throttledHandleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', throttledHandleScroll);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [lastScrollY]);

  if (!currentMatch) {
    return null;
  }

  const { homeTeam, awayTeam, homeScore, awayScore, status, time } = currentMatch;

  return (
    <div 
      className={`fixed top-16 left-0 right-0 z-40 transition-transform duration-300 ease-in-out ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
      style={{
        background: '#1a1a1a',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)'
      }}
      aria-label={`Match information: ${homeTeam} ${homeScore}, ${awayTeam} ${awayScore}`}
    >
      {/* Compact Match Info Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div 
          className="flex items-center justify-between"
          style={{ 
            height: '52px',
            padding: '0 8px'
          }}
        >
          
          {/* Left: Home Team */}
          <div className="flex items-center space-x-3 flex-1">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-medium text-sm"
              style={{ 
                backgroundColor: homeTeam === 'Arsenal' ? '#DC143C' : 
                                homeTeam === 'Chelsea' ? '#034694' :
                                homeTeam === 'Liverpool' ? '#C8102E' :
                                homeTeam === 'Manchester City' ? '#6CABDD' : '#666',
                fontSize: '12px'
              }}
              aria-label={`${homeTeam} logo`}
            >
              {homeTeam.charAt(0)}
            </div>
            <span 
              className="text-white font-medium truncate"
              style={{ 
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              {homeTeam}
            </span>
          </div>

          {/* Center: Score and Status */}
          <div className="flex items-center space-x-4 px-6">
            {/* Score */}
            <div className="flex items-center space-x-2">
              <span 
                className="text-white font-bold"
                style={{ 
                  fontSize: '18px',
                  fontWeight: '700',
                  fontFamily: '"Helvetica Neue", Arial, sans-serif'
                }}
              >
                {homeScore}
              </span>
              <span 
                className="text-gray-400"
                style={{ fontSize: '16px' }}
              >
                :
              </span>
              <span 
                className="text-white font-bold"
                style={{ 
                  fontSize: '18px',
                  fontWeight: '700',
                  fontFamily: '"Helvetica Neue", Arial, sans-serif'
                }}
              >
                {awayScore}
              </span>
            </div>
            
            {/* Status and Time */}
            {status === 'LIVE' && (
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span 
                  className="text-gray-300 font-medium"
                  style={{ fontSize: '12px' }}
                >
                  {time} • LIVE
                </span>
              </div>
            )}
          </div>

          {/* Right: Away Team */}
          <div className="flex items-center space-x-3 flex-1 justify-end">
            <span 
              className="text-white font-medium truncate text-right"
              style={{ 
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              {awayTeam}
            </span>
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-medium text-sm"
              style={{ 
                backgroundColor: awayTeam === 'Arsenal' ? '#DC143C' : 
                                awayTeam === 'Chelsea' ? '#034694' :
                                awayTeam === 'Liverpool' ? '#C8102E' :
                                awayTeam === 'Manchester City' ? '#6CABDD' : '#666',
                fontSize: '12px'
              }}
              aria-label={`${awayTeam} logo`}
            >
              {awayTeam.charAt(0)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchInfoSection;
