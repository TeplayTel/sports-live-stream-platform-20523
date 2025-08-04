import React from 'react';

// PUBLIC_INTERFACE
const MatchInfoSection = ({ currentMatch }) => {
  /**
   * Match information section that displays directly below the video player
   * Shows team logos, names, and current score in a horizontal layout
   * @param {Object} currentMatch - Match data containing team info and scores
   */

  if (!currentMatch) {
    return null;
  }

  const { homeTeam, awayTeam, homeScore, awayScore, status, time } = currentMatch;

  // Generate placeholder team logos (in a real app, these would be actual team logos)
  const getTeamLogo = (teamName) => {
    const teamColors = {
      'Arsenal': '#DC143C',
      'Chelsea': '#034694',
      'Liverpool': '#C8102E',
      'Manchester City': '#6CABDD',
      'Manchester United': '#DA020E',
      'Tottenham': '#132257',
      'Barcelona': '#A50044',
      'Real Madrid': '#FEBE10'
    };
    
    return {
      backgroundColor: teamColors[teamName] || '#666',
      initial: teamName.charAt(0).toUpperCase()
    };
  };

  const homeTeamLogo = getTeamLogo(homeTeam);
  const awayTeamLogo = getTeamLogo(awayTeam);

  return (
    <div 
      className="bg-secondary-bg rounded-xl p-4 hover-lift transition-smooth md:match-info-tablet sm:match-info-mobile"
      style={{ 
        background: '#1a1a1a',
        borderRadius: '8px',
        padding: '12px 16px',
        minHeight: '80px'
      }}
      aria-label={`Match information: ${homeTeam} ${homeScore}, ${awayTeam} ${awayScore}`}
    >
      {/* Match Info Container */}
      <div className="flex items-center justify-between h-full">
        
        {/* Home Team Section */}
        <div className="flex flex-col items-center space-y-2 flex-1">
          <div 
            className="team-logo w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-lg transition-transform duration-200 hover:scale-105"
            style={{ 
              backgroundColor: homeTeamLogo.backgroundColor,
              width: '40px',
              height: '40px'
            }}
            aria-label={`${homeTeam} logo`}
          >
            {homeTeamLogo.initial}
          </div>
          <span 
            className="team-name text-white text-sm font-normal"
            style={{ 
              fontSize: '14px',
              fontWeight: '400',
              letterSpacing: '0.5px',
              color: '#ffffff'
            }}
          >
            {homeTeam}
          </span>
        </div>

        {/* Score Section */}
        <div 
          className="score-section flex items-center justify-center mx-6"
          style={{ margin: '0 24px' }}
        >
          <div 
            className="flex items-center space-x-2 px-4 py-2 rounded"
            style={{ 
              backgroundColor: '#0f0f0f',
              padding: '8px 16px',
              borderRadius: '4px'
            }}
            aria-label={`Current score ${homeScore} to ${awayScore}`}
          >
            <span 
              className="score-text text-white font-bold"
              style={{ 
                fontSize: '28px',
                fontWeight: '700',
                letterSpacing: '2px',
                color: '#ffffff',
                fontFamily: '"Helvetica Neue", Arial, sans-serif'
              }}
            >
              {homeScore}
            </span>
            <span 
              className="text-white"
              style={{ 
                fontSize: '24px',
                fontWeight: '400',
                color: '#b0b0b0'
              }}
            >
              :
            </span>
            <span 
              className="score-text text-white font-bold"
              style={{ 
                fontSize: '28px',
                fontWeight: '700',
                letterSpacing: '2px',
                color: '#ffffff',
                fontFamily: '"Helvetica Neue", Arial, sans-serif'
              }}
            >
              {awayScore}
            </span>
          </div>
        </div>

        {/* Away Team Section */}
        <div className="flex flex-col items-center space-y-2 flex-1">
          <div 
            className="team-logo w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg transition-transform duration-200 hover:scale-105"
            style={{ 
              backgroundColor: awayTeamLogo.backgroundColor,
              width: '40px',
              height: '40px'
            }}
            aria-label={`${awayTeam} logo`}
          >
            {awayTeamLogo.initial}
          </div>
          <span 
            className="team-name text-white text-sm font-normal"
            style={{ 
              fontSize: '14px',
              fontWeight: '400',
              letterSpacing: '0.5px',
              color: '#ffffff'
            }}
          >
            {awayTeam}
          </span>
        </div>
      </div>

      {/* Match Status Indicator (Optional) */}
      {status === 'LIVE' && (
        <div className="flex items-center justify-center mt-2">
          <div className="flex items-center space-x-2 text-xs">
            <div className="w-2 h-2 bg-accent-red rounded-lg bounce-subtle"></div>
            <span className="text-text-secondary font-medium">
              {time} • {status}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchInfoSection;
