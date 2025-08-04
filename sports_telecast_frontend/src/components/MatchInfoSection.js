import React from 'react';

// PUBLIC_INTERFACE
const MatchInfoSection = ({ currentMatch }) => {
  /**
   * Regular inline match information section displaying team details and scores
   * Shows team names, score, and status in a horizontal layout within normal document flow
   * @param {Object} currentMatch - Match data containing team info and scores
   */

  if (!currentMatch) {
    return null;
  }

  const { homeTeam, awayTeam, homeScore, awayScore, status, time } = currentMatch;

  return (
    <div 
      className="bg-secondary-bg rounded-xl p-6 mb-6 hover-lift"
      aria-label={`Match information: ${homeTeam} ${homeScore}, ${awayTeam} ${awayScore}`}
    >
      {/* Match Info Container */}
      <div className="flex items-center justify-between">
        {/* Left: Home Team */}
        <div className="flex items-center space-x-4 flex-1">
          <div 
            className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg"
            style={{ 
              backgroundColor: homeTeam === 'Arsenal' ? '#DC143C' : 
                              homeTeam === 'Chelsea' ? '#034694' :
                              homeTeam === 'Liverpool' ? '#C8102E' :
                              homeTeam === 'Manchester City' ? '#6CABDD' : '#666'
            }}
            aria-label={`${homeTeam} logo`}
          >
            {homeTeam.charAt(0)}
          </div>
          <div>
            <span className="text-text-primary font-semibold text-lg">
              {homeTeam}
            </span>
            <div className="text-text-secondary text-sm">
              {currentMatch.competition}
            </div>
          </div>
        </div>

        {/* Center: Score and Status */}
        <div className="flex flex-col items-center space-y-2">
          {/* Score */}
          <div className="flex items-center space-x-3">
            <span className="text-3xl font-bold text-text-primary font-mono">
              {homeScore}
            </span>
            <span className="text-xl text-text-muted">
              -
            </span>
            <span className="text-3xl font-bold text-text-primary font-mono">
              {awayScore}
            </span>
          </div>
          
          {/* Status and Time */}
          {status === 'LIVE' && (
            <div className="flex items-center space-x-2 bg-accent-red px-3 py-1 rounded-lg">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <span className="text-white font-medium text-sm">
                {time} • LIVE
              </span>
            </div>
          )}
        </div>

        {/* Right: Away Team */}
        <div className="flex items-center space-x-4 flex-1 justify-end">
          <div className="text-right">
            <span className="text-text-primary font-semibold text-lg">
              {awayTeam}
            </span>
            <div className="text-text-secondary text-sm">
              {currentMatch.competition}
            </div>
          </div>
          <div 
            className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg"
            style={{ 
              backgroundColor: awayTeam === 'Arsenal' ? '#DC143C' : 
                              awayTeam === 'Chelsea' ? '#034694' :
                              awayTeam === 'Liverpool' ? '#C8102E' :
                              awayTeam === 'Manchester City' ? '#6CABDD' : '#666'
            }}
            aria-label={`${awayTeam} logo`}
          >
            {awayTeam.charAt(0)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchInfoSection;
