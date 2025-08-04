import React from 'react';

// PUBLIC_INTERFACE
const Header = ({ currentMatch, viewerCount }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-primary-bg border-b border-border-color h-16">
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-4">
          <div className="text-2xl font-bold text-accent-red">
            SportsStream
          </div>
        </div>
        
        {/* Current Match Info */}
        <div className="hidden md:flex items-center space-x-6">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-accent-red rounded-full flex items-center justify-center text-xs font-bold">
                A
              </div>
              <span className="text-sm">{currentMatch.homeTeam}</span>
            </div>
            
            <div className="font-mono text-lg font-bold">
              {currentMatch.homeScore} : {currentMatch.awayScore}
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm">{currentMatch.awayTeam}</span>
              <div className="w-6 h-6 bg-accent-blue rounded-full flex items-center justify-center text-xs font-bold">
                C
              </div>
            </div>
          </div>
          
          {/* Match Status */}
          <div className="flex items-center space-x-2">
            <div className="bg-accent-red text-white px-2 py-1 rounded-sm text-xs font-bold pulse-animation">
              {currentMatch.status}
            </div>
            <span className="text-xs text-text-secondary">{currentMatch.time}</span>
          </div>
        </div>
        
        {/* Viewer Count and Controls */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-accent-green rounded-full pulse-animation"></div>
            <span className="text-sm text-text-secondary">
              {viewerCount.toLocaleString()} viewers
            </span>
          </div>
          
          {/* User Profile */}
          <div className="w-8 h-8 bg-accent-blue rounded-full flex items-center justify-center text-sm font-bold cursor-pointer hover:bg-hover-bg transition-standard">
            U
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
